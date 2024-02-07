import React, { useState } from 'react';
import {Input} from "@nextui-org/react";

const temp = () => {
    return (
        <Input
            classNames={{
                mainWrapper:"",
                label: "text-md group-hover:text-lavender-500",
                input: "bg-transparent text-lg text-text",
                innerWrapper:"bg-transparent group-focus:border-lavender-500",
                inputWrapper:"border-2 border-slate-500/20 shadow-inner shadow-slate-500/20 bg-p-white-200/50 hover:bg-indigo-d-50 group-hover:border-lavender-500 cursor-text group-data-[focused=true]:bg-red-500",
            }}
            type="text"
            variant="bordered"
            radius="sm"
            label="Search by name"
            // placeholder="Search by name"
            // startContent={
            //   <AiOutlineSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            // }
        />
    )
};

export default temp;

