import { Request,Response } from "express"
import Chat from "../model/Chatmodel";
import Users from "../model/Usermodel";
// accessing one on one chat with req.user._id and the person userId

export const one_on_one=async(req:Request,res:Response):Promise<void>=>{
    const {userId}=await req.body();

    if(!userId){
        console.log('userId is empty');
        res.sendStatus(400)
    }

    var isChat=await Chat.find({
        isGroup:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate('users','-password')
    .populate('latestMessage')

    isChat=await Users.populate(isChat,{
        'path':'latestMessage.sender',
        'select':'name pic email'
    })

    if(isChat.length>0){
        res.send(isChat[0])
    }

    var chatData={
        chatName:"sender",
        isGroupChat:false,
        users:[userId,req.user._id]
    }
    try {
    const chat=await Chat.create(chatData)
    const FullChat=await Chat.findById(chat._id).populate('users','-password');

    res.status(201).json({
        success:true,
        message:FullChat
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//Fetch all chats for a user

export const allChats=async(req:Request, res:Response):Promise<void>=>{
    try {
        const chats=await Chat.find({users:{$elemMatch: {$eq:req.user._id}}})
        .populate('users','-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({updatedAt:-1})
    
        const result=await Users.populate(chats,{
            'path':'latestMessage.sender',
            'select':'name pic email'
        })
    
        res.status(200).send(result)   
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
}

//creating a group chat
export const createGroup=async(req:Request, res:Response):Promise<void>=>{
    const {chatName,user}=await req.body;
    if(!chatName || !user){
        console.log('chatname or users are empty')
        res.status(400).send('Please enter the chatName or valid users')
    }

    const users=await JSON.parse(user)

    if(users.length<2){
        console.log('users in a group chat must be more than 2')
        res.status(400).send('group can be formed of more than 2 members')
    }

    users.push(req.user)

    try {
        const groupChat=await Chat.create({
            chatName:'sender',
            isGroupChat:true,
            users:users,
            groupAdmin:req.user
        })

        const FullChat=await Chat.findOne({_id:groupChat._id}).populate('users','-password').populate('groupAdmin','-password')

        res.status(200).send(FullChat)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

//Add a user to a group
export const addUser=async(req:Request,res:Response):Promise<void>=>{
    const {chatId,userId}=await req.body();
     
    const reqId=req.user._id;
    //check if the request done is by admin or not
    const checkAdmin=await Chat.findById(chatId).populate('groupAdmin','-password')
    if(checkAdmin._id!==reqId){
        res.status(404).send('Your are not admin, Only admin can add a user to your group')
    }
    const userAdded=await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId}
    },{new:true}).populate('users','-password').populate('groupAdmin', '-password')

    if(!userAdded){
        res.status(400).send('Something got wrong')
    }

    res.send(userAdded)
}

//Remove user from a group
export const removeUser=async(req:Request,res:Response):Promise<void>=>{
    const {chatId,userId}=await req.body();

    const reqId=req.user._id;
    //check if the request done is by admin or not
    const checkAdmin=await Chat.findById(chatId).populate('groupAdmin','-password')
    if(checkAdmin._id!==reqId){
        res.status(404).send('Your are not admin, Only admin can add a user to your group')
    }
    const removeduser=await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },{new:true}).populate('users','-password').populate('groupAdmin', '-password')

    if(!removeduser){
        res.status(400).send('Something got wrong')
    }

    res.send(removeduser)
}

//Rename the group
export const renameGroup=async(req:Request,res:Response):Promise<void>=>{
    const {chatId, name}=await req.body();

    const reqId=req.user._id;
    //check if the request done is by admin or not
    const checkAdmin=await Chat.findById(chatId).populate('groupAdmin','-password')
    if(checkAdmin._id!==reqId){
        res.status(404).send('Your are not admin, Only admin can add a user to your group')
    }

    const updatedGroupName=await Chat.findByIdAndUpdate(chatId,{
        ChatName:name
    },{new:true}).populate('users','-password').populate('groupAdmin', '-password')

    if(!updatedGroupName){
        res.status(400).send('Could not able to update the name of group')
    }

    res.send(updatedGroupName)
}