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
    } = req;
    const alreadyExists = await client.fav.findFirst({
        where: {
            productId: +id.toString(),
            userId: user?.id,
        },
    });
    if (alreadyExists) {
        //delete
        await client.fav.delete({
            where: {
                id: alreadyExists.id,
            },
        });
    } else {
        //create
        await client.fav.create({
            data: {
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
                product: {
                    connect: {
                        id: +id.toString(),
                    },
                },
            },
        });
    }
    res.json({
        ok: true,
    });
}

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
