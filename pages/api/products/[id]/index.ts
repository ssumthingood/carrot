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
    const product = await client.product.findUnique({
        where: {
            id: +id.toString(),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
    const terms = product?.name.split(" ").map((word) => ({
        name: {
            contains: word,
        },
    }));
    const relatedProducts = await client.product.findMany({
        where: {
            OR: terms,
            AND: {
                id: {
                    not: product?.id,
                },
            },
        },
    });
    const isLiked = Boolean(
        await client.fav.findFirst({
            where: {
                productId: product?.id,
                userId: user?.id,
            },
            select: {
                id: true,
            },
        }),
    );
    res.json({
        ok: true,
        product,
        isLiked,
        relatedProducts,
    });
}

export default withApiSession(
    withHandler({
        methods: ["GET"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
