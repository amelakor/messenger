"use client";
import { useState, useRef, use, useEffect } from "react";
import { FullMesageType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessages: FullMesageType[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);

        pusherClient.subscribe(conversationId);

        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

        const messageHandler = (message: FullMesageType) => {
            setMessages((current) => {
                if (find(current, { id: message.id })) return current;
                return [...current, message];
            });
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        const updateMesageHandler = (newMessage: FullMesageType) => {
            setMessages((current) =>
                current.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }

                    return currentMessage;
                })
            );
        };

        pusherClient.bind("messages:new", messageHandler);
        pusherClient.bind("messages:update", updateMesageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("messages:new", messageHandler);
            pusherClient.unbind("messages:update", updateMesageHandler);
        };
    }, [conversationId]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div className="pt-24" ref={bottomRef} />
        </div>
    );
};

export default Body;
