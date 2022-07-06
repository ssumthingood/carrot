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
    const post = await client.post.findUnique({
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
            answers: {
                select: {
                    answer: true,
                    id: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    answers: true,
                    wondering: true,
                },
            },
        },
    });

    const isWondering = Boolean(
        await client.wondering.findFirst({
            where: {
                postId: +id.toString(),
                userId: user?.id,
            },
            select: {
                id: true,
            },
        }),
    );

    console.log(post);
    console.log(isWondering);
    res.json({
        ok: true,
        post,
        isWondering,
    });
}

export default withApiSession(
    withHandler({
        methods: ["GET"],
        handler,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함

// Post 없을때 요청 방지

// // community
// useEffect(() => {
// if (data && !data.ok) {
// router.push("/community");
// }
// }, [data, router]);

// // api
// const post = await client.post.findUnique({…});
// if (!post) res.status(404).json({ ok: false, error: "Not found post" });
