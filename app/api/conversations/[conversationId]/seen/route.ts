import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", {
                status: 401,
            });
        }
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            return new NextResponse("Not found", {
                status: 404,
            });
        }

        const lastMessage =
            conversation.messages[conversation.messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
            include: {
                seen: true,
                sender: true,
            },
        });

        return new NextResponse("Success");
    } catch (error: any) {
        console.log(error, "error");
        return new NextResponse("Internal error", {
            status: 500,
        });
    }
}
