import express from 'express';
import multer from 'multer';
import cloudinary from '../../cloudinaryConfig';
import { Request } from 'express';
import { Response } from 'express';

const uploadRouter=express.Router();

const storage=multer.memoryStorage();
const upload=multer({storage});
interface MulterRequest extends Request {
     formdata?: multer.File;
}

uploadRouter.post("/upload", upload.single("image"), async(req:MulterRequest,res:Response):Promise<void>=>{
    console.log(req.formdata)
try {
    const file=req.formdata;
    if(!file){
        res.status(400).json({message:"No file uploaded"})
    }

    const result=cloudinary.uploader.upload_stream(
        {folder:"chat-app"},
        (error,result)=>{
            if(error){
                res.status(500).json({message:error.message})
            }
            res.status(200).json({url: result?.secure_url});
        }
    );

    const stream=result;
    stream.end(file.buffer);
} catch (error) {
    res.status(500).json({message:error.message});
}
})

export default uploadRouter;