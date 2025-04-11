import { Request,Response } from "express"
import Users from "../model/Usermodel"
import { generateToken } from "../config/generateToken"
import bcrypt from 'bcrypt';
export const allUsers=async(req:Request, res:Response):Promise<void>=>{
    try {
        const keyword=req.query.search
        ?{
            $or:[
                {name:{$regex:req.query.search, $options:"i"}},
                {email:{$regex:req.query.search, $options:"i"}}
            ],
        }
        :{}
    
        const users=await Users.find(keyword).find({_id:{$ne:req.user._id}})
    
    
        res.status(200).json({
            success:false,
            message:users,
        })
    } catch (error:any) {
        console.log(error.message)
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}

export const register=async(req:Request, res:Response)=>{

    try {
        const {name,email,password,pic}=await req.body();

        if(!name || !email || !password){
            res.status(401).json({
                success:false,
                message:'Please enter all details'
            })
        }
    
        const checkUserExist=await Users.findOne({email});
    
        if(checkUserExist){
            res.status(401).json({
                success:false,
                message:'User already exist'
            })
        }
        
        const hashedpassword=bcrypt.hashSync(password,10)
        const user=await Users.create({
            name,
            email,
            password:hashedpassword,
            pic
        });
    
        if(user){
           res.status(201).json({
            success:true,
            message:
             'User registered succefully'
            
           })
        }
        else{
            res.status(403).json({
                success:false,
                message:'User failed to register'
            })
        }   
    } catch (error:any) {
        console.log(error.message)
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const login=async(req:Request,res:Response)=>{
    const {email, password}=await req.body();

    try {
        if(!email || !password){
            res.status(403).json({
                success:false,
                message:'please enter all details'
            })
        }

        const user=await Users.findOne({ email })
        if(!user){
            res.status(401).json({
                success:false,
                message:'User do not exist'
            })
        }

        const comparepassword=bcrypt.compareSync(password,user.password);

        if(!comparepassword){
            res.status(403).json({
                success:false,
                message:'please enter the correct password'
            })
        }

        res.status(201).json({
            success:true,
            message:{
                _id:user._id,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
                pic:user.pic,
                token:generateToken(user._id)
            }
           })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}