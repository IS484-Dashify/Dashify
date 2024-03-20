import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "./components/navbar";

type Status = "Critical" | "Warning" | "Normal";
interface Notification {
  nid: number,
  cid: number,
  reason: string,
  isRead: boolean
  datetime: string,
  status: Status
}
interface Name {
  cName: string,
  mName: string,
  sName: string,
  sid:string
}

interface Names {
  [cid: string]: Name,
}

export default function WorldView() {
  const { data: session } = useSession(); // eslint-disable-next-line react-hooks/exhaustive-deps
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!session) {
      const timeoutId = setTimeout(() => {
        setShouldRedirect(true);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [session]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/auth/login");
    }
  }, [shouldRedirect, router]);
  
  const [notifications, setNotifications] = useState<Notification[]>()
  const [names, setNames] = useState<Names>()

  useEffect(() => {
    const fetchAllNotification = async () => {
      try {
        const endpoint = 'get-all-notifications'; 
        const port = '5008'
        const ipAddress = '127.0.0.1'; 
        const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data)
        } else {
          throw new Error("Failed to perform server action");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllNotification();
  }, []);

  useEffect(() => {
    const fetchAllNames = async () => {
      try {
        const endpoint = 'get-all-names-and-sid'; 
        const port = '5009'
        const ipAddress = '127.0.0.1'; 
        const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setNames(data)
        } else {
          throw new Error("Failed to perform server action");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllNames();
  }, []);

  function formatDate(dateTimeString: string) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let dateTime = new Date(dateTimeString);
    const formattedDate = `${dateTime.getDate()} ${
      monthNames[dateTime.getMonth()]
    } ${dateTime.getFullYear().toString().slice(-2)}, ${dateTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`;
    return formattedDate;
  }

  if(session && notifications && names){
    return (
      <main>
        <div className=" min-h-full flex flex-row">
          <Sidebar/>
          <div className="w-full pr-12 py-6 pl-28 h-full">
            <div id='top-menu' className="mb-4">
              <h1 className='text-4xl font-bold text-pri-500 mt-1 pb-8 pt-2'>Notifications</h1>
            </div>
            <div className="flex vh-100 flex-col pb-[10px]">
            {notifications && notifications.length > 0 ? (
              <>
                {notifications.map(notification =>
                  <div key={notification.nid} className={`bg-white w-full h-fit mb-6 px-10 py-6 rounded-lg shadow border-l-4 flex flex-row justify-between items-center ${
                    notification.status === "Critical"
                      ? "border-reddish-200"
                      : "border-amberish-200"
                  }`}>
                    <div className='flex flex-row w-3/4 items-center'>
                      <div className='w-3/4'>
                        <div className='font-bold'>{names?.[notification.cid.toString()]["sName"]} | {names?.[notification.cid.toString()]["mName"]} | {names?.[notification.cid.toString()]["cName"]}</div>
                        {notification.reason}
                      </div>
                      <div className='italic'>{formatDate(notification.datetime)}</div>
                    </div>
                    <Link key={notification.nid} href={`/infraView?sid=${names?.[notification.cid.toString()]["sid"]}&cid=${notification.cid}`}>
                      <button
                        className="h-[2.5rem] px-4 bg-pri-500 rounded-[4px] text-[#F2F3F4] border-1 border-pri-300 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring"
                      >
                        View
                      </button>
                    </Link>
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
  }
}