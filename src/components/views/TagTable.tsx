'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const tagSchema = z.object({
    tag_name: z.string().min(1, 'Tag name is required'),
});

type TagFormData = z.infer<typeof tagSchema>;

export default function TagTable() {
    type Tag = {
        id: string;
        tag_name: string;
        created_at: string;
    };
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tagToDelete, setTagToDelete] = useState<{ id: string; name: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TagFormData>({
        resolver: zodResolver(tagSchema),
    });

    const fetchTags = async () => {
        setLoading(true);
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
            .from('tags')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (filter.trim()) {
            query = query.ilike('tag_name', `%${filter}%`);
        }

        const { data, error, count } = await query;

        if (!error) {
            setTags(data || []);
            setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
        } else {
            toast.error('Error fetching tags: ' + error.message);
        }

        setLoading(false);
    };

    const onSubmit = async (data: TagFormData) => {
        const { error } = await supabase.from('tags').insert({ tag_name: data.tag_name });
        if (!error) {
            toast.success('Tag created successfully!');
            reset();
            setOpen(false);
            fetchTags();
        } else {
            toast.error('Error creating tag: ' + error.message);
        }
    };

    const confirmDelete = async () => {
        if (tagToDelete) {
            const { error } = await supabase.from('tags').delete().eq('id', tagToDelete.id);
            if (!error) {
                toast.success('Tag deleted successfully!');
                fetchTags();
            } else {
                toast.error('Error deleting tag: ' + error.message);
            }
            setTagToDelete(null);
        }
    };

    useEffect(() => {
        fetchTags();
    }, [filter, page]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Input
                    placeholder="Filter by tag name..."
                    value={filter}
                    onChange={(e) => {
                        setPage(1);
                        setFilter(e.target.value);
                    }}
                    className="max-w-sm"
                    disabled={tags?.length === 0 && page === 1}
                />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>New Tag</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Tag</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <Input
                                placeholder="Enter tag name"
                                {...register('tag_name')}
                            />
                            {errors.tag_name && (
                                <p className="text-sm text-red-500">{errors.tag_name.message}</p>
                            )}
                            <Button type="submit" className="mt-2">
                                Create
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tag Name</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell />
                                </TableRow>
                            ))
                            : tags.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                        No tags found.
                                    </TableCell>
                                </TableRow>
                            ) : tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell>{tag.tag_name}</TableCell>
                                    <TableCell>{new Date(tag.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            className="cursor-pointer"
                                            variant="ghost"
                                            onClick={() => setTagToDelete({ id: tag.id, name: tag.tag_name })}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
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
            <Dialog open={!!tagToDelete} onOpenChange={() => setTagToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Tag</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete the tag <strong>{tagToDelete?.name}</strong>?</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setTagToDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
