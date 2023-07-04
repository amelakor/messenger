import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(requst: Request) {
    try {
        const body = await requst.json();

        const { email, name, password } = body;

        if (!email || !name || !password) {
            return new NextResponse(
                "Please enter your email, name and password",
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        return new NextResponse(error.message, {
            status: 500,
        });
    }
}
