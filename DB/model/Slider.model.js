import mongoose, { Schema, Types, model } from 'mongoose'
const sliderSchema = new Schema({

    image: {
        type: Object,
        required: true,
    },
    link: {
        type: String,
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Not_Active']
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },

}
);



const sliderModel = mongoose.models.Slider || model('Slider', sliderSchema);
export default sliderModel;
