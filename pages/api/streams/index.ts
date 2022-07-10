import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import dotenv from "dotenv";
import { withApiSession } from "@libs/server/withSession";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const {
        session: { user },
        body: { name, price, description },
    } = req;
    if (req.method === "POST") {
        const stream = await client.stream.create({
            data: {
                name,
                price,
                description,
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
        });
        res.json({ ok: true, stream });
    }
    if (req.method === "GET") {
        const streams = await client.stream.findMany();
        res.json({ ok: true, streams });
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
