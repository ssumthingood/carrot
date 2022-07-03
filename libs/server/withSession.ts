import { withIronSessionApiRoute } from "iron-session/next";
import dotenv from "dotenv";

dotenv.config();

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}

const cookieOptions = {
    cookieName: "carrotsession",
    password: process.env.PASSWORD!,
};

export function withApiSession(fn: any) {
    return withIronSessionApiRoute(fn, cookieOptions);
}
