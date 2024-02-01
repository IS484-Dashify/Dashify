import { Inter } from "next/font/google";
import React from 'react';
import { AiOutlineLogin , AiOutlineCreditCard, AiOutlineNotification, AiOutlineSearch, AiOutlineEnvironment} from 'react-icons/ai';
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import {Avatar, AvatarGroup, AvatarIcon} from "@nextui-org/react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import DropdownCheckboxMenu from './components/filterMenu'
// import { Breadcrumb, Card, Avatar} from 'antd';

const inter = Inter({ subsets: ["latin"] });

interface serviceItem {
  serviceName: string,
  status: string,
  Icon: React.ComponentType<any>
}

  const serviceList = {
    "Geolocation" : ["green", AiOutlineEnvironment ],
    "Login": ["red", AiOutlineLogin ],
    "Payment": ["amber", AiOutlineCreditCard],
    "Notification": ["green", AiOutlineNotification],
    "Search": ["green", AiOutlineSearch],
  }

  // sorting functions be changed depending on the serviceList
  const sortedServiceArray: serviceItem[] = Object.entries(serviceList).map(([serviceName, [status, Icon]]) => ({
    serviceName,
    status: status as string,
    Icon: Icon as React.ComponentType<any>
  }));

  const order:{ [key: string]: number} = { red: 0, amber: 1, green: 2 };
  sortedServiceArray.sort((a, b) => {
    return order[a.status] - order[b.status];
  });


export default function Home() {

  const [currentPage, setCurrentPage] = React.useState("services");

  return (
    <main>
      <div className="h-screen px-14 pt-6">
        <div id='top-menu' className='mb-4'>
          <div className="flex justify-between">
            {/* <Breadcrumbs size="lg" underline="hover" onAction={(key) => setCurrentPage(String(key))}>
              <BreadcrumbItem key="services" href="/servicesViews" isCurrent={currentPage === "services"}>
                Services
              </BreadcrumbItem>
            </Breadcrumbs> */}
            <h1 className='text-4xl font-bold -mt-1 py-8'>Services</h1>
            <button className='rounded-lg h-10 px-3 my-8 bg-indigo-d-400 text-white'>New Service</button>
          </div>
          <div className="flex justify-between">
            <div>
              <DropdownCheckboxMenu/>
            </div>
            <div className="w-2/5 pb-8">
              <Input
                classNames={{
                  mainWrapper:[
                    'group-focus:border-lavender-500',
                  ],
                  label:[
                    'text-md',
                    'group-hover:text-lavender-500',
                    'group-focus:border-lavender-500'
                  ],
                  input: [
                    "bg-transparent",
                    "text-xl",
                    "text-text",
                    'group-focus:border-lavender-500'
                  ],
                  innerWrapper:[
                    "bg-transparent",
                    'group-focus:border-lavender-500'
                  ],
                  inputWrapper:[
                    "border-2",
                    "border-slate-500/20",
                    "shadow-inner",
                    "shadow-slate-500/20",
                    "bg-p-white-200/50",
                    "hover:bg-indigo-d-50",
                    "group-hover:border-lavender-500",
                    "focus:bg-indigo-d-50",
                    "group-focus:bg-indigo-d-50",
                    'group-focus:text-lavender-500',
                    "!cursor-text",
                    // "group-data-[focused=true]:bg-lavender-500",
                    // "focus:ring",
                    // "focus:ring-red-500",
                    // "focus:outline-none",
                  ]
                }}
                type="text"
                variant="bordered"
                radius="sm"
                label="Search by name"
                classNames={{
                  mainWrapper:"",
                  label: "text-md group-hover:text-lavender-500",
                  input: "bg-transparent text-lg text-text",
                  innerWrapper:"bg-transparent",
                  inputWrapper:"border-2 border-slate-500/20 shadow-inner shadow-slate-500/20 bg-p-white-200/50 hover:bg-indigo-d-50 group-hover:border-lavender-500cursor-text group-data-[focused=true]:bg-red-500 dark:group-data-[focused=true]:bg-red-500",
                }}
                // placeholder="Search by name"
                // startContent={
                //   <AiOutlineSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                // }
              />
            </div>
          </div>
        </div>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-10">
          {sortedServiceArray.map(({ serviceName, status, Icon }) => (
            <Card 
              key={serviceName}
              className='py-2 px-4 z-40'
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
                <h4 className="font-bold text-large ml-4">{serviceName}</h4>
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