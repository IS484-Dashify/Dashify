import React, { useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { AiOutlineClose } from "react-icons/ai";
import { MdArrowDropDown } from 'react-icons/md';
import { CheckIcon } from '@radix-ui/react-icons';

const RagFilterMenu: React.FC<{ filterSettings: Array<string>, handleFilterClick: (filter: string) => void }> = ({ filterSettings, handleFilterClick }) => {
    const options = [{option: "red"}, {option: "amber"}, {option: "green"}];
    const [filterText, setFilterText] = useState<string>("Red, Amber, Green");
    useEffect(() => {
        let temp = filterSettings;
        let result = [];
        for (let status of filterSettings) {
            result.push(status.charAt(0).toUpperCase() + status.slice(1));
        }
        setFilterText(result.join(", "));
    }, [filterSettings]);

    // ! This is required in order to build the project
    // According to next.js(https://nextjs.org/docs/messages/prerender-error), there is a need to Check for any code that assumes a prop is available, even when it might not be and handle it
    // Read more here (https://www.google.com/search?q=nextjs+Prerender+Error&rlz=1C1UEAD_enSG1089SG1089&oq=nextjs+Prerender+Error&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRhAMgkIAhAAGAoYgAQyBwgDEAAYgAQyCQgEEAAYChiABDIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBBzc0M2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8)
    if(!filterSettings){
        return <div>Error Code 404</div>
    }

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                className="h-[2.5rem] min-w-[10rem] px-[10px] rounded-[4px] text-[15px] appearance-none bg-transparent border-1 border-slate-500/20 leading-none hover:text-pri-500 hover:border-pri-500 shadow-inner data-[state=open]:bg-pri-500 data-[state=open]:text-white data-[state=open]:border-pri-500 data-[state=open]:ring-0 data-[state=open]:ring-offset-0 data-[state=open]:ring-offset-transparent data-[state=open]:ring-pri-500 transition-all duration-200 ease-in-out"
                aria-label="Update dimensions"
                >
                    <div className='flex'>
                        <div className="flex items-center">
                            {filterText ? filterText : "Filter"}
                        </div>
                        <div className="mt-1">
                            <MdArrowDropDown className="" size={25}/>
                        </div>
                    </div>
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className="rounded py-1.5 pb-3 px-3 w-[11rem] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)]"
                    sideOffset={5}
                >
                <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between align-middle">
                        <p className="text-pri-500 text-[15px] font-medium align-bottom">Filters</p>
                        <Popover.Close
                        className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center outline-none cursor-default"
                        aria-label="Close"
                    >
                            <AiOutlineClose className="text-slate-400 hover:text-pri-500 transition-colors duration-150 ease-in-out"/>
                        </Popover.Close>
                    </div>
                    {
                        options.map(
                            (option, index) => (
                                <fieldset className="flex gap-5 items-center" key={index}>
                                    <Checkbox.Root
                                        className="h-[25px] w-[25px] appearance-none flex items-center justify-center rounded-[4px] bg-white border-1 border-text/20 shadow-lg hover:border-pri-500 transition-colors duration-200 ease-soft-spring" id={`${option.option}Filter`}
                                        value={option.option}
                                        onClick={(e: React.FormEvent<HTMLButtonElement>) => handleFilterClick(e.currentTarget.value)}
                                        checked={filterSettings.includes(option.option)}
                                    >
                                        <Checkbox.Indicator className="text-text">
                                            <CheckIcon />
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <label className="-ml-2 text-[15px] leading-none text-text hover:text-pri-500 transition-colors duration-200 ease-soft-spring cursor-pointer" htmlFor={`${option.option}Filter`}>
                                        {option.option.charAt(0).toUpperCase() + option.option.slice(1)}
                                    </label>
                                </fieldset>
                            )
                        )
                    }
                </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
        
    )
};

export default RagFilterMenu;
