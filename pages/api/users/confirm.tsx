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
    const { token } = req.body;
    const exists = await client.token.findUnique({
        where: {
            payload: token,
        },
    });
    if (!exists) return res.status(404).end();
    req.session.user = {
        id: exists.userId,
    };
    await req.session.save();
    res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
    cookieName: "carrotsession",
    password: "12341234123412341234123412341234",
});
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
