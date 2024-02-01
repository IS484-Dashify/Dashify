import { Inter } from "next/font/google";
import React, { useState, useEffect } from 'react';

import { AiOutlineLogin , AiOutlineCreditCard, AiOutlineNotification, AiOutlineSearch, AiOutlineEnvironment} from 'react-icons/ai';
import RagFilterMenu from "./components/RagFilterMenu";

import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import {Avatar, AvatarGroup, AvatarIcon} from "@nextui-org/react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import DropdownCheckboxMenu from './components/filterMenu'
import * as Label from '@radix-ui/react-label';
// import SearchBar from './components/searchBar'
// import { Breadcrumb, Card, Avatar} from 'antd';

const inter = Inter({ subsets: ["latin"] });

interface serviceItem {
  serviceName: string,
  status: string,
  Icon: React.ComponentType<any>
}

  // const serviceList = {
  //   "Geolocation" : ["green", AiOutlineEnvironment ],
  //   "Login": ["red", AiOutlineLogin ],
  //   "Payment": ["amber", AiOutlineCreditCard],
  //   "Notification": ["green", AiOutlineNotification],
  //   "Search": ["green", AiOutlineSearch],
  // }

  // // sorting functions be changed depending on the serviceList
  // const sortedServiceArray: serviceItem[] = Object.entries(serviceList).map(([serviceName, [status, Icon]]) => ({
  //   serviceName,
  //   status: status as string,
  //   Icon: Icon as React.ComponentType<any>
  // }));

  // const order:{ [key: string]: number} = { red: 0, amber: 1, green: 2 };
  // sortedServiceArray.sort((a, b) => {
  //   return order[a.status] - order[b.status];
  // });

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
  const [filteredServices, setFilteredServices] = useState<serviceItem[]>(sortedMockServices);
  const [searchQuery, setSearchQuery] = useState("");
  
  // handle search & filter
  useEffect(() => {
    let result = [];
    for (let service of sortedMockServices) {
      if(service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())) {
        result.push(service);
      }
    }
    setFilteredServices(result);
  }, [searchQuery]);

  return (
    <main>
      <div className="h-screen px-14 pt-6">
        <div id='top-menu' className='mb-4 z-50'>
          <div className="flex justify-between">
            {/* <Breadcrumbs size="lg" underline="hover" onAction={(key) => setCurrentPage(String(key))}>
              <BreadcrumbItem key="services" href="/servicesViews" isCurrent={currentPage === "services"}>
                Services
              </BreadcrumbItem>
            </Breadcrumbs> */}
            <h1 className='text-4xl font-bold -mt-1 py-8 text-indigo-d-500'>Services</h1>
            <button className='rounded-lg h-10 px-3 my-8 bg-indigo-d-400 text-white'>New Service</button>
          </div>
          {/* <button 
              className="h-[2.5rem] px-[10px] rounded-[4px] text-[15px] appearance-none bg-transparent border-1 border-slate-500/20 leading-none text-text hover:text-lavender-500 hover:bg-lavender-100/70 focus:shadow focus:bg-lavender-100/70 focus:border-lavender-500 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-lavender-500 transition-all duration-200 ease-in-out"
              id="filterBy"
              aria-label="Filter Menu"
            >
              Red, Amber, Green
          </button> */}
          <div className="flex">
            <div className="">
              <Label.Root className="text-[15px] font-medium leading-[35px] text-text px-4" htmlFor="">
                Filter By
              </Label.Root>
              <RagFilterMenu />
            </div>
            <div className="flex flex-wrap items-center gap-[15px] px-5">
              <input
                autoComplete="off"
                className="inline-flex h-[2.5rem] w-[34rem] appearance-none bg-transparent border-1 border-slate-500/20 shadow-inner items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-text placeholder:text-text/50 outline-none hover:placeholder:text-lavender-500 hover:bg-lavender-100/70 focus:shadow focus:bg-lavender-100/70 focus:border-lavender-500 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-lavender-500 transition-all duration-200 ease-in-out"
                type="text"
                id="searchQuery"
                placeholder="Search services by name..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {filteredServices.map(({ serviceName, status, Icon }) => (
            <Card 
              key={serviceName}
              className='py-2 px-4 cursor-pointer z-0 shadow-lg shadow-transparent bg-white hover:shadow-lg transition-all duration-200 ease-in-out'
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
          ))}
        </div>
      </div>
    </main>
  );
}