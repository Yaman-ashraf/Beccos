import userModel from "../../../DB/model/User.model.js";
import { senderEmail } from "../../Services/sender.js";

export const getUsers = async (req, res) => {
  let queryObj = { ...req.query };
  const execQuery = ["page", "size", "limit", "sort", ];
  execQuery.map((ele) => {
    delete queryObj[ele];
  });
   const countQuery = await userModel.find(queryObj);
  queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(
      /\b(in|nin|eq|neq)\b/g,
      (match) => `$${match}`
    );
    queryObj = JSON.parse(queryObj);
  const users = await userModel.find(queryObj).sort(req.query.sort?.replaceAll(",", " "));
  return res
    .status(200)
    .json({ message: "success", total: countQuery.length, count: users.length, users });
};

export const updateUser = async(req,res)=>{
try{
    const {userId} = req.params;
    const user = await userModel.findById(req.params.userId);
    if(!user){
        return res.status(404).json({message:"user not found"});
    }

    console.log(user.email);
    console.log(req.body.email);

    if(await userModel.findOne({email:req.body.email,_id:{$ne:userId}}) ){
        return res.status(400).json({message:"email already in use"});
    }

    if(await userModel.findOne({name:req.body.name,_id:{$ne:userId}}) ){
        return res.status(400).json({message:"name already in use"});
    }

    if(req.body.phone){

        if(await userModel.findOne({phone:req.body.phone,_id:{$ne:userId}}) ){
            return res.status(400).json({message:"phone already in use"});
        }
    }


    const newUser = await userModel.findByIdAndUpdate(userId,req.body,{new:true});

    return res.status(200).json({message:"success",user:newUser});
}catch(error){
    return res.status(500).json({message:"catch",error:error.stack});
}

}

export const getUserData = async(req,res)=>{

    const user = await userModel.findById(req.user._id);
    return res.status(200).json({message:"success",user});
}


export const getUser = async(req,res)=>{

    const user = await userModel.findById(req.params.userId);
    return res.status(200).json({message:"success",user});
}
export const contact = async(req,res)=>{

    const {email,name,message,phone,title} = req.body;
    const html = `<div>
    <p>from : ${name}</p>
    <p>${message}</p>
    <p>phone :${phone}</p>
    </div>`;
    await senderEmail(email,`hiba2002pl@gmail.com`,`contact : ${title}`,html);
    return res.status(200).json({message:"success"});

}
