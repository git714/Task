const  mongoose=require('mongoose')

module.exports = {
  title: { type: String, required: true },
  description: { type: String,required: true },
  dueDate: { type: Date ,required: true},
  priority: { type: String, enum: ['low', 'medium', 'high'],required: true, default: 'medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], required: true,default: 'pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId,required: true, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId,required: true, ref: 'User' }
}
