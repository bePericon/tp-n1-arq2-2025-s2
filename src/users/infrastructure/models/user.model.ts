import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
	name: { type: String, required: true },
	lastName: { type: String, required: true },
	mail: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
