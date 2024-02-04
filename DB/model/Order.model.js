import mongoose, { Schema, model, Types } from 'mongoose';
const orderSchema = new Schema({

    userId: {
        type: Types.ObjectId, ref: 'User', required: true,
    },

    products: [{
        name: { type: String, required: true },
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        finalPrice: { type: Number, required: true },
    }],
    finalPrice: {
        type: Number, required: true
    },
    address: {
        type: String, required: true
    },
    phone: {
        type: String, required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'cancelled', 'confirmed', 'onWay', 'deliverd'],
    },
    note: String,
    reasonRejected: String,
    shipping: {
        type: Number,
        min: 0,
    },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

const orderModel = mongoose.models.Order || model('Order', orderSchema);
export default orderModel;
