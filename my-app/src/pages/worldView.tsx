import { Inter } from "next/font/google";
import React, { useState, useEffect } from 'react';
import { AiOutlineLogin , AiOutlineCreditCard, AiOutlineNotification, AiOutlineSearch, AiOutlineEnvironment, AiOutlineHome, AiOutlineBars} from 'react-icons/ai';
import { FaCircle } from "react-icons/fa"
import {Breadcrumbs, BreadcrumbItem, Tooltip} from "@nextui-org/react";
import { useRouter } from 'next/router';
import { ComposableMap, Geographies, Geography, Marker, Annotation, ZoomableGroup } from "react-simple-maps"
import Map from "../../public/map.json"
import { hasFlag, countries } from 'country-flag-icons'
import "country-flag-icons/3x2/flags.css";


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

const markers = [
  { markerOffset: 15, name: "Singapore", iso: "SG", coordinates: [103.8198, 1.3521], status:"green", serviceNo: 3, red: 0, amber: 0, green: 3}, // 103.8198° E, 1.3521° N
  { markerOffset: 15, name: "Australia", iso: "AU", coordinates: [133.281323, -26.4390917], status:"green", serviceNo: 3, red: 0, amber: 0, green: 3},
  { markerOffset: 15, name: "China", iso: "CN", coordinates: [79.3871, 43.6426], status:"amber", serviceNo: 3, red: 0, amber: 1, green: 2 },
  { markerOffset: 15, name: "France", iso: "FR", coordinates: [1.7191036, 46.2276], status:"amber", serviceNo: 3, red: 0, amber: 2, green: 0  },
  { markerOffset: 15, name: "Hong Kong", iso: "HK", coordinates: [114.1694, 22.3193], status:"red", serviceNo: 3, red: 1, amber: 1, green: 1  },
  { markerOffset: 15, name: "United States", iso: "US", coordinates: [-95.7129, 37.0902], status:"red", serviceNo: 4, red: 2, amber: 2, green: 0  }
];

const getIconForService = (serviceName) => {
  const service = mockServices.find((s) => s.serviceName === serviceName);
  const icon = service? service.Icon : null;
  return icon ? React.createElement(icon) : '';
};

const tooltipContent = (countryName, iso, serviceNo, red, amber, green) => {

  if (countries.includes(iso) === true && hasFlag(iso) === true){
    return(
      <div className="px-1 py-2 ">
        <span className={"flag:" + iso} /><div className="text-md font-bold mb-2 ml-2 inline-flex">{countryName}</div>
        <div className="text-sm">
          <span className="inline-flex items-center me-2"><AiOutlineBars className="me-1"/> {serviceNo}</span>
          <span className="inline-flex items-center me-2"><FaCircle className="text-reddish-200 me-1"/> {red} </span>
          <span className="inline-flex items-center me-2"><FaCircle className="text-amberish-200 me-1"/> {amber}</span>
          <span className="inline-flex items-center me-2"><FaCircle className="text-greenish-200 me-1"/> {green}</span>
        </div>
      </div>
    )
  }
}

export default function WorldView() {
  const [currentPage, setCurrentPage] = React.useState("world");
  const router = useRouter();
  const { service } = router.query;

  return (
    <main>
      <div className="h-screen min-h-full px-14 pt-6">
        <div id='top-menu'>
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
          {/* <h1 className='text-4xl font-bold text-indigo-d-500 mt-1 pb-8 pt-2'>{service}</h1> */}
          <h1 className='text-4xl font-bold text-indigo-d-500 mt-1 pt-2'>Login</h1>
        </div>
        <div data-tip="" className="flex justify-center">
          <ComposableMap className="w-7/12">
            <Geographies geography={Map} fill="#e2dbf7" stroke="#a793e8">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography 
                    key={geo.rsmKey} 
                    geography={geo} 
                  />
                ))
              }
            </Geographies>
            {markers.map(({ name, iso, coordinates, markerOffset, status, serviceNo, red, amber, green }) => (
              <Marker key={iso} coordinates={coordinates}>
                 {
                    status === "red" 
                    ? (<Tooltip showArrow={true} content={tooltipContent(name, iso, serviceNo, red, amber, green )}>
                        <circle r={10} fill="#ffa5a1" stroke="#f01e2c" strokeWidth={2} />
                      </Tooltip>
                    ): status === "amber"
                    ? (<Tooltip showArrow={true} content={tooltipContent(name, iso, serviceNo, red, amber, green )}>
                        <circle r={10} fill="#ffc17a" stroke="#ff7e00" strokeWidth={2} />
                      </Tooltip>
                    ): status === "green"
                    ?  (<Tooltip showArrow={true} content={tooltipContent(name, iso, serviceNo, red, amber, green )}>
                        <circle r={10} fill="#acdf87" stroke="#4c9a2a" strokeWidth={2} />
                      </Tooltip>
                    ): null
                  }
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>
    </main>
  );
}