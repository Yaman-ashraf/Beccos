import mongoose, { Schema, Types, model } from 'mongoose'
const brandSchema = new Schema({
    image: {
        type: Object,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
}
);

const brandModel = mongoose.models.Brand || model('Brand', brandSchema);
export default brandModel;
