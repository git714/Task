const express = require('express');
const router = express.Router();
const authMiddleware=require('../middlewares/auth')

//Controller
const Task = require('../controllers/task');
let routeprefix='/task'
//Routes

router.post(`${routeprefix}/`,authMiddleware.protect,authMiddleware.roleMiddleware(['admin', 'manager']), Task.createTask);
router.get(`${routeprefix}/`, authMiddleware.protect, Task.getTasks);
router.put(`${routeprefix}/:id`, authMiddleware.protect, authMiddleware.roleMiddleware(['manager']), Task.updateTask);
router.delete(`${routeprefix}/:id`, authMiddleware.protect, authMiddleware.roleMiddleware(['admin']), Task.deleteTask);

module.exports = router;