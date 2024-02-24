import { Inter } from "next/font/google";
import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineLogin , AiOutlineCreditCard, AiOutlineNotification, AiOutlineSearch, AiOutlineEnvironment, AiOutlineHome, AiOutlineBars } from 'react-icons/ai';
import { FaCircle } from "react-icons/fa";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
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

const mockServices = [
  {
    serviceName: "Login",
    status: "red",
    Icon: AiOutlineLogin,
    countries: [
      { 
        name: "Singapore", 
        iso: "SG", 
        coordinates: [103.8198, 1.3521], 
        status:"red", 
        vm: {
          "VM1": "red",
          "VM2": "green",
          "VM3": "green"
        }
      }, // 103.8198° E, 1.3521° N
      { 
        name: "Australia", 
        iso: "AU", 
        coordinates: [133.281323, -26.4390917], 
        status:"green", 
        vm: {
          "VM4": "green",
        }
      },
      { 
        name: "China", 
        iso: "CN", 
        coordinates: [79.3871, 43.6426], 
        status:"amber", 
        vm: {
          "VM5": "green",
          "VM6": "amber",
        }
      },
      { 
        name: "France", 
        iso: "FR", 
        coordinates: [1.7191036, 46.2276], 
        status:"amber",
        vm: {
          "VM7": "amber",
        }
      },
      { 
        name: "Hong Kong", 
        iso: "HK", 
        coordinates: [114.1694, 22.3193], 
        status:"red", 
        vm: {
          "VM8": "red",
          "VM9": "amber",
        }
      },
      { 
        name: "United States", 
        iso: "US", 
        coordinates: [-95.7129, 37.0902], 
        status:"red", 
        vm: {
          "VM10": "green",
          "VM11": "red",
        }
      }
    ]
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

const vmList = {
  "VM1" : {
    "component1": "amber",
    "component2": "red",
    "component3": "green"
  },
  "VM2" : {
    "component4": "green",
  },
  "VM3" : {
    "component5": "green",
  },
  "VM4" : {
    "component6": "green",
  },
  "VM5" : {
    "component7": "green",
  },
  "VM6" : {
    "component8": "amber",
  },
  "VM7" : {
    "component9": "amber",
  },
  "VM8" : {
    "component10": "red",
  },
  "VM9" : {
    "component10": "amber",
  },
  "VM10" : {
    "component10": "green",
  },
  "VM11" : {
    "component10": "red",
  }
}

const order = { red: 0, amber: 1, green: 2 };
const sortRAG = (items) => {
  return Object.fromEntries(
    Object.entries(items).sort((a, b) => order[a[1]] - order[b[1]])
  );
};

const sortedServices = mockServices.map(service => {
  if (service.countries) {
    const sortedCountries = service.countries.map(country => ({
      ...country,
      vm: sortRAG(country.vm),
    })).sort((a, b) => order[a.status] - order[b.status]);
    return { ...service, countries: sortedCountries };
  }
  return service;
}).sort((a, b) => order[a.status] - order[b.status]);

const sortedVMList = Object.fromEntries(
  Object.entries(vmList).map(([vmKey, components]) => [vmKey, sortRAG(components)])
);


const getIconForService = (serviceName) => {
  const service = mockServices.find((s) => s.serviceName === serviceName);
  const icon = service? service.Icon : null;
  return icon ? React.createElement(icon) : '';
};

const tooltipContent = (countryName, iso, vm) => {
  const status_counts = {"green": 0, "red": 0, "amber": 0};
  if (countries.includes(iso) && hasFlag(iso)) {
    Object.values(vm).forEach(machineStatus => {
      if (machineStatus === "green") {
        status_counts["green"] += 1;
      } else if (machineStatus === "amber") {
        status_counts["amber"] += 1;
      } else {
        status_counts["red"] += 1;
      }
    });

    return(
      <div className="px-1 py-2">
        <span className={"flag:" + iso} /><div className="text-md font-bold mb-2 ml-2 inline-flex">{countryName}</div>
        <div className="text-sm">
          <span className="inline-flex items-center me-2"><AiOutlineBars className="me-1"/> {Object.keys(vm).length}</span>
          <span className="inline-flex items-center me-2"><FaCircle className="text-reddish-200 me-1"/> {status_counts["red"]}</span>
          <span className="inline-flex items-center me-2"><FaCircle className="text-amberish-200 me-1"/> {status_counts["amber"]}</span>
          <span className="inline-flex items-center me-2"><FaCircle className="text-greenish-200 me-1"/> {status_counts["green"]}</span>
        </div>
      </div>
    )
  }
}

const statusColors = {
  green: "text-greenish-200 me-1",
  amber: "text-amberish-200 me-1",
  red: "text-reddish-200 me-1"
};

const ToggleableList = ({ items, vmName, status }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 py-3">
      <div className="flex justify-between items-center">
        <button className="flex items-center space-x-2 text-lg font-semibold" onClick={() => setIsOpen(!isOpen)}>
          <span>{vmName}</span>
          {isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
        </button>
        <FaCircle className={statusColors[status]} />
      </div>
      {(
        <div className="mt-3">
          {items.map((item, index) => (
            <div className={`pb-1 transition-all duration-300 overflow-hidden w-full ${isOpen ? "h-12" : "h-0"}`}>
              <div key={index} className="flex items-center justify-between">
                <span>{item.componentName}</span>
                <FaCircle className={statusColors[item.status]} />
              </div>
              {(item.status === 'red' || item.status === 'amber') && (
                <div className=" flex justify-between text-xs italic mb-2">
                  <span>CPU down</span>
                  <span >3 hours ago</span> 
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RightPopup = ({ isOpen, setIsOpen, selectedMarker }) => {
  if (!isOpen) return null;
  const popupRef = useRef();

  const vmsToShow = Object.keys(selectedMarker.vm)
    .filter(machine => Object.keys(sortedVMList).includes(machine))
    .map(machine => ({
      name: machine,
      status: selectedMarker.vm[machine],
      components: Object.entries(sortedVMList[machine]).map(([componentName, status]) => ({
        componentName,
        status
      }))
    }));

    useEffect(() => {
      function handleClickOutside(event) {
        const isMarkerClick = event.target.closest('.map-marker');
        if (popupRef.current && !popupRef.current.contains(event.target) && !isMarkerClick) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [popupRef, setIsOpen]);

  return (
    <div ref={popupRef} className="fixed right-0 top-0 w-72 p-6 h-full bg-gray-100 shadow-lg z-50">
      <div className="flex flex-row items-center mb-6">
        <button onClick={() => setIsOpen(false)}>
          <IoArrowBackCircleOutline size="25px"/>
        </button>
        <div className="flex items-center pl-12">
          <h2 className="font-bold text-lg">{selectedMarker.name}</h2>
        </div>
      </div>
      {vmsToShow.map(vm => 
        <ToggleableList key={vm.name} items={vm.components} vmName={vm.name} status={vm.status} />
      )}
    </div>
  );
};

export default function WorldView() {
  const [currentPage, setCurrentPage] = React.useState("world");
  const router = useRouter();
  const { service } = router.query;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);  

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setIsPopupOpen(true);
  };

  return (
    <main>
      <div className="h-screen min-h-full px-14 pt-6 overflow-hidden">
        <div id='top-menu' className="mb-4">
          <Breadcrumbs 
            size="lg" 
            underline="hover" 
            onAction={(key) => setCurrentPage(String(key))}
          >
            <BreadcrumbItem key="services" href="/servicesView" startContent={<AiOutlineHome/>}>
              Services
            </BreadcrumbItem>
            <BreadcrumbItem key="world" href="/worldView" startContent={getIconForService(service)} isCurrent={currentPage === "world"}>
              {service}
            </BreadcrumbItem>
          </Breadcrumbs>
          <h1 className='text-4xl font-bold text-indigo-d-500 mt-1 pt-2'>{service}</h1>
        </div>
        <div className="flex h-full">
          <div 
            className={`transition-all duration-150 ease-in-out w-full mx-auto my-auto -translate-y-10 ${isPopupOpen ? 'scale-125 -translate-x-7' : 'scale-100 -translate-x-10'}`}
            // className={`flex justify-center -translate-x-4 ${isPopupOpen ? 'w-5/6' : 'w-full mx-auto'}`}
          >
            <ComposableMap
              projectionConfig={{ scale: 130 }}
              width={800}
              height = {370}
              // height={isPopupOpen ? 480 : 370}
              style={{ width: "100%", height: "auto"}}
            >
              {/* <ZoomableGroup zoom={1}> */}
                <Geographies 
                  geography={Map} 
                  fill="#e2dbf7" 
                  stroke="#a793e8"
                >
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo}
                        style={{
                          default : {
                            pointerEvents: "none"
                          }
                        }}
                      />
                    ))
                  }
                </Geographies>
                {sortedServices.flatMap(service => service.countries?.map(({ name, iso, coordinates, status, vm }) => (
                  <Marker key={iso} coordinates={coordinates} className=" map-marker cursor-pointer" onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })}>
                    {
                        status === "red" 
                        ? (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                            <circle r={5} fill="#ffa5a1" stroke="#f01e2c" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                          </Tooltip>
                        ): status === "amber"
                        ? (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                            <circle r={5} fill="#ffc17a" stroke="#ff7e00" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                          </Tooltip>
                        ): status === "green"
                        ?  (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                            <circle r={5} fill="#acdf87" stroke="#4c9a2a" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                          </Tooltip>
                        ): null
                      }
                  </Marker>
                  ))
                )}
              {/* </ZoomableGroup> */}
            </ComposableMap>
          </div>
          <div className={`transition-all duration-150 ease-in-out ${isPopupOpen ? "w-2/6 opacity-100" : "w-0 opacity-0"}`}>
            <RightPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} selectedMarker={selectedMarker} />
          </div>
        </div>
      </div>
    </main>
  );
}