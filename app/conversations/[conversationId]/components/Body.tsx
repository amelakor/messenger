"use client";
import { useState, useRef } from "react";
import { FullMesageType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";

interface BodyProps {
    initialMessages: FullMesageType[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

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
