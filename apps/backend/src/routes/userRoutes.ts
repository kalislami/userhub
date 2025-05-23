import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    createUserHandler,
    getAllUsersHandler,
    getUserByIdHandler,
    loginHandler,
    updateUserDataHandler,
} from "../controller/api";

const router = Router();

router.post("/login", loginHandler);
router.get("/user", authMiddleware, getAllUsersHandler);
router.get("/user/:id", authMiddleware, getUserByIdHandler);
router.put("/user/:id", authMiddleware, updateUserDataHandler);
router.post("/user", authMiddleware, createUserHandler);

export default router;
