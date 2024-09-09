'use strict';
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');

(async () => {
    try {
        // Read all files in the current directory
        const files = fs.readdirSync(__dirname);

        files.forEach((file) => {
            if (file.endsWith('.js') && file !== 'index.js') {
                const name = path.basename(file, '.js');
                let entity = require('./' + file)

                // Define a schema with a timeStamp field
                const schema = new mongoose.Schema({
                    ...entity,
                    timeStamp: {
                        type: Date,
                        default: Date.now
                    }
                });

                if(file==='user.js'){
                    schema.methods.matchPassword = async function (enteredPassword) {
                        return await bcrypt.compare(enteredPassword, this.password);
                    };
                }


                // Pre-save hook to update timeStamp
                schema.pre('save', async function (next) {
                    if(file==='user.js'){
                        if (!this.isModified('password')) return next();
                        const salt = await bcrypt.genSalt(10);
                        this.password = await bcrypt.hash(this.password, salt);
                        next();
                    }
                    this.timeStamp = Date.now();
                    next();
                });

                // Register the model with mongoose
                mongoose.model(name, schema);
            }
        });
    } catch (error) {
        console.error('Error initializing models:', error);
    }
})();

module.exports = mongoose.models;
