import mongoose , {Schema,model} from 'mongoose'
const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
    image:{
        type:Object,
    },
    role:{
        type:String,
        default:'User',
        enum:['User','Admin'],
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','Not_Active'],
    },
    address:{
        type:String,
    },
    gender:{
        type:String,
        enum:['Male','Female'],
    },
    sendCode:{
        type:String,
        default:null,
    }
},{
    timestamps:true,
}
);

const userModel = mongoose.models.User || model('User',userSchema);
export default userModel;
