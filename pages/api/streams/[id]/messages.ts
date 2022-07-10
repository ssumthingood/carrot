import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import dotenv from "dotenv";
import { withApiSession } from "@libs/server/withSession";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const {
        query: { id },
        body,
        session: { user },
    } = req;
    const message = await client.message.create({
        data: {
            message: body.message,
            stream: {
                connect: {
                    id: +id.toString(),
                },
            },
            user: {
                connect: {
                    id: user?.id,
                },
            },
        },
    });
    res.json({ ok: true, message });
}

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
