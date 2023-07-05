import { Conversation, Message, User } from "@prisma/client";

export type FullMesageType = Message & {
    sender: User;
    seen: User[];
};

export type FullConversationType = Conversation & {
    users: User[];
    messages: FullMesageType[];
};
