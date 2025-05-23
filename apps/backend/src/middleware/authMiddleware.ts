import { Response, NextFunction } from "express";
import admin from "firebase-admin";
import { AuthenticatedRequest } from "../types";

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing or invalid Authorization header" });
        return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (!decodedToken.uid) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        req.user = {
            ...decodedToken,
            uid: decodedToken.uid,
            email: decodedToken.email,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token", error });
    }
};
