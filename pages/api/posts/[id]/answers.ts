import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import dotenv from "dotenv";
import { withApiSession } from "@libs/server/withSession";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const {
        query: { id },
        session: { user },
        body: { answer },
    } = req;

    const newAnswer = await client.answer.create({
        data: {
            user: {
                connect: {
                    id: user?.id,
                },
            },
            post: {
                connect: {
                    id: +id.toString(),
                },
            },
            answer,
        },
    });
    console.log(newAnswer);
    res.json({
        ok: true,
        answer: newAnswer,
    });
}

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
