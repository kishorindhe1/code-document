import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DocumentsTable from '@/components/views/DocumentTable'
import DocumentsCardList from '@/components/views/DocumentsCardList'
const DocumentList = () => {
    return (
        <div>

            <Tabs defaultValue="table" className="w-full cursor-pointer ">
                <TabsList>
                    <TabsTrigger value="table" className='cursor-pointer'>Table View</TabsTrigger>
                    <TabsTrigger value="card" className='cursor-pointer'>Card View</TabsTrigger>
                </TabsList>
                <TabsContent value="table">

                    <DocumentsTable />
                </TabsContent>
                <TabsContent value="card"><DocumentsCardList /></TabsContent>
            </Tabs>
        </div>
    )
}

export default DocumentList