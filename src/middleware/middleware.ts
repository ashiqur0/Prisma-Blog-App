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

const isAuthenticated = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // get user session
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        });

        if (!session || !session.user) {
            return res.status(401).json({ 
                error: "Unauthorized" 
            });
        }

        if (!session.user.emailVerified) {
            return res.status(403).json({
                error: "Email not verified"
            });
        }

        if (roles.length && !roles.includes(session.user.role as UserRole)) {
            return res.status(403).json({ 
                error: "Forbidden" 
            });
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as UserRole,
            emailVerified: session.user.emailVerified
        }

        next();
    }
}

export default isAuthenticated;