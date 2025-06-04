'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Eye, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Document {
    id: number;
    title: string;
    content: string;
    summary?: string;
    tags?: { id: string; tag_name: string }[];
    created_at: string;
}

const PAGE_SIZE = 5;

export default function DocumentsTable() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [docToDelete, setDocToDelete] = useState<Document | null>(null);

    const fetchDocuments = async () => {
        setLoading(true);
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error, count } = await supabase
            .from('documents')
            .select('id, title, content, summary, tags, created_at', { count: 'exact' })
            .eq('deleted', false)
            .ilike('title', `%${filter}%`)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (!error && data) {
            setDocuments(data);
            setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        if (!docToDelete) return;

        const { error } = await supabase
            .from('documents')
            .update({ deleted: true })
            .eq('id', docToDelete.id);

        if (!error) {
            toast.success('Document deleted successfully.');
            fetchDocuments();
        } else {
            toast.error('Failed to delete document: ' + error.message);
        }

        setDocToDelete(null);
    };

    useEffect(() => {
        fetchDocuments();
    }, [filter, page]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between gap-3">
                <Input
                    placeholder="Filter by title..."
                    value={filter}
                    onChange={(e) => {
                        setPage(1);
                        setFilter(e.target.value);
                    }}
                    className="max-w-sm"
                />
                <Button>
                    <Link href="/doc/new">New Document</Link>
                </Button>
            </div>

            <div className="border rounded-md overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Summary</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-60" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell />
                                </TableRow>
                            ))
                            : documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>{doc.title}</TableCell>
                                    <TableCell>
                                        {doc.summary || <span className="text-muted-foreground">No summary</span>}
                                    </TableCell>
                                    <TableCell>
                                        {doc.tags && doc.tags.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {doc.tags.map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                                                    >
                                                        {tag.tag_name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">No tags</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(doc.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button className="cursor-pointer" variant="ghost">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link key={doc.id} href={`/doc/${doc.id}`} style={{ textDecoration: 'none' }}>
                                                        <Eye className="w-4 h-4 " />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    View Document
                                                </TooltipContent>
                                            </Tooltip>
                                        </Button>

                                        <Button className="cursor-pointer" variant="ghost" onClick={() => setDocToDelete(doc)}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Delete Document
                                                </TooltipContent>
                                            </Tooltip>
                                        </Button>


                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!docToDelete} onOpenChange={() => setDocToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete <strong>{docToDelete?.title}</strong>?</p>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDocToDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
