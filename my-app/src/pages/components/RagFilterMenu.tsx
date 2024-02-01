import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { AiOutlineClose } from "react-icons/ai";
import { CheckIcon, Circle } from '@radix-ui/react-icons';

const ragFilterMenu = () => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                className="h-[2.5rem] px-[10px] rounded-[4px] text-[15px] appearance-none bg-transparent border-1 border-slate-500/20 leading-none text-text hover:text-lavender-500 hover:bg-lavender-100/70 focus:shadow focus:bg-lavender-100/70 data-[state=open]:bg-lavender-100/70 data-[state=open]:text-lavender-500 data-[state=open]:border-lavender-500 data-[state=open]:ring-0 data-[state=open]:ring-offset-0 data-[state=open]:ring-offset-transparent data-[state=open]:ring-lavender-500 transition-all duration-200 ease-in-out"
                aria-label="Update dimensions"
                >
                Red, Amber, Green
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    // className="rounded p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
                    className="rounded p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)]"
                    sideOffset={5}
                >
                <div className="flex flex-col gap-2.5">
                    <p className="text-indigo-d-500 text-[15px] leading-[19px] font-medium mb-2.5 ">Filters</p>
                    <fieldset className="flex gap-5 items-center">
                        <Checkbox.Root
                            className="h-[25px] w-[25px] appearance-none flex items-center justify-center rounded-[4px] bg-white border-1 border-text/20 shadow-lg hover:border-lavender-500 transition-colors duration-200 ease-soft-spring" id="redFilter"
                        >
                            <Checkbox.Indicator className="text-text">
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label className="pl-[px] text-[15px] leading-none text-text hover:text-lavender-500 transition-colors duration-200 ease-soft-spring" htmlFor="redFilter">
                            Red
                        </label>
                    </fieldset>
                    <fieldset className="flex gap-5 items-center">
                        <Checkbox.Root
                            className="h-[25px] w-[25px] appearance-none flex items-center justify-center rounded-[4px] bg-white border-1 border-text/20 shadow-lg hover:border-lavender-500 transition-colors duration-200 ease-soft-spring" id="amberFilter"
                        >
                            <Checkbox.Indicator className="text-text">
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label className="pl-[px] text-[15px] leading-none text-text hover:text-lavender-500 transition-colors duration-200 ease-soft-spring" htmlFor="amberFilter">
                            Amber
                        </label>
                    </fieldset>
                    <fieldset className="flex gap-5 items-center">
                        <Checkbox.Root
                            className="h-[25px] w-[25px] appearance-none flex items-center justify-center rounded-[4px] bg-white border-1 border-text/20 shadow-lg hover:border-lavender-500 transition-colors duration-200 ease-soft-spring" id="greenFilter"
                        >
                            <Checkbox.Indicator className="text-text">
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label className="pl-[px] text-[15px] leading-none text-text hover:text-lavender-500 transition-colors duration-200 ease-soft-spring" htmlFor="greenFilter">
                            Green
                        </label>
                    </fieldset>
                </div>
                <Popover.Close
                    className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default"
                    aria-label="Close"
                >
                    <AiOutlineClose className="text-lavender-500 hover:text-indigo-d-500 transition-colors duration-150 ease-in-out"/>
                </Popover.Close>
                <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
        
    )
};

export default ragFilterMenu;
