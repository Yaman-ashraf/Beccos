import mongoose from 'mongoose';

const connectDB = async () => {

    return await mongoose.connect(process.env.DB)
        .then(() => {
            console.log("connection established");
        }).catch((error) => {
            console.log("connection error: " + error);
        });
}

export default connectDB;
