import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import dotenv from "dotenv";
import { withApiSession } from "@libs/server/withSession";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const {
        session: { user },
    } = req;
    const reviews = await client.review.findMany({
        where: {
            createdForId: user?.id,
        },
        include: {
            createdBy: { select: { id: true, name: true, avatar: true } },
        },
    });
    res.json({
        ok: true,
        reviews,
    });
}

export default withApiSession(
    withHandler({
        methods: ["GET"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
