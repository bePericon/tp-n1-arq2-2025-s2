import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
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
	quantity: {
		type: Number,
		require: true,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;
