import userModel from "../../../DB/model/User.model.js";
import bcrypt from 'bcryptjs'
import { sendEmail } from "../../Services/email.js";
import jwt from 'jsonwebtoken'
import { customAlphabet } from "nanoid";
export const signup = async (req,res)=>{
    try{
        const {name,email,password,role='User'} = req.body;
        const user = await userModel.findOne({email});
        if(user){
            return res.status(409).json({message:"email already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALTROUND));
        const createUser = await userModel.create({name,email,password:hashedPassword,role});
        if(!createUser){
            return res.status(400).json({message:"error while creating user"});
        }
        const token = jwt.sign({email},process.env.SIGNUPTOKEN);
        const link = `${req.protocol}://${req.headers.host}/auth/${token}`

        const html = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h2 {
            color: #333;
        }

        p {
            margin-bottom: 20px;
        }

        .btn {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
        }

        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Confirmation</h1>
        <h2>BECCOS </h2>
        <p>Welcome to our platform! Please confirm your email address to complete the registration process.</p>
        <p>An email has been sent to your inbox. Click the button below to confirm your email.</p>
        <a href="${link}" class="btn">Confirm Email</a>
    </div>
</body>
</html>

        `;
        await sendEmail(email,"confirm email",html)
        return res.status(201).json({message:"success",createUser});
    }
    catch(error){

        return res.status(500).json({message:"catch error",error:error.stack});
    }
}
export const confirmEmail =async (req,res)=>{
   const {token} = req.params;
   const decoded = jwt.verify(token,process.env.SIGNUPTOKEN);
   if(!decoded){
    return res.status(400).json({message:"invalid token"});
   }
   const user = await userModel.findOneAndUpdate({email:decoded.email,confirmEmail:false},{confirmEmail:true});
   if(!user){
    return res.status(400).json({message:"invalid confirm email"});
   }
   return res.status(200).json({message:"success"});
}
export const signin = async(req,res)=>{

    const {email,password} = req.body;
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(404).json({message:"invalid data"});
    }
    if(!user.confirmEmail){
        return res.status(400).json({message:"plz confirm your email"});
    }
    const match = await bcrypt.compare(password,user.password);
    if(!match){
        return res.status(404).json({message:"invalid data"});
    }

    const token = jwt.sign({id:user._id,status:user.status,role:user.role},process.env.LOGINSECRET)
    return res.status(200).json({message:'success',token});
}

export const sendCode = async(req,res)=>{

    const {email} =req.body;

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    const nanoid = customAlphabet('1234567890abcdef', 4);
    const code = nanoid();

    user.sendCode = code;
    await user.save();
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Confirmation</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    h2 {
        color: #333;
    }

    p {
        margin-bottom: 20px;
    }

    .btn {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
    }

    .btn:hover {
        background-color: #0056b3;
    }
</style>
</head>
<body>
<div class="container">
    <h1>Email Confirmation</h1>
    <h2>BECCOS </h2>
    <p><p>An email containing a code for resetting your password has been sent to your inbox. Please check your email and use the provided code to reset your password.</p>
    </p>
     <h2 class="btn">code is ${code}</h2>
</div>
</body>
</html>

    `;
    await sendEmail(email,"reset password",html);
    return res.status(200).json({message:'success'});



}

export const forgotPassword = async(req,res)=>{
    const {email,code,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    if(user.sendCode != code){
        return res.status(400).json({message:"invalid code"});
    }
    user.password = await bcrypt.hash(password,parseInt(process.env.SALTROUND));
    user.sendCode=null;
    await user.save();
    return res.status(200).json({message:"success"});
}
