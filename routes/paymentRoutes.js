import express from "express";
import { initiatePayment } from "../controllers/payment.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/initiatePayment", initiatePayment);

export default paymentRoutes;
