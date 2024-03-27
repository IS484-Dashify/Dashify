import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import Link from "next/link";
import Sidebar from "../components/navbar";
import {Tabs, Tab, Chip} from "@nextui-org/react";


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
  
  const [alerts, setAlerts] = useState<Notification[]>()
  const [insights, setInsights] = useState<Notification[]>()
  const [names, setNames] = useState<Names>()

  const fetchAllNotification = async () => {
    try {
      const endpoint = 'get-all-notifications'; 
      const port = '5008';
      const ipAddress = '4.231.173.235'; 
      const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
      
      if (response.ok) {
        const data: Notification[] = await response.json();
        // Sort alerts and insights based on isRead property
        const sortedAlerts = data.filter(notification => 
          ['Critical', 'Warning', 'Normal'].includes(notification.status)
        ).sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
        const sortedInsights = data.filter(notification => 
          !['Critical', 'Warning', 'Normal'].includes(notification.status)
        ).sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));
        setAlerts(sortedAlerts);
        setInsights(sortedInsights)
      } else {
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllNames = async () => {
    try {
      const endpoint = 'get-all-names-and-sid'; 
      const port = '5009'
      const ipAddress = '4.231.173.235'; 
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

  const markNotificationAsRead = async (nid: number) => {
    try {
      const endpoint = `mark-notification-as-read/${nid}`; 
      const port = '5008'
      const ipAddress = '4.231.173.235'; 
      const method = 'PUT';
      const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}&method=${method}`);
      if (response.ok) {
        fetchAllNotification();
      } else {
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markAllNotificationAsRead = async () => {
    try {
      const endpoint = `mark-all-notifications-as-read`; 
      const port = '5008'
      const ipAddress = '4.231.173.235'; 
      const method = 'PUT';
      const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}&method=${method}`);
      if (response.ok) {
        fetchAllNotification();
      } else {
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllNotification();
    fetchAllNames();
  }, []);
  
  const unreadAlertsCount = alerts?.reduce((count, alert) => {
    return count + (alert.isRead ? 0 : 1);
  }, 0);

  const unreadInsightsCount = insights?.reduce((count, insight) => {
    return count + (insight.isRead ? 0 : 1);
  }, 0);

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

  if(session && alerts && insights && names){
    const unreadAlerts = alerts.filter(alert => !alert.isRead);
    const readAlerts = alerts.filter(alert => alert.isRead);
    const unreadInsights = insights.filter(insight => !insight.isRead);
    const readInsights = insights.filter(insight => insight.isRead);
    
    return (
      <main className="">
        <div className=" min-h-full flex flex-row">
          <div className="fixed z-50">
            <Sidebar/>
          </div>
          <div className="w-full pr-12 py-6 pl-28 h-full min-h-screen">
            <div id='top-menu' className="flex flex-row justify-between">
              <h1 className='text-4xl font-bold text-pri-500 mt-1 pb-6 pt-2'>Notifications</h1>
              <button
                className="h-[2.5rem] px-4 rounded-[4px] text-pri-500 border-1 border-pri-500 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:text-white hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring self-end"
                onClick={() => markAllNotificationAsRead()}
              >
                Read all
              </button>
            </div>
            <div className="flex w-full flex-col vh-100">
              <Tabs 
                aria-label="Options" 
                color="primary" 
                variant="underlined"
                classNames={{
                  tabList: "gap-6 mx-2 mb-3 w-full relative rounded-none p-0 border-b border-divider",
                  cursor: "w-full bg-pri-500",
                  tab: "max-w-fit px-0 h-12",
                  tabContent: "group-data-[selected=true]:text-pri-500"
                }}
              >
                <Tab
                  key="alerts"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Alerts</span>
                      <Chip size="sm" variant="faded">{unreadAlertsCount}</Chip>
                    </div>
                  }
                >
                  <div className="flex vh-100 flex-col pb-[10px]">
                  {alerts && alerts.length > 0 ? (
                    <>
                      {/* Unread alerts */}
                      {unreadAlerts.length > 0 ? (
                        <>
                          <div className=' mb-4 font-bold'>Unread</div>
                          {unreadAlerts.map(alert => (
                            <div key={alert.nid} className={`w-full h-fit mb-6 px-10 py-6 rounded-lg shadow border-l-4 flex flex-row justify-between items-center bg-white ${
                              alert.status === "Critical" ? "border-reddish-200" : "border-amberish-200"
                            }`}>
                              <div className='flex flex-row w-3/4 items-center'>
                                <div className='w-3/4'>
                                  <div className='font-bold flex flex-row items-center align-middle'>
                                    {names?.[alert.cid.toString()]["sName"]} | {names?.[alert.cid.toString()]["mName"]} | {names?.[alert.cid.toString()]["cName"]}
                                  </div>
                                  {alert.reason}
                                </div>
                                <div className='text-sm'>{formatDate(alert.datetime)}</div>
                              </div>
                              <Link href={`/infraView?sid=${names?.[alert.cid.toString()]["sid"]}&cid=${alert.cid}`}>
                                <button
                                  className="h-[2.5rem] px-4 rounded-[4px] bg-pri-500 text-[#F2F3F4] border-1 border-pri-300 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring"
                                  onClick={() => markNotificationAsRead(alert.nid)}
                                >
                                  View
                                </button>
                              </Link>
                            </div>
                          ))}
                        </>
                      ) : (
                        null
                      )}
                      {/* read alerts */}
                      {readAlerts.length > 0 ? (
                      <>
                        <div className=' mb-4 font-bold'>History</div>
                        {readAlerts.map(alert => (
                          <div key={alert.nid} className={`w-full h-fit mb-6 px-10 py-6 rounded-lg shadow border-l-4 flex flex-row justify-between items-center bg-white ${
                            alert.status === "Critical" ? "border-reddish-200" : "border-amberish-200"
                          }`}>
                            <div className='flex flex-row w-3/4 items-center'>
                              <div className='w-3/4'>
                                <div className='font-bold flex flex-row items-center align-middle'>
                                  {names?.[alert.cid.toString()]["sName"]} | {names?.[alert.cid.toString()]["mName"]} | {names?.[alert.cid.toString()]["cName"]}
                                </div>
                                {alert.reason}
                              </div>
                              <div className='text-sm'>{formatDate(alert.datetime)}</div>
                            </div>
                            <Link href={`/infraView?sid=${names?.[alert.cid.toString()]["sid"]}&cid=${alert.cid}`}>
                              <button
                                className="h-[2.5rem] px-4 rounded-[4px] bg-pri-500 text-[#F2F3F4] border-1 border-pri-300 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring"
                                onClick={() => markNotificationAsRead(alert.nid)}
                              >
                                View
                              </button>
                            </Link>
                          </div>
                        ))}
                      </>
                      ) : (
                        null
                      )}
                    </>
                  ) : (
                    <div className="flex justify-center h-full py-3">No alerts.</div>
                  )}
                  </div>
                </Tab>
                <Tab
                  key="insights"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Insights</span>
                      <Chip size="sm" variant="faded">{unreadInsightsCount}</Chip>
                    </div>
                  }
                >
                <div className="flex vh-100 flex-col pb-[10px]">
                  {insights && insights.length > 0 ? (
                    <>
                      {/* Unread insights */}
                      {unreadInsights.length > 0 ? (
                        <>
                          <div className=' mb-4 font-bold'>Unread</div>
                          {unreadInsights.map(insight => (
                            <div key={insight.nid} className={`w-full h-fit mb-6 px-10 py-6 rounded-lg shadow border-l-4 flex flex-row justify-between items-center bg-white ${
                              insight.status === "Critical" ? "border-reddish-200" : "border-amberish-200"
                            }`}>
                              <div className='flex flex-row w-3/4 items-center'>
                                <div className='w-3/4'>
                                  <div className='font-bold flex flex-row items-center align-middle'>
                                    {names?.[insight.cid.toString()]["sName"]} | {names?.[insight.cid.toString()]["mName"]} | {names?.[insight.cid.toString()]["cName"]}
                                  </div>
                                  {insight.reason}
                                </div>
                                <div className='text-sm'>{formatDate(insight.datetime)}</div>
                              </div>
                              <Link href={`/infraView?sid=${names?.[insight.cid.toString()]["sid"]}&cid=${insight.cid}`}>
                                <button
                                  className="h-[2.5rem] px-4 rounded-[4px] bg-pri-500 text-[#F2F3F4] border-1 border-pri-300 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring"
                                  onClick={() => markNotificationAsRead(insight.nid)}
                                >
                                  View
                                </button>
                              </Link>
                            </div>
                          ))}
                        </>
                      ) : (
                        null
                      )}
                      {readInsights.length > 0 ? (
                        <>
                          {/* read insights */}
                          <div className=' mb-4 font-bold'>History</div>
                          {readInsights.map(insight => (
                            <div key={insight.nid} className={`w-full h-fit mb-6 px-10 py-6 rounded-lg shadow border-l-4 flex flex-row justify-between items-center bg-white ${
                              insight.status === "Critical" ? "border-reddish-200" : "border-amberish-200"
                            }`}>
                              <div className='flex flex-row w-3/4 items-center'>
                                <div className='w-3/4'>
                                  <div className='font-bold flex flex-row items-center align-middle'>
                                    {names?.[insight.cid.toString()]["sName"]} | {names?.[insight.cid.toString()]["mName"]} | {names?.[insight.cid.toString()]["cName"]}
                                  </div>
                                  {insight.reason}
                                </div>
                                <div className='text-sm'>{formatDate(insight.datetime)}</div>
                              </div>
                              <Link href={`/infraView?sid=${names?.[insight.cid.toString()]["sid"]}&cid=${insight.cid}`}>
                                <button
                                  className="h-[2.5rem] px-4 rounded-[4px] bg-pri-500 text-[#F2F3F4] border-1 border-pri-300 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring"
                                  onClick={() => markNotificationAsRead(insight.nid)}
                                >
                                  View
                                </button>
                              </Link>
                            </div>
                          ))}
                        </>
                      ) : (
                        null
                      )}
                    </>
                  ) : (
                    <div className="flex justify-center h-full py-3">No insights.</div>
                  )}
                  </div>
                </Tab>
              </Tabs>
            </div>  
          </div>
        </div>
      </main>
    );
  }
}