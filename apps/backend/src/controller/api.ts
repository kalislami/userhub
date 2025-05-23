import { Response, Request } from "express";
import { createUser, getAllUsers, getUserById, login, updateUserById } from "../repository/userCollection";
import { User } from "../entities/user";
import { AuthenticatedRequest } from "../types";

export const getUserByIdHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const uid = req.params.id;

        const user = await getUserById(uid);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

export const createUserHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const createData: Partial<User> = req.body;
        const recentlyActive: number = Math.floor(Date.now() / 1000);
        await createUser({ ...createData, recentlyActive });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

export const updateUserDataHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const uid = req.params.id;

        const updateData: Partial<User> = req.body;
        const recentlyActive: number = Math.floor(Date.now() / 1000);

        await updateUserById(uid, { ...updateData, recentlyActive });

        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

export const getAllUsersHandler = async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

export const loginHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password required" });
        return;
    }

    try {
        const result = await login({ email, password });
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message ?? "Login failed" });
    }
};