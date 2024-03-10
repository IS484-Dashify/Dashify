import React, { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { AiOutlineBars, AiOutlineHome } from 'react-icons/ai';
import {Breadcrumbs, BreadcrumbItem, Tooltip} from "@nextui-org/react";
import { useRouter } from 'next/router';
import Link from "next/link";
import Sidebar from "./components/navbar";


const notifications = [
  {
    "service": "Service 1 (prometheus)",
    "vm": "VM1",
    "component": "component 1",
    "reason": "CPU down",
    "datetime": "yyyy-MM-dd HH:mm:ss",
    "status":"Critical"
  },
  {
      "service": "Service 1 (prometheus)",
      "vm": "VM1",
      "component": "component 1",
      "reason": "CPU down",
      "datetime": "yyyy-MM-dd HH:mm:ss",
      "status":"Warning"
  },
  {
      "service": "Service 1 (prometheus)",
      "vm": "VM1",
      "component": "component 1",
      "reason": "CPU down",
      "datetime": "yyyy-MM-dd HH:mm:ss",
      "status":"Warning"
  },
  {
      "service": "Service 1 (prometheus)",
      "vm": "VM1",
      "component": "component 1",
      "reason": "CPU down",
      "datetime": "yyyy-MM-dd HH:mm:ss",
      "status":"Critical"
  },
  {
      "service": "Service 1 (prometheus)",
      "vm": "VM1",
      "component": "component 1",
      "reason": "CPU down",
      "datetime": "yyyy-MM-dd HH:mm:ss",
      "status":"Critical"
  },
]

export default function WorldView() {
//   const { data: session } = useSession();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   useEffect(() => {
//     // console.log("Session:", session);
//     if(!session){
//       router.push("/auth/login");
//     }
//   }, [session]);
  
  const [currentPage, setCurrentPage] = React.useState("world");
  const router = useRouter();
  // console.log(currentService);

//   if(session){
    return (
      <main>
        <div className="h-screen min-h-full overflow-hidden flex flex-row">
          <Sidebar/>
          <div className="w-full px-14 py-6 ml-16 h-full">
            <div id='top-menu' className="mb-4">
              <Breadcrumbs 
                size="lg" 
                underline="hover" 
                onAction={(key) => setCurrentPage(String(key))}
              >
                <BreadcrumbItem key="services" startContent={<AiOutlineHome/>} href="/servicesView">
                  Services
                </BreadcrumbItem>
              </Breadcrumbs>
              <h1 className='text-4xl font-bold text-pri-500 mt-1 pb-8 pt-2'>Notifications</h1>
            </div>
            <div className="flex h-full flex-col">
            {notifications && notifications.length > 0 ? (
              <>
                {notifications?.map(notification =>
                  <div className={`bg-white w-full h-fit mb-6 px-10 py-6 rounded-lg shadow border-l-4 flex flex-row justify-between items-center ${
                    notification.status === "Critical"
                      ? "border-reddish-200"
                      : "border-amberish-200"
                  }`}>
                    <div>
                      <div className='font-bold'>{notification.service} | {notification.vm} | {notification.component}</div>
                      {notification.reason}
                    </div>
                    <div className='text-right'>{notification.datetime}</div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center h-full py-3">No notifications.</div>
            )}
            </div>
          </div>
        </div>
      </main>
    );
//   }
}