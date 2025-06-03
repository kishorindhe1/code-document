"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import { User } from "@/types";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const receiverId = params?.receiverId as string | undefined;
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Fetch current user from Supabase auth
    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setCurrentUser({
                    id: user.id,
                    email: user.email,
                    username: user.user_metadata?.username || "User",
                });
            } else {
                router.push("/login"); // Redirect to login if not authenticated
            }
        };
        fetchUser();
    }, [router]);

    // Show loading state if user or receiverId is not ready
    if (!currentUser || !receiverId) {
        return <div>Loading...</div>;
    }

    return <ChatWindow currentUser={currentUser} receiverId={receiverId} />;
}