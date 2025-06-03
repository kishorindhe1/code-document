'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data, error }) => {
            if (data.user) setEmail(data.user.email!);
            setLoading(false);
        });
    }, []);

    const updateProfile = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ email });
        if (error) setError(error.message);
        setLoading(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-6">
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full rounded border p-2"
                />
                <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="w-full rounded bg-blue-500 p-2 text-white"
                >
                    Update
                </button>
            </div>
        </div>
    );
}