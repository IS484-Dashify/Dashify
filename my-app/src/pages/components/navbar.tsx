import { useState } from "react";
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
  {
    icon: <LuUserCog size={25}/>,
    to:"",
    name: "access control"
  }
];

const notifications = [
  {
    id: 1,
    time: "yyyy-MM-dd HH:mm:ss",
    ragStatus: "red",
    message: "[Login] Cpu downnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"
  },
  {
    id: 2,
    time: "yyyy-MM-dd HH:mm:ss",
    ragStatus: "amber",
    message: "[Login] Cpu down"
  },
  {
    id: 3,
    time: "yyyy-MM-dd HH:mm:ss",
    ragStatus: "red",
    message: "[Login] Cpu down"
  },
  {
    id: 4,
    time: "yyyy-MM-dd HH:mm:ss",
    ragStatus: "amber",
    message: "[Login] Cpu down"
  }
]

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);


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
            <Badge content="5" color="danger">
              <div className="opacity-50 hover:opacity-100 hover:text-pri-500">
                <IoNotificationsOutline size={25}/>
              </div>
            </Badge>
          </div>    
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2 h-fit w-48">
            <div className="font-bold">Notifications</div>
            {notifications && notifications.length > 0 ? (
              <>
                {notifications.map(notification => 
                  <div key={notification.id} className="pb-2 my-3 border-b flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${notification.ragStatus === 'red' ? 'bg-reddish-100 border-2 border-reddish-200' : 
                      notification.ragStatus === 'amber' ? 'bg-amberish-100 border-2 border-amberish-200' : 
                      notification.ragStatus === 'green' ? 'bg-greenish-100 border-2 border-greenish-200' : ''}`}>
                    </div>
                    <div className="w-11/12">
                      <div className="break-all">{notification.message}</div>
                      <div className="text-tiny italic">{notification.time}</div>
                    </div>
                  </div>
                )}
                <div className="text-center text-tiny flex hover:underline items-center">
                  See all notifications
                  <LuExternalLink className="ml-1"/>
                </div>
              </>
            ) : (
              <div className="text-tiny flex justify-center items-center h-full py-3">No notifications.</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <button onClick={()=> signOut()}><div className="opacity-60 pb-6"><AiOutlineLogout size={25}/></div></button>
    </div>
  );
};

export default Sidebar;
