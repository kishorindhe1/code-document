import React from 'react';
import { Metadata } from 'next';
import TagTable from '@/components/views/TagTable';

export const metadata: Metadata = {
    title: 'Manage Tags | PinkBlue',
    description: 'Create, view, and manage tags .',
};

const Page = () => {
    return (
        <div>
            <TagTable />
        </div>
    );
};

export default Page;
