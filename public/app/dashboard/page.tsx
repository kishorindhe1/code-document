"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { AuthCheck } from "@/components/auth-check"

export default function Dashboard() {
    const [docs, setDocs] = useState<any[]>([])

    useEffect(() => {
        const fetchDocs = async () => {
            const { data } = await supabase.from("docs").select("*")
            if (data) setDocs(data)
        }
        fetchDocs()
    }, [])

    return (
        <AuthCheck>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Docs Dashboard</h1>
                <Link href="/admin/edit/new" className="bg-green-500 text-white px-4 py-2 mb-4 inline-block">+ New Doc</Link>
                <ul>
                    {docs.map((doc) => (
                        <li key={doc.id} className="my-2">
                            <Link href={`/admin/edit/${doc.id}`} className="text-blue-600 underline">{doc.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthCheck>
    )
}
