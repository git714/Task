const fs=require('fs');

const dir=fs.readdirSync(`${__dirname}`)
let routes=[]
let init=()=>{
    fs.readdirSync(`${__dirname}`).forEach((file)=>{

        if (file.indexOf('.js') && file.indexOf('index.js') < 0) {
            let route = require('./' + file)
            routes.push(route)
        }

    })
}


init()
module.exports = routes