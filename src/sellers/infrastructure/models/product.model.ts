import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: {
		type: Number,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	seller: {
		type: mongoose.Schema.ObjectId,
		ref: 'Seller',
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Product', productSchema);
