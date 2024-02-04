import cartModel from "../../../DB/model/Cart.model.js";
import orderModel from "../../../DB/model/Order.model.js";
import productModel from "../../../DB/model/Product.model.js";
import userModel from "../../../DB/model/User.model.js";
import { sendEmail } from "../../Services/email.js";

export const create = async(req,res)=>{

    const userOrder = await orderModel.findOne({userId:req.user._id,status:'pending'});
    if(userOrder){
        return res.status(400).json({message:"you have pending order"});
    }
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart || cart.products.length == 0){
        return res.status(400).json({message:"cart is empty"});
    }

    req.body.products = cart.products;

    let subTotal = 0;
    let finalProductList = [];
    for(let product of req.body.products){

        const checkProduct = await productModel.findOne({
            _id:product.productId,
            stock:{$gte:product.quantity}
        })
        if(!checkProduct){
            return res.status(400).json({message:"product quantity not avalible"});
        }
        product = product.toObject();
        product.name = checkProduct.name;
        product.stock = checkProduct.stock
        product.unitPrice = checkProduct.finalPrice;
        product.finalPrice = checkProduct.finalPrice * product.quantity;
        subTotal+=product.finalPrice;
        finalProductList.push(product);
    }

    if(!req.body.adress || !req.body.phone){
        const user = await userModel.findById(req.user._id);
        if(!req.body.address){
            req.body.address = user.address;
        }
        if(!req.body.phone){
            req.body.phone = user.phone;
        }
    }



    const order = await orderModel.create({
        userId:req.user._id,
        products:finalProductList,
        finalPrice:subTotal,
        address:req.body.address,
        phone:req.body.phone,
        note:req.body.note,
        shipping:req.body.shipping
    });

    if(!order){
        return res.statsu(400).json({message:"error while creating order"});
    }


    for(const product of req.body.products){
       const pr= await productModel.findByIdAndUpdate({_id:product.productId},{
            $inc:{
                stock:-product.quantity
            }
        })
        if(pr.stock <= 6){
            const html = `<span>stock is ${product.pr}</span>`;
            console.log(html);
            await sendEmail('hiba2002pl',`product ${product.name} stock`,html);
        }
    }

    await cartModel.findOneAndUpdate({userId:req.user._id},{
        products:[]
    })

    return res.status(201).json({message:"success",order});
}
export const getUserOrder = async(req,res)=>{
    const orders = await orderModel.find({userId:req.user._id});
    return res.status(200).json({message:"success",count:orders.length,orders});
}

export const cancelOrder = async(req,res)=>{

    console.log(req.params.id);
    console.log(req.user._id);

    const order = await orderModel.findOneAndUpdate({_id:req.params.id,userId:req.user._id,status:'pending'},{
        status:'cancelled',note:req.body.note
    },{new:true});
    console.log(order.status);

    if(!order){
        return res.status(400).json({message:"can't cancel this order"});
    }


 for(const product of order.products){
        await productModel.findByIdAndUpdate({_id:product.productId},{
            $inc:{
                stock:product.quantity
            }
        })
    }

    return res.status(200).json({message:"success"});

}

export const changeStatus = async(req,res)=>{

    const {orderId} = req.params;
    const order = await orderModel.findById(orderId);
    if(!order){
        return res.status(404).json({message:"order not found"});
    }

    if(order.status =='cancelled'){
        return res.status(400).json({message:"this order is cancelled"});
    }

    const newOrder = await orderModel.findByIdAndUpdate(orderId,{status:req.body.status},{new:true});
    if(newOrder.status=='cancelled'){



 for(const product of order.products){
    await productModel.findByIdAndUpdate({_id:product.productId},{
        $inc:{
            stock:product.quantity
        }
    })
}

    }

    return res.status(200).json({message:'success'});
}

export const allOrder =async(req,res)=>{

    const orders = await orderModel.find({}).populate('userId');
    return res.status(200).json({message:"success",orders});
}


export const getDetails =async(req,res)=>{

    const order = await orderModel.findById(req.params.orderId).populate('userId');
    return res.status(200).json({message:"success",order});
}


export const updateShipping = async(req,res)=>{

    const orderId = req.params.orderId;
    const {shipping} = req.body;
    const order = await orderModel.findOneAndUpdate({_id:orderId,status:'pending'},{shipping},{new:true});
    if(!order){
        return res.status(400).json({message:"order not found"})
    }

    return res.status(200).json({message:"success",order});
}


/* reports */

export const getTopSellingProducts = async (req, res) => {
    try {
        const topSellingProducts = await orderModel.aggregate([
            { $unwind: "$products" },
            { $group: { _id: "$products.productId", totalQuantity: { $sum: "$products.quantity" } } },
            { $sort: { totalQuantity: -1 } },
            {
                $lookup: {
                    from: "products", // اسم النموذج الخاص بالمنتجات
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails" // اسم الخاصية التي ستحمل تفاصيل المنتج
                }
            }
        ]);
        // إرسال النتائج كاستجابة JSON
        return res.json({ topSellingProducts });
    } catch (error) {
        console.error("Error fetching top selling products:", error);
        // إرسال رسالة خطأ كاستجابة JSON
       return  res.status(500).json({ error: "An error occurred while fetching top selling products" });
    }
};


export const getUsersOrdersReport = async (req, res) => {
    try {
        const usersOrders = await orderModel.aggregate([
            { $group: { _id: "$userId", ordersCount: { $sum: 1 }, totalCost: { $sum: "$finalPrice" } } },
            {
                $lookup: {
                    from: "users", // اسم النموذج الخاص بالمستخدمين
                    localField: "_id",
                    foreignField: "_id",
                    as: "user" // اسم الخاصية التي ستحمل بيانات المستخدم
                }
            }
        ]);

        // إرسال النتائج كاستجابة JSON
        return res.json({ usersOrders });
    } catch (error) {
        console.error("Error fetching users orders report:", error);
        // إرسال رسالة خطأ كاستجابة JSON
        return res.status(500).json({ error: "An error occurred while fetching users orders report" });
    }
};
