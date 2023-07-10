import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(requst: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return new NextResponse("Unauthorized", {
                status: 401,
            });
        }
        const body = await requst.json();
        const { name, image } = body;

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                image,
                name,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.log(error);
        return new NextResponse("Something went wrong", {
            status: 500,
        });
    }
}
