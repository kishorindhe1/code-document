// src/app/doc/[id]/page.tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import EditDocument from '@/components/views/EditDocument';
import Link from 'next/link';

interface PageProps {
    params: {
        id: string;
    };
}

export default function Page({ params }: PageProps) {
    const documentId = params?.id;

    // Fallback if documentId is missing or invalid
    if (!documentId || typeof documentId !== 'string') {
        return (
            <div className="p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/doc">Docs</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Edit Document</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="mt-4 text-red-600" role="alert">
                    <h2 className="text-xl font-semibold">Error</h2>
                    <p>Invalid or missing document ID. Please check the URL and try again.</p>
                    <Link href="/doc" className="text-blue-600 hover:underline">
                        Back to Documents
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4" role="main">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/doc">Docs</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit Document {documentId}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="mt-4 text-2xl font-bold">Editing Document: {documentId}</h1>
            <EditDocument documentId={documentId} />
        </div>
    );
}