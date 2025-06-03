"use client"
import React from 'react'
import { Spinner } from "@heroui/react";

const loading = () => {
    return (
        <Spinner classNames={{ label: "text-foreground mt-4" }} label="default" variant="default" />
    )
}

export default loading