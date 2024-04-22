import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./utils/dbConnection.js";
import userRoute from "./routes/userRoute.js";
import recyclerRoute from "./routes/recyclerRoute.js";
import producerRoute from "./routes/procucerRoute.js";
import adminRoute from "./routes/adminRoute.js";
dotenv.config();

const app = express();

// connect to db
connectDb();

//** middleware */
app.use(cors());
app.use(express.json({ limit: "500mb" }));

// api routes

app.use("/api/user", userRoute);
app.use("/api/recycler",recyclerRoute);
app.use("/api/producer",producerRoute);
app.use("/api/admin",adminRoute);
app.listen(8000, () => {
  console.log("running on port 8000");
});
