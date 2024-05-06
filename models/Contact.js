import mongoose from "mongoose";


const contactusSchema  =  new mongoose.Schema(
    {
      fullName: String,
      email: String,
      location: String,
      comment:String,
    },
    {
      timestamps: true,
    }
  );

  export default mongoose.model("Contactus", contactusSchema);
