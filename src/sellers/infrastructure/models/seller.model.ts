import mongoose, { Schema } from 'mongoose';

const sellerSchema = new Schema({
	companyName: { type: String, required: true },
	mail: { type: String, required: true },
	products: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
		},
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Seller', sellerSchema);
