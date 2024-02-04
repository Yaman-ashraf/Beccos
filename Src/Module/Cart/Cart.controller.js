import cartModel from "../../../DB/model/Cart.model.js"
import productModel from "../../../DB/model/Product.model.js";

export const addToCart = async(req,res)=>{
    const {productId,size,color} = req.body;
   const cart = await cartModel.findOne({userId:req.user._id});
   if(!cart){
    const newCart = await cartModel.create({
        userId:req.user._id,
        products:{productId,size,color}

    })

    return res.status(201).json({message:"success",cart:newCart});
   }


   for(let i=0;i<cart.products.length;i++){

    if(cart.products[i].productId == productId ){
        return res.status(409).json({message:"product already added"})
    }

   }

   cart.products.push({productId,size,color});
   await cart.save();

   return res.status(201).json({message:"success",cart});
}


export const removeItem = async(req,res)=>{
try{

    const {productId} = req.body;
    const cart= await cartModel.findOneAndUpdate({userId:req.user._id},{
        $pull:{
            products:{
                productId
            }
        }
    },{new:true})



    if(!cart){
        return res.status(400).json({message:"error",cart})
    }

    return res.status(200).json({message:"success",cart});
}catch(error){
    return res.status(500).json({message:"catch error",error:error.stack});

}

}


export const clearCart = async(req,res)=>{

   const cart =  await cartModel.updateOne({userId:req.user._id},{
        products:[]});

        return res.status(200).json({message:"success"});
}

export const updateQuantity = async(req,res)=>{

    const {productId,options} = req.body;

    const inc = (options=='+')?1:-1;

    const cart = await cartModel.findOneAndUpdate({userId:req.user._id,"products.productId":productId},
        {$inc:{
            "products.$.quantity":inc
        }}
    ,{new:true});

    if(!cart){
        return res.status(400).json({message:"can't update quantity"})
    }

    return res.status(200).json({message:"success"});

}

export const getCart = async(req,res)=>{

    const cart = await cartModel.findOne({userId:req.user._id});

    const detailsProducts = await Promise.all(
    cart.products.map( async(cartProduct)=>{
        const product = await productModel.findById(cartProduct.productId);
        return {
            ...cartProduct.toObject(),
            details:product.toObject(),
        }
    } )
    );
    return res.status(200).json({message:"success",count:detailsProducts.length,products:detailsProducts});
}
