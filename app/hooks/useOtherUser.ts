import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (
    conversation: FullConversationType | { users: User[] }
) => {
    const session = useSession();

    const otherUser = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;

        const orherUser = conversation.users.filter((user) => {
            return user.email !== currentUserEmail;
        });

        return orherUser[0];
    }, [conversation.users, session?.data?.user?.email]);

    return otherUser;
};

export default useOtherUser;
