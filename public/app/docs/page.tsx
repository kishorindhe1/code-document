"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function DocsListPage() {
    const [docs, setDocs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDocs = async () => {
            const { data, error } = await supabase.from("docs").select("*")
            if (error) {
                console.error(error)
                setError("Failed to load docs.")
            } else {
                setDocs(data || [])
            }
            setLoading(false)
        }

        fetchDocs()
    }, [])

    if (loading) return <p className="p-6">Loading...</p>
    if (error) return <p className="p-6 text-red-600">{error}</p>

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">📚 Documentation</h1>
            <ul className="space-y-4">
                {docs.map((doc) => (
                    <li key={doc.id}>
                        <Link
                            href={`/docs/${doc.slug}`}
                            className="text-blue-600 hover:underline text-lg"
                        >
                            {doc.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
