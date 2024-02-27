import { Inter } from "next/font/google";
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";

import { AiOutlineBars, AiOutlineHome } from 'react-icons/ai';
import { FaCircle } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import {Breadcrumbs, BreadcrumbItem, Tooltip} from "@nextui-org/react";
import { useRouter } from 'next/router';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import Map from "../../public/map.json"
import { hasFlag, countries } from 'country-flag-icons'
import "country-flag-icons/3x2/flags.css";
import Sidebar from "./components/navbar";


const inter = Inter({ subsets: ["latin"] });

// Update the Country interface to reflect the correct type of the vm property
type Status = "red" | "green" | "amber";
interface Service {
  serviceName: string;
  status: Status;
  countries: Country[]; // Specify that countries is an array of Country objects
}
interface Country {
  name: string;
  iso: string;
  coordinates: number[];
  status: Status; // Use the Status type here
  vm: { [key: string]: Status };
}
interface Marker {
  name: string;
  iso: string;
  coordinates: number[];
  status: Status;
  vm: { [key: string]: Status };
}

interface VM {
  [key: string]: Status;
}

const mockServices: Service[] = [
  {
    serviceName: "Login",
    status: "red",
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
  }
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

// Define the order object with keys of type Status
const order: Record<Status, number> = { red: 0, amber: 1, green: 2 }

const sortRAG = (items : Record<string, Status>) => {
  return Object.fromEntries(
    Object.entries(items).sort((a, b) => order[a[1]] - order[b[1]])
  );
};

const sortedServices = mockServices.map(service => {
  if (service.countries) {
    const sortedCountries = service.countries.map((country : Country) => ({
      name: country.name,
      iso: country.iso,
      coordinates: country.coordinates,
      status: country.status,
      vm: sortRAG(country.vm),
    })).sort((a: Country, b: Country) => order[a.status] - order[b.status]);
    return { ...service, countries: sortedCountries };
  }
  return service;
}).sort((a, b) => order[a.status] - order[b.status]);

const sortedVMList = Object.fromEntries(
  Object.entries(vmList).map(([vmKey, components]) => [vmKey, sortRAG(components as Record<string, Status>)])
);

const tooltipContent = (countryName: string, iso: string, vm: { [key: string]: Status }) => {
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

const ToggleableList = ({ items, vmName, status } : {items : {componentName: string; status: Status;}[], vmName : string, status : Status}) => {
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
            <div key={index} className={`pb-1 transition-all duration-300 overflow-hidden w-full ${isOpen ? "h-12" : "h-0"}`}>
              <div key={index} className="flex items-center justify-between">
                <span>{item.componentName}</span>
                <FaCircle className={statusColors[item.status]} />
              </div>
              {(item.status === 'red' || item.status === 'amber') && (
                <div className=" flex justify-between text-xs italic mb-2">
                  <span>CPU down</span>
                  <span>3 hours ago</span> 
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// Assuming selectedMarker.vm is structured correctly and contains the VM identifiers you're interested in
const RightPopup = ({isOpen, setIsOpen, selectedMarker} :  {isOpen : boolean, setIsOpen:(value: boolean) => void, selectedMarker : Marker | null}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
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
  if (!isOpen || selectedMarker === null) return null;
  
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
  const { data: session } = useSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log("Session:", session);
    if(!session){
      router.push("/auth/login");
    }
  }, [session]);
  
  const [currentPage, setCurrentPage] = React.useState("world");
  const router = useRouter();
  const { service } = router.query;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);  

  const handleMarkerClick = (marker : Marker) => {
    setSelectedMarker(marker);
    setIsPopupOpen(true);
  };
  if(session){
    return (
      <main>
        <div className="h-screen min-h-full overflow-hidden flex flex-row">
          <Sidebar/>
          <div className="w-full px-14 pt-6">
            <div id='top-menu' className="mb-4">
              <Breadcrumbs 
                size="lg" 
                underline="hover" 
                onAction={(key) => setCurrentPage(String(key))}
              >
                <BreadcrumbItem key="services" startContent={<AiOutlineHome/>} href="/servicesView">
                  Services View
                </BreadcrumbItem>
                <BreadcrumbItem key="world" href="/worldView" startContent={<GiWorld/>} isCurrent={currentPage === "world"}>
                  World View
                </BreadcrumbItem>
              </Breadcrumbs>
              <h1 className='text-4xl font-bold text-pri-500 mt-1 pt-2'>{service}</h1>
            </div>
            <div className="flex h-full">
              <div 
                className={`transition-all duration-150 ease-in-out w-full mx-auto my-auto -translate-y-10 ${isPopupOpen ? 'scale-125 -translate-x-7' : 'scale-100 -translate-x-10'}`}
              >
                <ComposableMap
                  projectionConfig={{ scale: 130 }}
                  width={800}
                  height = {370}
                  style={{ width: "100%", height: "auto"}}
                >
                  <Geographies 
                    geography={Map} 
                    fill="#dce4f9" 
                    stroke="#b9c9f3"
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
                    <Marker key={iso} coordinates={[coordinates[0], coordinates[1]]} className="map-marker cursor-pointer " onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })}>
                      {
                          status === "red" 
                          ? (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                              <circle r={4.2} fill="#ffa5a1" stroke="#f01e2c" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                            </Tooltip>
                          ): status === "amber"
                          ? (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                              <circle r={4.2} fill="#ffc17a" stroke="#ff7e00" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                            </Tooltip>
                          ): status === "green"
                          ?  (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                              <circle r={4.2} fill="#acdf87" stroke="#4c9a2a" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                            </Tooltip>
                          ): null
                        }
                    </Marker>
                    ))
                  )}
                </ComposableMap>
              </div>
              <div className={`transition-all duration-150 ease-in-out ${isPopupOpen ? "w-2/6 opacity-100" : "w-0 opacity-0"}`}>
                <RightPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} selectedMarker={selectedMarker} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}