import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoURL);
        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(` Database Connection Error: ${error.message}`);
        process.exit(1); //Exit process with failure
    }
}

