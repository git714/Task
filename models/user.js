'use strict'
const  mongoose=require('mongoose')
module.exports = {
    
        
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
        type: [String],
        enum: ['user', 'manager', 'admin'],
        default: ['user'],
      },
    notificationPreferences: {
        emailNotifications: {
          type: Boolean,
          default: true,
        },
      },
      team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      }],
    createdAt: { type: Date, default: Date.now }
}
