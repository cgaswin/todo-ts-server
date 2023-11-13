import mongoose,{Mongoose, MongooseError} from "mongoose";

const DB_URI: string = process.env.DB_URI || "";

const connectWithDB = async ():Promise<Mongoose>  => {
    try {
        await mongoose.connect(DB_URI);
        console.log("DB Connection successfull..");
        return mongoose;
    } catch (error) {
        if (error instanceof MongooseError) {
            console.log("DB connection issues..");
			console.log(error);
			process.exit(1);
        } else {
            console.log(error)
            process.exit(1)
        }
    }
}

export default connectWithDB