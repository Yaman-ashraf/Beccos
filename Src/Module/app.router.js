
import connectDB from '../../DB/connection.js';
import categoriesRouter from './Categories/Categories.router.js';
import productsRouter from './Products/Product.router.js';
import authRouter from './Auth/Auth.router.js';
import slidersRouter from './Slider/Slider.router.js';
import cartRouter from './Cart/Cart.router.js';
import orderRouter from './Order/Order.router.js';
import userRouter from './User/User.router.js';
import brandRouter from './Brand/Brand.router.js';
import reviewRouter from './Review/Review.router.js';


import cors from 'cors'
export const appRouter = (app,express)=>{
    app.use(express.json());
    connectDB();
    app.use(cors());

app.get('/',(req,res)=>{
    return res.json({message:"welcome"});
})

app.use('/auth',authRouter);
app.use("/categories",categoriesRouter);
app.use('/products',productsRouter);
app.use('/sliders',slidersRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);
app.use('/user',userRouter);
app.use('/brand',brandRouter);
app.use('/reviews',reviewRouter);



app.get('*',(req,res)=>{
    return res.status(404).json({message:"page not found"});
})

}
