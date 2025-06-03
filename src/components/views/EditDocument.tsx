'use client';

import { useEffect, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useTheme } from "next-themes";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().optional(),
});

interface EditorProps {
    documentId?: string;
}

export default function EditDocument({ documentId }: EditorProps) {
    const editor = useCreateBlockNote();
    const [isSaving, setIsSaving] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [availableTags, setAvailableTags] = useState<{ id: string; tag_name: string }[]>([]);
    const [selectedTags, setSelectedTags] = useState<{ id: string; tag_name: string }[]>([]);
    const { theme } = useTheme()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const fetchTags = async () => {
            const { data, error } = await supabase.from("tags").select("*").order("tag_name");
            if (!error && data) setAvailableTags(data);
        };
        fetchTags();
    }, []);

    useEffect(() => {
        if (!documentId) return;

        const loadDocument = async () => {
            const { data, error } = await supabase
                .from("documents")
                .select("*")
                .eq("id", documentId)
                .single();

            if (error || !data) {
                toast.error("Failed to load document.");
                return;
            }

            setValue("title", data.title);
            setValue("summary", data.summary || "");
            await editor.replaceBlocks(await editor.document, JSON.parse(data.content));
            setSelectedTags(data.tags || []);
        };

        loadDocument();
    }, [documentId, editor, setValue]);

    const onSubmit = async ({ title, summary }: { title: string; summary?: string }) => {
        setIsSaving(true);
        try {
            const content = await editor.document;

            const payload = {
                title,
                summary,
                content: JSON.stringify(content),
                tags: selectedTags,
            };

            const { error } = documentId
                ? await supabase.from("documents").update(payload).eq("id", documentId)
                : await supabase.from("documents").insert([payload]);

            if (error) {
                toast.error("Error saving document: " + error.message);
            } else {
                toast.success(`Document ${documentId ? "updated" : "saved"} successfully.`);
                if (!documentId) {
                    reset();
                    setSelectedTags([]);
                    await editor.replaceBlocks(await editor.document, []);
                }
                setIsEditable(false);
            }
        } catch (err) {
            toast.error("Unexpected error: " + String(err));
        } finally {
            setIsSaving(false);
        }
    };

    const handleTagSelect = (tag: { id: string; tag_name: string }) => {
        if (!selectedTags.find((t) => t.id === tag.id)) {
            setSelectedTags((prev) => [...prev, tag]);
        }
    };

    const handleTagRemove = (id: string) => {
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== id));
    };
    const handleSaveClick = () => {
        const title = watch("title");
        if (!title || title.trim() === "") {
            setIsDrawerOpen(true); // Open drawer if title is missing
            toast.warning("Please enter a title before saving.");
        } else {
            handleSubmit(onSubmit)();
        }
    };


    return (
        <div className="w-full mx-auto space-y-4 py-8">
            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditable((prev) => !prev)}
                >
                    {isEditable ? "View Mode" : "Edit Mode"}
                </Button>

                {isEditable && (
                    <>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            Edit Info
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSaveClick}
                            disabled={isSaving || isDrawerOpen}
                        >
                            {isSaving ? "Saving..." : documentId ? "Update" : "Save"}
                        </Button>

                    </>
                )}
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                            {tag.tag_name}
                            <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => handleTagRemove(tag.id)}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            <BlockNoteView
                editor={editor}
                className="w-full border min-h-[300px] rounded-2xl p-1"
                editable={isEditable}
                theme={theme === "dark" ? "dark" : "light"} // Use theme from next-themes
            />

            {/* Drawer for Title, Summary, and Tags */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                <DrawerContent className="p-4 space-y-4">
                    <DrawerHeader>
                        <DrawerTitle>Document Info</DrawerTitle>
                        <DrawerDescription>Update title, summary, and tags</DrawerDescription>
                    </DrawerHeader>

                    <div className="space-y-2">
                        <Input placeholder="Title" {...register("title")} />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input placeholder="Summary (optional)" {...register("summary")} />
                        {errors.summary && (
                            <p className="text-sm text-red-500">{errors.summary.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium">Tags</div>
                        <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                                <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                                    {tag.tag_name}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => handleTagRemove(tag.id)}
                                    />
                                </Badge>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {availableTags
                                .filter((tag) => !selectedTags.find((t) => t.id === tag.id))
                                .map((tag) => (
                                    <Button
                                        key={tag.id}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleTagSelect(tag)}
                                    >
                                        + {tag.tag_name}
                                    </Button>
                                ))}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
