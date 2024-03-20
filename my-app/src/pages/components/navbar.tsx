import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { LuExternalLink, LuUserCog } from "react-icons/lu";
import Image from "next/image"
import Link from 'next/link';
import { Badge, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

const sidebarNavItems = [
  {
    icon: <MdOutlineDashboard size={25}/>,
    to: "/servicesView",
    name: "dashboard"
  },
  // {
  //   icon: <LuUserCog size={25}/>,
  //   to:"",
  //   name: "access control"
  // }
];

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

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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
          // console.log(data)
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

  const unreadCount = notifications?.reduce((count, notification) => {
    return count + (notification.isRead ? 0 : 1);
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

  return (
    <div className="border-r-2 px-3 pt-6 flex flex-col items-center bg-white fixed h-full">
      <Image src="/logo(down).png" alt="" width={35} height={35} />
      <div className="flex flex-col h-full items-center justify-center"> 
        {sidebarNavItems.map((item, index) => (
          <Link href={item.to} key={index}> 
            <div className={`my-4 rounded-md ${activeIndex === index ? "text-pri-500" : "opacity-50 hover:opacity-100 hover:text-pri-500"}`}
              onClick={() => setActiveIndex(index)}>
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
      <Popover placement="right-end" shouldCloseOnBlur={true} className="ml-8">
        <PopoverTrigger>
          <div className="my-4 p-1">
            <Badge content={unreadCount} color="danger">
              <div className="opacity-50 hover:opacity-100 hover:text-pri-500">
                <IoNotificationsOutline size={25}/>
              </div>
            </Badge>
          </div>    
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2 h-fit w-80">
            {notifications && notifications.length > 0 ? (
              <>
              <div className="font-bold">Unread Notifications</div>
              <div className="overflow-y-auto max-h-80 my-5"> 
                {notifications
                  .filter(notification => !notification.isRead) 
                  .map(notification => (
                    <Link key={notification.nid} href={`/infraView?sid=${names?.[notification.cid.toString()]["sid"]}&cid=${notification.cid}`}>
                      <div className="pb-2 mb-3 border-b flex">
                        <div className={`w-3 h-3 rounded-full mr-3 mt-[5px] ${notification.status === 'Critical' ? 'bg-reddish-100 border-2 border-reddish-200' :
                          notification.status === 'Warning' ? 'bg-amberish-100 border-2 border-amberish-200' : 
                          notification.status === 'Normal' ? 'bg-greenish-100 border-2 border-greenish-200' : ''}`}>
                        </div>
                        <div className="w-11/12">
                          <div className='font-bold'>{names?.[notification.cid.toString()]["sName"]} | {names?.[notification.cid.toString()]["mName"]} | {names?.[notification.cid.toString()]["cName"]}</div>
                          <div className="break-all">{notification.reason}</div>
                          <div className="text-tiny italic">{formatDate(notification.datetime)}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              <div className="text-center text-tiny flex hover:underline">
                <Link href="/notification" className="flex flex-row items-center justify-center"> 
                  See all notifications
                  <LuExternalLink className="ml-1"/>
                </Link>
              </div>
              </>
            ) : (
              <div className="text-tiny flex justify-center items-center h-full py-3">No unread notifications.</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <button onClick={()=> signOut()}><div className="opacity-50 pb-6 hover:opacity-100 hover:text-pri-500"><AiOutlineLogout size={25}/></div></button>
    </div>
  );
};

export default Sidebar;
