const express = require('express');
const router = express.Router();
const authMiddleware=require('../middlewares/auth')

//Controller
const User = require('../controllers/user');
let routeprefix='/users'
//Routes

router.get(`${routeprefix}/`,authMiddleware.protect,authMiddleware.roleMiddleware(['user','admin','manager']), User.getProfile);
router.post(`${routeprefix}/login`, User.login);
router.post(`${routeprefix}/signup`, User.create);


module.exports = router;