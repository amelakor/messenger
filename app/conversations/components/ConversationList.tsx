"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "@/app/components/modals/GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
    initialItems: FullConversationType[];
    title: string;
    users: User[];
}
const ConversationList: React.FC<ConversationListProps> = ({
    initialItems,
    title,
    users,
}) => {
    const session = useSession();

    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    useEffect(() => {
        if (!pusherKey) return;

        pusherClient.subscribe(pusherKey);

        const newHandler = (conversation: FullConversationType) => {
            setItems((prev) => {
                if (find(prev, { id: conversation.id })) return prev;

                return [conversation, ...prev];
            });
        };

        const updateHandler = (conversation: FullConversationType) => {
            setItems((prev) => {
                return prev.map((item) => {
                    if (item.id === conversation.id) {
                        return {
                            ...item,
                            messages: conversation.messages,
                        };
                    }
                    return item;
                });
            });
        };

        const removeHandler = (conversation: FullConversationType) => {
            setItems((prev) => {
                return prev.filter((item) => item.id !== conversation.id);
            });
        };

        pusherClient.bind("conversation:remove", removeHandler);
        pusherClient.bind("conversation:update", updateHandler);
        pusherClient.bind("conversation:new", newHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind("conversation:remove", removeHandler);
            pusherClient.unbind("conversation:update", updateHandler);
            pusherClient.unbind("conversation:new", newHandler);
        };
    }, [pusherKey]);

    return (
        <>
            <GroupChatModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                users={users}
            />
            <aside
                className={clsx(
                    `
                    fixed 
                    inset-y-0 
                    pb-20
                    lg:pb-0
                    lg:left-20 
                    lg:w-80 
                    lg:block
                    overflow-y-auto 
                    border-r 
                    border-gray-200 
                `,
                    isOpen ? "hidden" : "block w-full left-0"
                )}
            >
                <div className="px-5">
                    <div className="flex justify-between mb-4 pt-4">
                        <div className="text-2xl font-bold text-neutral-800">
                            Messages
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="
                            rounded-full 
                            p-2 
                            bg-gray-100 
                            text-gray-600 
                            cursor-pointer 
                            hover:opacity-75 
                            transition
                        "
                        >
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
};

export default ConversationList;
