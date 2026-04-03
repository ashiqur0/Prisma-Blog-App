import { NextFunction, Request, Response } from "express"
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            };
        }
    }
}

const auth = (...roles: UserRole[]) => {
    console.log("00000000000000000000000000")
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("first")
            // get user session
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            });
            console.log("second")
            if (!session || !session.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: "Unauthorized"
                });
            }
            console.log("33333333333333333")
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email not verified"
                });
            }
            console.log("444444444444444444")
            if (roles.length && !roles.includes(session.user.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden"
                });
            }
            console.log("55555555555555555555")
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as UserRole,
                emailVerified: session.user.emailVerified
            }
            console.log("666666666666666666")
            next();
        } catch (error) {
           next(error);
        }
    }
}

export default auth;