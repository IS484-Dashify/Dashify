import React, { useState }from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { GiWorld } from "react-icons/gi";
import { VscGraph } from "react-icons/vsc";
import {Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useRouter } from 'next/router';
import Sidebar from "./components/navbar";
import * as Label from '@radix-ui/react-label';

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

export default function WorldView() {
  const [currentPage, setCurrentPage] = React.useState("infra");
  const router = useRouter();
  const service = router.query.service as string | undefined;
  const component = router.query.component as string | undefined;
  const [filterSettings, setFilterSettings] = useState<Array<string>>(["red", "amber", "green"]);
  
  const handleFilterClick = (filter: string) => {
    let result = [];
    if (filterSettings.includes(filter)) {
      result = filterSettings.filter((item) => item !== filter);
    } else {
      result = [...filterSettings, filter];
    }
    setFilterSettings(result);
  }

  return (
    <main>
      <div className="h-screen min-h-full overflow-hidden flex flex-row">
        <Sidebar/>
        <div className="w-full px-14 pt-6">
          <div id='top-menu' className="mb-8 z-50">
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
            <div className='flex items-center w-full'>
              <div className="">
                <Label.Root className="text-[15px] font-medium leading-[35px] text-text mr-2" htmlFor="">
                  Date Range
                </Label.Root>
              </div>
            </div>
          </div>
          <div className="flex h-full">
            <div></div>
          </div>
        </div>
      </div>
    </main>
  );
}