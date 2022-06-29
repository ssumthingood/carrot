import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body);
    return res.status(200).end();
    // res.json({ ok: true });
}

export default withHandler("POST", handler);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함
