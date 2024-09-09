const { ValidationError } = require('../helpers/error')
const {validateMongoId}=require('../helpers/validatorUtil')



exports.canCreate =async (entity) => {
    let emailreg = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-]+\.){1,2}[A-Za-z]{2,4}$/;
    const { name, email, password } = entity
    if (!name) {
        throw new ValidationError('Name is required')
    }

    if (!email) {
        throw new ValidationError('Email is required')
    }
    if (!emailreg.test(email)) {
        throw new ValidationError('Invalid Email')
    }

    if (!password) {
        throw new ValidationError('Password is required')
    }

    const userExists = await db.user.findOne({ email });
    if (userExists) throw new ValidationError('User already exists');


}
exports.canLogin=(entity)=>{
    const {email, password } = entity
    let emailreg = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-]+\.){1,2}[A-Za-z]{2,4}$/;
    if (!email) {
        throw new ValidationError('Email is required')
    }
    if (!emailreg.test(email)) {
        throw new ValidationError('Invalid Email')
    }

    if (!password) {
        throw new ValidationError('Password is required')
    }

}



exports.canGetById = (id) => {
    if (!validateMongoId(id)) {
        throw new ValidationError('Invalid ID format');
    }
}
exports.canDeleteById = (id) => {
    if (!validateMongoId(id)) {
        throw new ValidationError('Invalid ID format');
    }
}

exports.canUpdateById = (id) => {
    if (!validateMongoId(id)) {
        throw new ValidationError('Invalid ID format');
    }
}