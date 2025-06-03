"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { User } from "@/types";
import { supabase } from "@/lib/supabase";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);
            else window.location.href = "/login"; // Redirect to login if not authenticated
        };
        fetchCurrentUser();
    }, []);

    // Fetch users with search
    useEffect(() => {
        const fetchUsers = async () => {
            let query = supabase
                .from("profiles")
                .select("id, username, email")
                .neq("id", currentUserId);

            if (search) {
                query = query.ilike("username", `%${search}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching users:", error);
                return;
            }
            setUsers(data || []);
        };

        if (currentUserId) fetchUsers();
    }, [currentUserId, search]);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4"
            />
            <div className="space-y-4">
                {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Avatar>
                                <AvatarFallback>{user.username?.[0] || user.email?.[0]}</AvatarFallback>
                            </Avatar>
                            <span>{user.username || user.email}</span>
                        </div>
                        <Link href={`/chat/${user.id}`}>
                            <Button>Chat</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}