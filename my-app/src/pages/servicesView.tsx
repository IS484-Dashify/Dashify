import { Inter } from "next/font/google";
import React, { useState, useEffect } from 'react';
import { AiOutlineLogin , AiOutlineCreditCard, AiOutlineNotification, AiOutlineSearch, AiOutlineEnvironment, AiOutlineHome} from 'react-icons/ai';
import RagFilterMenu from "./components/RagFilterMenu";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import {Avatar, AvatarGroup, AvatarIcon} from "@nextui-org/react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import * as Label from '@radix-ui/react-label';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

interface serviceItem {
  serviceName: string,
  status: string,
  Icon: React.ComponentType<any>
}

// sorting functions be changed depending on the mockServices
const mockServices = [
  {
    serviceName: "Login",
    status: "red",
    Icon: AiOutlineLogin
  },
  {
    serviceName: "Payment",
    status: "amber",
    Icon: AiOutlineCreditCard
  },
  {
    serviceName: "Notification",
    status: "green",
    Icon: AiOutlineNotification
  },
  {
    serviceName: "Search",
    status: "green",
    Icon: AiOutlineSearch
  },
  {
    serviceName: "Geolocation",
    status: "green",
    Icon: AiOutlineEnvironment
  },

];
const order:{ [key: string]: number} = { red: 0, amber: 1, green: 2 };
const sortedMockServices: serviceItem[]  = mockServices.sort((a, b) => {
  return order[a.status] - order[b.status];
})

export default function ServiceView() {
  const [currentPage, setCurrentPage] = React.useState("services");

  // initialize states
  const [mockServices, setMockServices] = useState<serviceItem[]>(sortedMockServices); // ! this is the original list, do not manipulate this directly
  const [searchedServices, setSearchedServices] = useState<serviceItem[]>(sortedMockServices); // this is used to determine rendered services
  const [filteredServices, setFilteredServices] = useState<serviceItem[]>(sortedMockServices); // this is used to determine rendered services
  const [renderedServices, setRenderedServices] = useState<serviceItem[]>(sortedMockServices); // * this is what is being rendered as cards
  const [searchQuery, setSearchQuery] = useState<String>("");
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
  }, [searchQuery]);
  
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
  }, [filterSettings]);

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
      <div className="h-screen px-14 pt-6">
        <div id='top-menu' className='mb-8 z-50'>
          <Breadcrumbs 
            size="lg" 
            underline="hover" 
            // classNames={{
            //   list: "bg-stone-200",
            // }}
            // variant="solid" 
            onAction={(key) => setCurrentPage(String(key))}
          >
            <BreadcrumbItem key="services" href="/servicesView" startContent={<AiOutlineHome/>} isCurrent={currentPage === "services"}>
              Services
            </BreadcrumbItem>
          </Breadcrumbs>
          <h1 className='text-4xl font-bold text-indigo-d-500 mt-1 pb-8 pt-2'>Services</h1>
          <div className='flex justify-center items-center w-full'>
            <div className="">
              <Label.Root className="text-[15px] font-medium leading-[35px] text-text mr-2" htmlFor="">
                Filter By
              </Label.Root>
              <RagFilterMenu filterSettings={filterSettings} handleFilterClick={handleFilterClick}/>
            </div>
            <div className="flex flex-wrap items-center gap-[15px] ml-2 mr-2.5">
              <input
                autoComplete="off"
                className="inline-flex h-[2.5rem] w-[34rem] appearance-none bg-transparent border-1 border-slate-500/20 shadow-inner items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-text placeholder:text-text/50 outline-none hover:placeholder:text-lavender-500 hover:bg-lavender-100/70 focus:shadow focus:bg-lavender-100/70 focus:border-lavender-500 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-lavender-500 transition-all duration-200 ease-in-out"
                type="text"
                id="searchQuery"
                placeholder="Search services by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <button 
                className="h-[2.5rem] px-4 bg-indigo-d-300 rounded-[4px] text-[#F2F3F4] border-1 border-indigo-d-300 shadow-md shadow-transparent hover:border-indigo-d-400 hover:bg-indigo-d-400 hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring"
                onClick={() => {handleReset()}}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        {renderedServices.length > 0 ? (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {renderedServices.map(({ serviceName, status, Icon }, index) => (
            <div className="shadow-lg shadow-transparent hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring rounded-lg" key={index}>
              <Link href={`/worldView?service=${serviceName}`}>
                <Card 
                  className='py-2 px-4 cursor-pointer z-0 bg-white shadow-none rounded-lg'
                >
                  <CardHeader className="flex justify-start align-middle text-text">
                    {
                      status === "red" 
                      ? (<Avatar  
                          icon={<Icon size={24}/>} 
                          style={{ backgroundColor: "#ffa5a1", color: "#f01e2c"}}
                        />
                      ): status === "amber"
                      ? (<Avatar  
                          icon={<Icon size={24}/>} 
                          style={{ backgroundColor: '#ffc17a', color: "#ff7e00"}}
                        />
                      ): status === "green"
                      ?  (<Avatar  
                          icon={<Icon size={24}/>} 
                          style={{ backgroundColor: "#acdf87", color: "#4c9a2a" }}
                        />
                      ): null
                    }
                    <h4 className="font-bold text-large text-text ml-4">{serviceName}</h4>
                    {/* <p className="text-tiny uppercase font-bold">Daily Mix</p>
                    <small className="text-default-500">12 Tracks</small> */}
                  </CardHeader> 
                </Card>
              </Link>
            </div>
          ))}
        </div>
        ): (
          <div className="text-center w-full">
            <p>No services found.</p>
          </div>
        )}
      </div>
    </main>
  );
}