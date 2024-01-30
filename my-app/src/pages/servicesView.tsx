import { Inter } from "next/font/google";
import React from 'react';
import { AiOutlineLogin , AiOutlineCreditCard, AiOutlineNotification, AiOutlineSearch, AiOutlineEnvironment} from 'react-icons/ai';
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import {Avatar, AvatarGroup, AvatarIcon} from "@nextui-org/react";
// import SearchBar from './components/searchBar'
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

  return (
    <main>
      <div className="h-screen p-14">
        {/* <Breadcrumb
          className="text-xl mb-10"
          items={[
            {
              title: "Services",
            },
          ]}
        /> */}
        {/* <SearchBar/> */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {sortedServiceArray.map(({ serviceName, status, Icon }) => (
            <Card 
              key={serviceName}
              className='py-2 px-4'
            >
              <CardHeader className="flex items-start align-middle items-center">
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
            // <Card 
            //   key={serviceName} 
            //   className="w-72"
            // >
            //   {status === "red" 
            //   ? (<Avatar  
            //       icon={Icon && <Icon />} 
            //       style={{ backgroundColor: "#ffa5a1", color: "#f01e2c"}}
            //     />
            //   ): status === "amber"
            //   ? (<Avatar  
            //       icon={Icon && <Icon />} 
            //       style={{ backgroundColor: '#ffc17a', color: "#ff7e00"}}
            //     />
            //   ): status === "green"
            //   ?  (<Avatar  
            //       icon={Icon && <Icon />} 
            //       style={{ backgroundColor: "#acdf87", color: "#4c9a2a" }}
            //     />
            //   ): null}
            //   <span className="ml-10">{serviceName}</span>
            // </Card>
          ))}
        </div>
      </div>
    </main>
  );
}