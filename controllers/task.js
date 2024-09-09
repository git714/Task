// const Task = require('../models/Task');
const { sendEmailNotification } = require('../services/notification');
const { ValidationError } = require('../helpers/error');
const taskValidator = require('../validators/task')
// Create Task
exports.createTask = async (req, res, next) => {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    try {
        taskValidator.canCreateTask(req.body)
        if (req.user.roles.includes('manager') && !req.user.team.includes(assignedTo)) {
            throw new ValidationError('Managers can assign task to their team members only')
        }
        const task = db.task({ title, description, dueDate, priority, assignedTo, createdBy: req.user.id });
        await task.save();
        // Notify the assigned user if they have email notifications enabled
        const assignedUser = await db.user.findById(assignedTo);
        if (!assignedUser) {
            throw new ValidationError('Invalid Assigned user id')
        }
        if (assignedUser.notificationPreferences.emailNotifications) {
            await sendEmailNotification(
                assignedUser.email,
                'Task Assigned',
                `A new task "${task.title}" has been assigned to you. Due date: ${task.dueDate}`
            );
        }

        res.status(201).json(task);
    } catch (err) {
        next(err)
    }
};

// Get Tasks
exports.getTasks = async (req, res, next) => {
    try {
        let tasks
        if (req.user.roles.includes('admin')) {
            tasks = await db.task.find().sort({ dueDate: 1 });
        } else if (req.user.roles.includes('manager')) {
            const manager = await db.user.findById(req.user.id).populate('team');
            const teamMemberIds = manager.team.map(member => member._id);

            // Find all tasks assigned to the team members
            const teamTasks = await db.task.find({ assignedTo: { $in: teamMemberIds } }).sort({ dueDate: 1 });

            if (teamTasks.length === 0) {
                res.status(200).json({ message: 'No tasks found for your team members' });
            }
            tasks = teamTasks
        } else {
            tasks = await db.task.find({ assignedTo: req.user.id }).sort({ dueDate: 1 });
        }

        res.json(tasks);
    } catch (err) {
        next(err)
    }
};

// Update Task
exports.updateTask = async (req, res, next) => {
    try {
        const task = await db.task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (req.user.roles.length === 1 && req.user.roles.includes('user')) {
            if (task.assignedTo.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
        }

        Object.assign(task, req.body);
        await task.save();
        // Notify the assigned user about the task status update
        const assignedUser = await db.user.findById(task.assignedTo);
        if (assignedUser.notificationPreferences.emailNotifications) {
            await sendEmailNotification(
                assignedUser.email,
                'Task Status Updated',
                `The status of task "${task.title}" has been updated to "${task.status}".`
            );
        }
        res.json(task);
    } catch (err) {
        next(err)
    }
};

// Delete Task
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await db.task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        await task.deleteOne();
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        next(err)
    }
};
