const mongoose = require('mongoose')

exports.validateMongoId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}