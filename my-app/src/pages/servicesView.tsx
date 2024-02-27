import { Inter } from "next/font/google";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import RagFilterMenu from "./components/RagFilterMenu";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import * as Label from '@radix-ui/react-label';
import Link from 'next/link';
import Sidebar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

interface serviceItem {
  serviceName: string,
  status: string,
}

// sorting functions be changed depending on the mockServices
const mockServices = [
  {
    serviceName: "Login",
    status: "red"
  },
  {
    serviceName: "Payment",
    status: "amber",
  },
  {
    serviceName: "Notification",
    status: "green",
  },
  {
    serviceName: "Search",
    status: "green",
  },
  {
    serviceName: "Geolocation",
    status: "green",
  },

];
const order:{ [key: string]: number} = { red: 0, amber: 1, green: 2 };
const sortedMockServices: serviceItem[]  = mockServices.sort((a, b) => {
  return order[a.status] - order[b.status];
})

export default function ServiceView() {
  const { data: session } = useSession();
  const router = useRouter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log("Session:", session);
    if(!session){
      router.push("/auth/login");
    }
  }, [session]);

  const [currentPage, setCurrentPage] = React.useState("services");

  // initialize states
  const [mockServices, setMockServices] = useState<serviceItem[]>(sortedMockServices); // ! this is the original list, do not manipulate this directly
  const [searchedServices, setSearchedServices] = useState<serviceItem[]>(sortedMockServices); // this is used to determine rendered services
  const [filteredServices, setFilteredServices] = useState<serviceItem[]>(sortedMockServices); // this is used to determine rendered services
  const [renderedServices, setRenderedServices] = useState<serviceItem[]>(sortedMockServices); // * this is what is being rendered as cards
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSettings, setFilterSettings] = useState<Array<string>>(["red", "amber", "green"]);

  // handle search & filter
  // Determine services that meet search criteria
  useEffect(() => {
    let result = [];
    for (let service of mockServices) {
      if(service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())) {
        result.push(service);
      }
    }
    setSearchedServices(result);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Determine services that are included in filter
  const handleFilterClick = (filter: string) => {
    let result = [];
    if (filterSettings.includes(filter)) {
      result = filterSettings.filter((item) => item !== filter);
    } else {
      result = [...filterSettings, filter];
    }
    setFilterSettings(result);
  }

  useEffect(() => {
    let result=[];
    for (let service of mockServices) {
      if(filterSettings.includes(service.status)) {
        result.push(service);
      }
      setFilteredServices(result);
    }
  }, [filterSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine final rendered services
    useEffect(() => {
      let result = [];
      for (let service of searchedServices) {
        if(filteredServices.includes(service)) {
          result.push(service);
        }
      }
      setRenderedServices(result);
    }, [searchedServices, filteredServices]);

    // Handle reset
    const handleReset = () => {
      setSearchQuery("");
      setFilterSettings(["red", "amber", "green"]);
      setSearchQuery("");
    }

  return (
    <main>
      <div className="h-screen min-h-full flex flex-row">
        <Sidebar/>
        <div className="w-full px-14 pt-6">
          <div id='top-menu' className='mb-8 z-50'>
            <Breadcrumbs 
              size="lg" 
              underline="hover" 
              onAction={(key) => setCurrentPage(String(key))}
            >
              <BreadcrumbItem key="services" href="/servicesView" startContent={<AiOutlineHome/>} isCurrent={currentPage === "services"}>
                Services View
              </BreadcrumbItem>
            </Breadcrumbs>
            <h1 className='text-4xl font-bold text-pri-500 mt-1 pb-8 pt-2'>Services</h1>
            <div className='flex justify-center items-center w-full'>
              <div className="flex w-fit">
                <Label.Root className="text-[15px] font-medium leading-[35px] text-text mr-2" htmlFor="">
                  Filter By
                </Label.Root>
                <RagFilterMenu filterSettings={filterSettings} handleFilterClick={handleFilterClick}/>
              </div>
              <div className="flex flex-wrap items-center gap-[15px] ml-2 mr-2.5">
                <input
                  autoComplete="off"
                  className="inline-flex h-[2.5rem] w-[34rem] appearance-none bg-transparent border-1 border-slate-500/20 shadow-inner items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-text placeholder:text-text/50 outline-none hover:placeholder:text-pri-500 hover:bg-pri-100/70 hover:border-pri-500 focus:shadow focus:bg-pri-100/70 focus:border-pri-500 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-pri-500 transition-all duration-200 ease-in-out"
                  type="text"
                  id="searchQuery"
                  placeholder="Search services by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <button 
                  className="h-[2.5rem] px-4 bg-pri-300 rounded-[4px] text-[#F2F3F4] border-1 border-pri-300 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring"
                  onClick={() => {handleReset()}}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {renderedServices.length > 0 ? (
            <div className="grid grid-cols-4 gap-7">
              {renderedServices.map(({ serviceName, status }, index) => (
                <div className={`py-4 px-6 cursor-pointer z-0 border-l-4 rounded-lg bg-white shadow-lg shadow-transparent hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring ${status === "red" ? "border-reddish-200" : status === "green" ? "border-greenish-200" : "border-amberish-200"}`} key={index}>

                
                  <Link href={`/worldView?service=${serviceName}`}>
                    <div id="serviceCard" className="flex justify-between">
                      <h4 className="font-bold text-md text-text">{serviceName}</h4>
                      <div>
                        <MdOutlineArrowForwardIos 
                          size={20} 
                          className="text-text/30 h-full"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ): (
            <div className="text-center w-full text-text/60 italic">
              <p>No services found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}