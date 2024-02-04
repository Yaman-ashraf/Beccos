import mongoose , {Schema,Types,model} from 'mongoose'
const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        required:true,
    },

    status:{
        type:String,
        default:'Active',
        enum:['Active','Not_Active']
    },
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:true},

},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
);

categorySchema.virtual('products',{
    localField:'_id',
    foreignField:'categoryId',
    ref:'Product',
})

const categoryModel = mongoose.models.Category || model('Category',categorySchema);
export default categoryModel;
