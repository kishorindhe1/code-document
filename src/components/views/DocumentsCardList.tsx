'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Document {
    id: number;
    title: string;
    content: string;
    summary?: string;
    tags?: { id: string; tag_name: string }[];
    created_at: string;
}

const PAGE_SIZE = 6;

export default function DocumentsCardList() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchDocuments = async () => {
        setLoading(true);
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error, count } = await supabase
            .from('documents')
            .select('id, title, content, summary, tags, created_at', { count: 'exact' })
            .ilike('title', `%${filter}%`)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (!error && data) {
            setDocuments(data);
            setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchDocuments();
    }, [filter, page]);

    return (
        <div className="space-y-6">
            <Input
                placeholder="Filter by title..."
                value={filter}
                onChange={(e) => {
                    setPage(1);
                    setFilter(e.target.value);
                }}
                className="max-w-sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading
                    ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-5 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                        </Card>
                    ))
                    : documents.map((doc) => (
                        <Link key={doc.id} href={`/doc/${doc.id}`} style={{ textDecoration: 'none' }}>
                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle>{doc.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Created: {new Date(doc.created_at).toLocaleString()}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Summary:</strong>{' '}
                                        {doc.summary ? doc.summary : <span className="text-muted-foreground">No summary</span>}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {doc.tags && doc.tags.length > 0 ? (
                                            doc.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                                                >
                                                    {tag.tag_name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">No tags</span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
            </div>

            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
