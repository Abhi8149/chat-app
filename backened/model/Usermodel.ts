import mongoose, {Schema,models} from 'mongoose';

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    isAdmin:{
        type:Boolean,
        required:true,
        defaul:false
    }
},{timestamps:true})

const Users=models?.Users || mongoose.model('User',UserSchema)

export default Users