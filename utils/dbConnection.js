import mongoose from "mongoose";


 function connectDb(){
    mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connection successful");
    })
    .catch((err) => {
      console.log(err.message);
    });
}

export default connectDb;