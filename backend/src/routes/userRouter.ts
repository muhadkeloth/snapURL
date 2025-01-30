import { authenticateToken } from "../middleware/auth";
import UserController from "../controllers/userController";
import { Router } from "express";
import User from "../models/User";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/UserService";


const router = Router();

const userService = new UserService(new UserRepository(User));
const userController = new UserController(userService);

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/getOTP", userController.getOTP);
router.post("/validateOTP", userController.validateOTP);

router.get("/link/:shortUrl", userController.redirectUrl);


router.post("/shortenURL",authenticateToken, userController.shortenURL);
router.get("/getAllShortenURLs",authenticateToken, userController.getAllShortenURLs);
router.delete("/delete/:shortUrl",authenticateToken, userController.deleteURL);

export default router;
