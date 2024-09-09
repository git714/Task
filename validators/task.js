const { ValidationError } = require('../helpers/error');
const {validateMongoId}=require('../helpers/validatorUtil');
exports.canCreateTask = (entity) => {
    const { title, description, dueDate, priority, status, assignedTo } = entity
    if (!title) {
        throw new ValidationError('title is required')
    }

    if (!description) {
        throw new ValidationError('description is required')
    }

    if (!dueDate) {
        throw new ValidationError('dueDate is required')
    }

    if (!priority) {
        throw new ValidationError('priority is required')
    }
    if (!status) {
        throw new ValidationError('status is required')
    }

    if (!assignedTo) {
        throw new ValidationError('Password is required')
    }
    if (!validateMongoId(assignedTo)) {
        throw new ValidationError('Invalid assignedTo id');
    }
    


}