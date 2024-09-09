const jwt = require('jsonwebtoken')
const userValidator = require('../validators/user')
const userMapper = require('../mappers/user')
const bcrypt = require('bcrypt')
const { ValidationError } = require('../helpers/error')
// exports.getAll = async (req, res, next) => {
//     try {
//         const Users=await db.user.find({})
//         const mappedUsers=userMapper.toSearchModel(Users)
//         res.status(200).json({
//             isSuccess: true,
//             data:mappedUsers,
//             message: "Data fetched successfully"
//         })
//     } catch (err) {
//         next(err)

//     }
// }


// exports.getById = async (req, res, next) => {
//     try {
//         let id = req.params.id
//        await userValidator.canGetById(id)
//         const Users=await db.user.findById(id)
//         const mappedUsers=userMapper.toModel(Users)
//         res.status(200).json({
//             isSuccess: true,
//             data:mappedUsers,
//             message: "Data fetched successfully"
//         })
//     } catch (err) {
//         next(err)

//     }
// }

exports.create = async (req, res, next) => {
    try {
        let entity = req.body
        await userValidator.canCreate(entity)
        let user = userMapper.toRegisterModel(entity)
        const createdUser = await db.user.create(user)
        const { password, ...userWithoutPassword } = createdUser.toObject();
        const token = jwt.sign({ id: user._id, role: user.roles }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(201).json({
            isSuccess: true,
            data: userWithoutPassword,
            token: token,
            message: "created successfully"
        })
    } catch (err) {
        next(err)

    }

}

exports.login = async (req, res, next) => {
    try {
        let entity = req.body
        userValidator.canLogin(entity)
        const user = await db.user.findOne({ email: entity.email });
        if (!user) throw new ValidationError('Invalid credentials');
        const isMatch = await bcrypt.compare(entity.password.toString(), user.password);
        if (!isMatch) throw new ValidationError('Invalid credentials');
        const { password, ...userWithoutPassword } = user.toObject();
        const token = jwt.sign({ id: user._id, role: user.roles }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(200).json({
            isSuccess: true,
            data: userWithoutPassword,
            token: token,
            message: "Login successfully"
        })
    } catch (err) {
        next(err)

    }

}



// exports.removeById = async (req, res, next) => {
//     try {
//         let id = req.params.id
//         userValidator.canDeleteById(id)
//      const deletedUser= await db.user.findByIdAndDelete(id)
//         res.status(200).json({
//             isSuccess: true,
//             message: deletedUser?"Data deleted successfully":"No Id exists"
//         })

//     } catch (err) {
//         next(err)

//     }
// }


// exports.updateById = async (req, res, next) => {
//     try {
//         let id = req.params.id
//         userValidator.canUpdateById(id)
//      const updatedUser= await db.user.findOneUpdate(id)
//         res.status(200).json({
//             isSuccess: true,
//             message: deletedUser?"Data deleted successfully":"No Id exists"
//         })

//     } catch (err) {
//         next(err)

//     }
// }


exports.getProfile = async (req, res) => {
    try {
        let user
        if (req.user.isAdmin) {
            user = await db.user.find().select('-password');
        } else {
            user = await db.user.findById(req.user.id).select('-password'); // Exclude the password field
        }

        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.status(200).json({
            isSuccess: true,
            data: user,
            message: "Fetched successfully"
        })
    } catch (err) {
        next(err);
    }
};