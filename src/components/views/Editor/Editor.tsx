'use client';

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
});

export default function Editor() {
    const editor = useCreateBlockNote();
    const [isSaving, setIsSaving] = useState(false);
    const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<{ title: string }>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async ({ title }: { title: string }) => {
        setIsSaving(true);
        try {
            const content = await editor.document;

            const { error } = await supabase.from("documents").insert([
                {
                    title,
                    content: JSON.stringify(content),
                },
            ]);

            if (error) {
                toast(
                    <div>
                        <strong className="text-red-600">Error saving document</strong>
                        <div>{error.message}</div>
                    </div>
                );
            } else {
                toast(
                    <div>
                        <strong>Document saved</strong>
                        <div>Your document &quot;{title}&quot; has been saved.</div>
                    </div>
                );
                reset();
                await editor.replaceBlocks(await editor.document, []);
            }
        } catch (err) {
            toast(
                <div>
                    <strong className="text-red-600">Unexpected error</strong>
                    <div>{String(err)}</div>
                </div>
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveClick = () => {
        if (!watch("title")) {
            setIsTitleModalOpen(true);
        } else {
            handleSubmit(onSubmit)();
        }
    };

    return (
        <div className="w-full mx-auto space-y-4 py-8">
            <div className="flex justify-end gap-3 title">
                <Button type="button" variant="secondary" onClick={() => setIsTitleModalOpen(true)}>
                    Edit title
                </Button>
                <Button type="button" onClick={handleSaveClick} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>

            <BlockNoteView
                editor={editor}
                theme="light"
                className="w-full border min-h-[300px] rounded-2xl p-1"
                aria-readonly={true}
            />

            <Dialog open={isTitleModalOpen} onOpenChange={setIsTitleModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Document Title</DialogTitle>
                        <DialogDescription>
                            This title is required to save your document.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleSubmit((data) => {
                            setIsTitleModalOpen(false);
                            onSubmit(data);
                        })}
                        className="space-y-4"
                    >
                        <Input placeholder="Document title" {...register("title")} />
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}
                        <Button type="submit" className="w-full">
                            Save Title
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
