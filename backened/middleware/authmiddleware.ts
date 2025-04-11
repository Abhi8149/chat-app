import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
import { verify } from "jsonwebtoken";
import Users from "../model/Usermodel";

export const protect=async(req:Request,res:Response, next:NextFunction):Promise<void>=>{
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            let token=req.headers.authorization.split(" ")[1];

            if(!token){
                console.log('No authorization token found');
                res.status(403).send('No authorization token found')
            }
            
            const decodeId = verify(token, process.env.JWT_SECRET!);

            if (typeof decodeId !== 'object' || !('id' in decodeId)) {
                console.log('Invalid token payload');
                res.status(400).send('Invalid token payload');
                return;
            }

            const user = await Users.findById(decodeId.id).select('-password');
    
            if(!user){
                console.log('User not found with these details')
                res.status(401).send('User not found with these details')
            }
    
            req.user=user;
            next();
        } catch (error) {
            console.log(error)
            res.status(500).send('Internal server error')
        }


    }
}