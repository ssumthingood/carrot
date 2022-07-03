import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import dotenv from "dotenv";

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    console.log(req.session.user);
    const profile = await client.user.findUnique({
        where: { id: req.session.user?.id },
    });
    res.json({
        ok: true,
        profile,
    });
}

export default withIronSessionApiRoute(withHandler("GET", handler), {
    cookieName: "carrotsession",
    password: "12341234123412341234123412341234",
});
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
