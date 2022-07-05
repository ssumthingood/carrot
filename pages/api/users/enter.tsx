import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import twilio from "twilio";
import dotenv from "dotenv";
import Mailgun from "mailgun-js";
import { withApiSession } from "@libs/server/withSession";

dotenv.config();
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
// const mailgun = new Mailgun({ apiKey: process.env.MAILGUN_PRIVATE!, domain: process.env.MAILGUN_BASE! });
// const msg = mailgun({ apiKey: process.env.MAILGUN_PRIVATE, domain: process.env.MAILGUN_BASE });

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
    const { phone, email } = req.body;
    const user = phone ? { phone: phone + "" } : email ? { email } : null;
    if (!user) return res.status(400).json({ ok: false });
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    const token = await client.token.create({
        data: {
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...user,
                    },
                    create: {
                        name: "Anonymous",
                        ...user,
                    },
                },
            },
        },
    });
    console.log(token);
    //완성본(폰번호만)
    // if (phone) {
    //     const message = await twilioClient.messages.create({
    //         messagingServiceSid: process.env.TWILIO_MSID,
    //         to: process.env.MY_PHONE!,
    //         body: `Your login token is ${payload}`,
    //     });
    //     console.log(message);
    // }
    //-----------------------------------------------------------
    // else if (email) {
    //     // const message = await twilioClient.messages.create({
    //     //     messagingServiceSid: process.env.TWILIO_MSID,
    //     //     to: process.env.MY_PHONE!,
    //     //     body: `Your login token is ${payload}`,
    //     // });
    //     // console.log(message);
    //     const data = {
    //         from: process.env.MAILGUN_BASE,
    //         to: process.env.MY_EMAIL,
    //         subject: `Hello ${payload}`,
    //         text: `There?`,
    //     };
    //     const message = await mailgun.messages().send(data);
    //     console.log(message);
    // }
    //------------------------------------------------------------
    // if (phone) {
    //     user = await client.user.upsert({
    //         where: {
    //             phone: +phone,
    //         },
    //         create: {
    //             name: "Anonymous",
    //             phone: +phone,
    //         },
    //         update: {},
    //     });
    // } else if (email) {
    //     user = await client.user.upsert({
    //         where: {
    //             email: email,
    //         },
    //         create: {
    //             name: "Anonymous",
    //             email: email,
    //         },
    //         update: {},
    //     });
    // }

    // if (email) {
    //     user = await client.user.findUnique({
    //         where: {
    //             email: email,
    //         },
    //     });
    //     if (user) console.log("found");
    //     if (!user) {
    //         console.log("Did not found. Will create.");
    //         user = await client.user.create({
    //             data: {
    //                 name: "Anonymous",
    //                 email: email,
    //             },
    //         });
    //     }
    //     console.log(user);
    // }

    // if (phone) {
    //     user = await client.user.findUnique({
    //         where: {
    //             phone: +phone,
    //         },
    //     });
    //     if (user) console.log("found");
    //     if (!user) {
    //         console.log("Did not found. Will create.");
    //         user = await client.user.create({
    //             data: {
    //                 name: "Anonymous",
    //                 phone: +phone,
    //             },
    //         });
    //     }
    //     console.log(user);
    // }
    return res.json({
        ok: true,
    });
    // res.json({ ok: true });
}

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler,
        isPrivate: false,
    }),
);
//NEXT에서 api function 만들시 반드시 export default async 넣어줘야함

// Token을 통한 유저 인증
// Twilio 모듈을 통한 휴대폰 SMS 인증 - LogIn
