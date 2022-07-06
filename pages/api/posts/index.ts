import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import dotenv from "dotenv";
import { withApiSession } from "@libs/server/withSession";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const {
        body: { question },
        session: { user },
    } = req;
    const post = await client.post.create({
        data: {
            question,
            user: {
                connect: {
                    id: user?.id,
                },
            },
        },
    });
    res.json({
        ok: true,
        post,
    });
}

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
