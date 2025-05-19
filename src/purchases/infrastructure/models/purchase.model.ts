import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},
	quantity: {
		type: Number,
		require: true,
	},
	productId: {
		type: String,
		require: true,
	},
	name: {
		type: String,
		require: true,
	},
	description: {
		type: String,
		require: true,
	},
	price: {
		type: Number,
		require: true,
	},
	sellerId: {
		type: String,
		require: true,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;
