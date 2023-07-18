import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

interface Iparams {
    conversationId: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: Iparams }
) {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    try {
        if (!currentUser?.id) {
            return NextResponse.json(null);
        }
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true,
            },
        });

        if (!conversation) {
            return new NextResponse("Not found", {
                status: 404,
            });
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id],
                },
            },
        });

        conversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(
                    user.email,
                    "conversation:remove",
                    conversation
                );
            }
        });

        return NextResponse.json(deletedConversation);
    } catch (error: any) {
        console.log(error);
        return new NextResponse("Something went wrong", {
            status: 500,
        });
    }
}
