const express=require('express');
const app=express();
const cors = require('cors')
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;
require('dotenv').config({path:envFile})
const router=express.Router();
const errorHandler=require('./helpers/errorHandler')
console.log(app.get('env'))

require('./database').configure()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(router)

const routes=require('./routes')

routes.forEach((route)=>{
    app.use('/api/v1',route)
})
// Catch undefined routes (404)
app.use((req, res, next) => {
    const error = new Error('url not found');
    error.status = 404;
    next(error);
});


// Global error handler
app.use(errorHandler);


app.listen(process.env.port,()=>{

    console.log(`App is running on port ${process.env.port}`)
})