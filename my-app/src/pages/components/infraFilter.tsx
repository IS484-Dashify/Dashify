import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

const InfraFilter = ({selectedDateRange, setSelectedDateRange} : { selectedDateRange: string; setSelectedDateRange: (dateRange: string) => void; }) => {
  const dateRangeOptions = [
    {label:"Last 15 Minutes", value:"15"},
    {label:"Last 30 Minutes", value:"30"},
    {label:"Last 1 Hour", value:"60"},
    {label:"Last 3 Hours", value:"180"},
    {label:"Last 6 Hours", value:"360"},
    {label:"Last 12 Hours", value:"720"},
    {label:"Last 24 Hours", value:"1440"},
    {label:"Last 7 Days", value:"10080"},
    {label:"Last 30 Days", value:"43200"},
    {label:"Last 90 Days", value:"129600"}
  ]

  return (
    <div className="" id="dateRangeSelector">
      <Select.Root
        value={selectedDateRange}
        onValueChange={setSelectedDateRange}
      >
        <Select.Trigger className="inline-flex h-[2.5rem] appearance-none bg-transparent border-1 border-slate-500/20 shadow-inner items-center justify-center rounded-[4px] px-4 py-2 text-[15px] leading-none text-text placeholder:text-text/50 outline-none hover:text-pri-500 hover:bg-pri-100/70 focus:shadow focus:bg-pri-100/70 focus:border-pri -500 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-pri-500 transition-all duration-200 ease-in-out">
          <Select.Value placeholder="Select a Time Period" />
          <ChevronDownIcon className="ml-1.5" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="py-2 px-1">
              {dateRangeOptions.map((dateRangeOption, index) => (
                <Select.Item
                  key={index}
                  value={dateRangeOption.value}
                  className="px-4 py-2 bg-transparent rounded-[4px] leading-none text-text outline-none hover:bg-indigo-d-500 hover:text-pri-500 transition-all duration-200 ease-in-out"
                >
                  <Select.ItemText>{dateRangeOption.label}</Select.ItemText>
                </Select.Item>
              ))}
              <Select.Separator />
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
            <Select.Arrow />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default InfraFilter;
