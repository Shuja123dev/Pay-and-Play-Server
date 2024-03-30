import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import connectDB from "./config/connectDB.js";
import registrationRoutes from "./routes/registrationRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api", paymentRoutes);
app.use("/api", registrationRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
