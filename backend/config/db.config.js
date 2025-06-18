import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoDBurl = process.env.MONGO_DB_URL;

    try {
        console.log("DB connecting with", mongoDBurl);
        const res = await mongoose.connect(mongoDBurl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log(`mongodb connected with server ${res.connection.host}`);
    } catch (error) {
        console.log("mongodb connection failed!");
        console.log(error);
    }
};
