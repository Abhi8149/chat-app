import mongoose,{Schema,models} from 'mongoose';

const ChatSchema=new Schema({
    chatName:{
        type:String,
        required:true
    },
    isGroupChat:{
        type:Boolean,
        default:false,
    },
    users:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
},{timestamps:true})

const Chat=models.Chat || mongoose.model('Chat', ChatSchema);

export default Chat;