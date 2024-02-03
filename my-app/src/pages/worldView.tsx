import { Inter } from "next/font/google";
import React, { useState, useEffect } from 'react';
import { AiOutlineLogin , AiOutlineCreditCard, AiOutlineNotification, AiOutlineSearch, AiOutlineEnvironment, AiOutlineHome} from 'react-icons/ai';
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import { useRouter } from 'next/router';
import {ComposableMap, Geographies,}

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

const getIconForService = (serviceName) => {
  const service = mockServices.find((s) => s.serviceName === serviceName);
  const icon = service? service.Icon : null;
  return icon ? React.createElement(icon) : '';
};

export default function WorldView() {
  const [currentPage, setCurrentPage] = React.useState("world");
  const router = useRouter();
  const { service } = router.query;

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
            <BreadcrumbItem key="services" href="/servicesView" startContent={<AiOutlineHome/>}>
              Services
            </BreadcrumbItem>
            <BreadcrumbItem key="world" href="/worldView" startContent={getIconForService(service)} isCurrent={currentPage === "world"}>
              {service}
            </BreadcrumbItem>
          </Breadcrumbs>
          <h1 className='text-4xl font-bold text-indigo-d-500 mt-1 pb-8 pt-2'>{service}</h1>
        </div>
      </div>
    </main>
  );
}