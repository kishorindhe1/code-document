import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
// app/docs/metadata.ts
import EditDocument from '@/components/views/EditDocument';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation | PinkBlue Dev",
    description: "Comprehensive developer documentation for the PinkBlue Dev project, including components, configuration, and usage guides.",
    keywords: ["PinkBlue", "documentation", "Next.js", "components", "developer guide"],
    authors: [{ name: "PinkBlue Dev Team", url: "https://pinkblue.dev" }],
    creator: "PinkBlue Dev",
    openGraph: {
        title: "PinkBlue Dev Documentation",
        description: "Explore the full documentation for PinkBlue Dev, including UI components, metadata setup, and theming.",
        url: "https://pinkblue.dev/docs",
        siteName: "PinkBlue Dev",
        images: [
            {
                url: "https://pinkblue.dev/og-image.png",
                width: 1200,
                height: 630,
                alt: "PinkBlue Dev Documentation",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "PinkBlue Dev Documentation",
        description: "Explore the full documentation for PinkBlue Dev, including UI components, metadata setup, and theming.",
        images: ["https://pinkblue.dev/og-image.png"],
        creator: "@pinkbluedev",
    },
};

const page = () => {
    return (
        <>
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
                        <BreadcrumbPage>New Document</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <EditDocument />
        </>

    )
}

export default page