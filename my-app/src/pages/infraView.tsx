import React, { useEffect, useState }from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { GiWorld } from "react-icons/gi";
import { VscGraph } from "react-icons/vsc";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useRouter } from 'next/router';
import Sidebar from "./components/navbar";
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

// Update the Country interface to reflect the correct type of the vm property
type Status = "red" | "green" | "amber";
interface Service {
  serviceName: string;
  status: Status;
  countries: Country[]; // Specify that countries is an array of Country objects
}
interface Country {
  name: string;
  iso: string;
  coordinates: number[];
  status: Status; // Use the Status type here
  vm: { [key: string]: Status };
}

const mockServices: Service[] = [
  {
    serviceName: "Login",
    status: "red",
    countries: [
      { 
        name: "Singapore", 
        iso: "SG", 
        coordinates: [103.8198, 1.3521], 
        status:"red", 
        vm: {
          "VM1": "red",
          "VM2": "green",
          "VM3": "green"
        }
      }, // 103.8198° E, 1.3521° N
      { 
        name: "Australia", 
        iso: "AU", 
        coordinates: [133.281323, -26.4390917], 
        status:"green", 
        vm: {
          "VM4": "green",
        }
      },
      { 
        name: "China", 
        iso: "CN", 
        coordinates: [79.3871, 43.6426], 
        status:"amber", 
        vm: {
          "VM5": "green",
          "VM6": "amber",
        }
      },
      { 
        name: "France", 
        iso: "FR", 
        coordinates: [1.7191036, 46.2276], 
        status:"amber",
        vm: {
          "VM7": "amber",
        }
      },
      { 
        name: "Hong Kong", 
        iso: "HK", 
        coordinates: [114.1694, 22.3193], 
        status:"red", 
        vm: {
          "VM8": "red",
          "VM9": "amber",
        }
      },
      { 
        name: "United States", 
        iso: "US", 
        coordinates: [-95.7129, 37.0902], 
        status:"red", 
        vm: {
          "VM10": "green",
          "VM11": "red",
        }
      }
    ]
  }
];

const vmList = {
  "VM1" : {
    "component1": "amber",
    "component2": "red",
    "component3": "green"
  },
  "VM2" : {
    "component4": "green",
  },
  "VM3" : {
    "component5": "green",
  },
  "VM4" : {
    "component6": "green",
  },
  "VM5" : {
    "component7": "green",
  },
  "VM6" : {
    "component8": "amber",
  },
  "VM7" : {
    "component9": "amber",
  },
  "VM8" : {
    "component10": "red",
  },
  "VM9" : {
    "component10": "amber",
  },
  "VM10" : {
    "component10": "green",
  },
  "VM11" : {
    "component10": "red",
  }
}

const uptime = 123456;
const cpuUsage = 75;
const diskUsage = 50;
const memoryUsage = 80;
const trafficIn = 1000000;
const trafficOut = 2000000;

export default function InfrastructureView() {
  const [currentPage, setCurrentPage] = React.useState("infra");
  const router = useRouter();
  const service = router.query.service as string | undefined;
  const component = router.query.component as string | undefined;
  
  const [selectedDateRange, setSelectedDateRange] = useState<string>("15");
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
    <main>
      <div className="h-screen min-h-full overflow-hidden flex flex-row">
        <Sidebar/>
        <div className="w-full px-14 pt-6">
          <div id='top-menu' className=" z-50">
            <Breadcrumbs 
              size="lg" 
              underline="hover" 
              onAction={(key) => setCurrentPage(String(key))}
            >
              <BreadcrumbItem key="services" startContent={<AiOutlineHome/>} href="/servicesView">
                Services
              </BreadcrumbItem>
              <BreadcrumbItem key="world" href={`/worldView?service=${service}`}  startContent={<GiWorld/>}>
                {service}
              </BreadcrumbItem>
              <BreadcrumbItem key="infra" href={`/worldView?service=${service}&component=${component}`}  startContent={<VscGraph/>} isCurrent={currentPage === "infra"}>
                {component}
              </BreadcrumbItem>
            </Breadcrumbs>
            <h1 className='text-4xl font-bold text-indigo-d-500 mt-1 pb-8 pt-2'>{component}</h1>
          </div>
          <div className="flex h-full flex-col w-full">
            <div className='grid xl:grid-cols-4 lg:grid-cols-4 grid-cols-2 gap-4 mb-4'>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg mb-4 text-gray-600 font-bold text-center">System Uptime (s)</h2>
                <p className="text-4xl flex justify-center items-center">{uptime}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg mb-4 text-gray-600 font-bold text-center">System Uptime (s)</h2>
                <p className="text-4xl flex justify-center items-center">{uptime}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg mb-4 text-gray-600 font-bold text-center">System Uptime (s)</h2>
                <p className="text-4xl flex justify-center items-center">{uptime}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg mb-4 text-gray-600 font-bold text-center">System Uptime (s)</h2>
                <p className="text-4xl flex justify-center items-center">{uptime}</p>
              </div>    
            </div>
            <div className='flex items-center w-full mb-4'>
              <div className="" id="dateRangeSelector">
                <Label.Root className="text-[15px] font-medium leading-[35px] text-text mr-2" htmlFor="">
                  Date Range
                </Label.Root>
                <Select.Root value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <Select.Trigger className="inline-flex h-[2.5rem] appearance-none bg-transparent border-1 border-slate-500/20 shadow-inner items-center justify-center rounded-[4px] px-4 py-2 text-[15px] leading-none text-text placeholder:text-text/50 outline-none hover:placeholder:text-lavender-500 hover:bg-lavender-100/70 focus:shadow focus:bg-lavender-100/70 focus:border-lavender-500 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-lavender-500 transition-all duration-200 ease-in-out">
                    <Select.Value placeholder="Select a Date Range"/>
                    <ChevronDownIcon className="ml-1.5"/>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                      <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                        <ChevronUpIcon />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="py-2 px-1">
                        {dateRangeOptions.map((dateRangeOption, index) => (
                          <Select.Item key={index} value={dateRangeOption.value} className="px-4 py-2 bg-transparent rounded-[4px] leading-none text-text outline-none  hover:bg-indigo-d-500 hover:text-white transition-all duration-200 ease-in-out">
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
            </div>
            <div className='grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4'>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg  text-gray-600 font-bold mb-4">CPU Usage</h2>
                <p className="text-gray-600">{cpuUsage}%</p>
                {/* Add graph here */}
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg text-gray-600 font-bold mb-4">Disk Usage</h2>
                <p className="text-gray-600">{diskUsage}%</p>
                {/* Add graph here */}
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg text-gray-600 font-bold mb-4">Memory Usage</h2>
                <p className="text-gray-600">{memoryUsage}%</p>
                {/* Add graph here */}
              </div>
              <div className="bg-white p-4 rounded-lg ">
                <h2 className="text-lg  text-gray-600 font-bold mb-4">Traffic</h2>
                {/* Add graph here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}