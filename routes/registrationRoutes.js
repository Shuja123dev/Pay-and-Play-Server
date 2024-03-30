import express from "express";
import { login, signUp } from "../controllers/registration.js";

const registrationRoutes = express.Router();

registrationRoutes.post("/signUp", signUp);
registrationRoutes.post("/login", login);

export default registrationRoutes;
