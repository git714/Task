exports.toModel = (entity) => {
  
    let model = {
        id: entity.id,
        name:entity.name,
        email: entity.email,
        roles: entity.roles
    }
 
    return model
}

exports.toRegisterModel = (entity) => {

    let model = {
        id: entity.id,
        name:entity.name,
        email: entity.email,
        password:entity.password,
        roles: ['user']
    }
 
    return model
}



exports.toSearchModel = (entities) => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}