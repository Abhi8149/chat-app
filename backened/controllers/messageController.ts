import { Request, Response } from "express";
import Message from "../model/Messagemodel";
import Users from "../model/Usermodel";
import Chat from "../model/Chatmodel";

//getting all the messages
export const allmessages=async(req:Request,res:Response):Promise<void>=>{
    try {
        const messages=await Message.findOne({chat:req.params.chatId}).populate('sender', 'name pic email').populate('chat');
        if(!messages){
              console.log('No messages found')
              res.status(400).send('No messages of this group is found')
        }
        res.status(201).send(messages);
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

//creating a new message
export const NewMessage=async(req:Request,res:Response):Promise<void>=>{
    try {
        const {content,chatId}=await req.body();

        if(!content || !chatId){
            res.status(403).send('Content in message is not present or eithe the group is not valid')
        }

        let createdMessage=await Message.create({
            sender:req.user._id,
            content:content,
            chat:chatId
        })

        createdMessage=await createdMessage.populate('sender','name pic').execPopulate();
        createdMessage=await createdMessage.populate('chat').execPopulate();

        createdMessage=await Users.populate(createdMessage,{
            path:'chat.users',
            select:'name pic email'
        })

        await Chat.findByIdAndUpdate(chatId,{latestMessage:createdMessage})

        res.status(201).json(createdMessage)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}