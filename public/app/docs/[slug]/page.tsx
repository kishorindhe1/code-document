"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import MarkdownRenderer from "@/components/DocContent"



export default function DocPage() {
    const { slug } = useParams()
    const [doc, setDoc] = useState<{ title: string; content: string } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return

        const fetchDoc = async () => {
            const { data, error } = await supabase.from("docs").select("*").eq("slug", slug).single()
            if (error) {
                setError("Doc not found.")
            } else {
                setDoc(data)
            }
            setLoading(false)
        }

        fetchDoc()
    }, [slug])

    if (loading) return <div className="p-6">Loading...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>
    if (!doc) return null

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">{doc.title}</h1>
            {/* Pass content to Server Component */}
            <MarkdownRenderer content={doc.content} />
        </div>
    )
}
