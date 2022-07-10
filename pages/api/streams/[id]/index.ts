import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import dotenv from "dotenv";
import { withApiSession } from "@libs/server/withSession";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const {
        query: { id },
    } = req;
    const stream = await client.stream.findUnique({
        where: {
            id: +id.toString(),
        },
        include: {
            messages: {
                select: {
                    id: true,
                    message: true,
                    user: {
                        select: {
                            avatar: true,
                            id: true,
                        },
                    },
                },
            },
        },
    });
    res.json({ ok: true, stream });
}

export default withApiSession(
    withHandler({
        methods: ["GET"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
