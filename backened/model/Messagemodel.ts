import mongoose,{Schema,models} from 'mongoose';

const MessageSchema=new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
    readBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
},{timestamps:true})


const Message=models.Message || mongoose.model('Message',MessageSchema);

export default Message