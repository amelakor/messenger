import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
    const { id } = useParams();

    const conversationId = useMemo(() => {
        if (!id) return "";

        return id as string;
    }, [id]);

    const isOpen = useMemo(() => !!id, [id]);

    return useMemo(
        () => ({ conversationId, isOpen }),
        [conversationId, isOpen]
    );
};

export default useConversation;
