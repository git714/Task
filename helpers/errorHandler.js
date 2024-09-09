module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }
    if (err.code === 11000) {
        // MongoDB duplicate key error code
        const field = Object.keys(err.keyPattern)[0]; // Get the field that caused the duplicate error
        const value = err.keyValue[field]; // Get the duplicate value
        console.error(`Error:${field} ${value} is already in use.`);
        return res.status(400).json({ isSuccess: false, message: `${field} ${value} is already exists` });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ isSuccess: false, message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ isSuccess: false, message: 'Invalid Token' });
    }

    // default to 500 server error
    if (process.environment === 'prod') {
        
        return res.status(500).json({ isSuccess: false, message: "Internal server error" });
    } else {
        console.log(err)
        return res.status(500).json({ isSuccess: false, message: err.message });
    }

}