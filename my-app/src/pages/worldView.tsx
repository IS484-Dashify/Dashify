import React, { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { AiOutlineBars, AiOutlineHome } from 'react-icons/ai';
import { FaCircle } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import {Breadcrumbs, BreadcrumbItem, Tooltip} from "@nextui-org/react";
import { useRouter } from 'next/router';
import Link from "next/link";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import Map from "../../public/map.json"
import { hasFlag, countries } from 'country-flag-icons'
import "country-flag-icons/3x2/flags.css";
import Sidebar from "./components/navbar";
import rawData from './../../public/vmInfo.json';

const data: Service[] = rawData as Service[];
type Status = "Critical" | "Warning" | "Normal";
interface Service {
  serviceName: string;
  status: Status;
  countries: Country[]; 
}
interface Country {
  name: string;
  iso: string;
  coordinates: number[];
  status: Status; 
  vm:  Vm[];
}
interface Vm {
  name: string;
  status: Status;
  components: Component[];
}
interface Component {
  name: string;
  status: Status;
}
interface Marker {
  name: string;
  iso: string;
  coordinates: number[];
  status: Status;
  vm: Vm[];
}

// Define the order object with keys of type Status
const order: Record<Status, number> = { Critical: 0, Warning: 1, Normal: 2 }

const sortVMsByStatus = (vms: Vm[]): Vm[] => {
  return vms.sort((a, b) => order[a.status] - order[b.status]);
};

const sortComponentsByStatus = (components: Component[]): Component[] => {
  return components.sort((a, b) => order[a.status] - order[b.status]);
};

const sortedServices = data.map((service: Service) => {
  if (service.countries) {
    const sortedCountries = service.countries.map((country: Country) => {
      const sortedVMs = sortVMsByStatus(country.vm).map((vm: Vm): Vm => {
        return {
          ...vm,
          components: sortComponentsByStatus(vm.components),
        };
      });

      return { ...country, vm: sortedVMs };
    }).sort((a: Country, b: Country) => order[a.status] - order[b.status]);

    return { ...service, countries: sortedCountries };
  }
  return service;
}).sort((a: Service, b: Service) => order[a.status] - order[b.status]);

const tooltipContent = (countryName: string, iso: string, vm: Vm[]) => {
  const status_counts = {"Normal": 0, "Critical": 0, "Warning": 0};
  if (countries.includes(iso) && hasFlag(iso)) {
    vm.forEach(({status}) => {
      if (status === "Normal") {
        status_counts["Normal"] += 1;
      } else if (status === "Warning") {
        status_counts["Warning"] += 1;
      } else if (status === "Critical") {
        status_counts["Critical"] += 1;
      }
    });
  }

  return(
    <div className="px-1 py-2">
      <span className={"flag:" + iso} /><div className="text-md font-bold mb-2 ml-2 inline-flex">{countryName}</div>
      <div className="text-sm">
        <span className="inline-flex items-center me-2"><AiOutlineBars className="me-1"/> {Object.keys(vm).length}</span>
        <span className="inline-flex items-center me-2"><FaCircle className="text-reddish-200 me-1"/> {status_counts["Critical"]}</span>
        <span className="inline-flex items-center me-2"><FaCircle className="text-amberish-200 me-1"/> {status_counts["Warning"]}</span>
        <span className="inline-flex items-center me-2"><FaCircle className="text-greenish-200 me-1"/> {status_counts["Normal"]}</span>
      </div>
    </div>
  )
}

const statusColors = {
  Normal: "text-greenish-200 me-1",
  Warning: "text-amberish-200 me-1",
  Critical: "text-reddish-200 me-1"
};

const ToggleableList = ({ items, vmName, status, selectedService } : {items : {componentName: string; status: Status;}[], vmName : string, status : Status, selectedService : string | string[] | null | undefined  }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 py-3">
      <div className="flex justify-between items-center">
        <button className="flex items-center text-lg font-semibold justify-between w-full pr-1" onClick={() => setIsOpen(!isOpen)}>
          <div className='flex items-center'>
            {vmName}
            <FaCircle className={`pl-2 ${statusColors[status]}`} />
          </div>
          {isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
        </button>
      </div>
      {(
        <div className="mt-3">
          {items.map((item, index) => (
            <Link key={index} href={`/infraView?currentService=${selectedService}&currentComponent=${item.componentName}`}>
              <div className={`pb-1 transition-all duration-300 overflow-hidden w-full ${isOpen ? "h-fit" : "h-0"}`}>
                <div key={index} className="flex items-center justify-between">
                  <span>{item.componentName}</span>
                  <FaCircle className={statusColors[item.status]} />
                </div>
                {item.status === 'Critical' || item.status === 'Warning' ? (
                  <div className="flex justify-between text-xs italic mb-2">
                    <span>CPU down</span>
                    <span>3 hours ago</span> 
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const RightPopup = ({isOpen, setIsOpen, selectedMarker, selectedService} :  {isOpen : boolean, setIsOpen:(value: boolean) => void, selectedMarker : Marker | null, selectedService : string | string[] | null | undefined }) => {
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
  
  const vmsToShow = selectedMarker?.vm
  .map(vm => ({
    name: vm.name,
    status: vm.status,
    components: vm.components.map(component => ({
      componentName: component.name,
      status: component.status
    }))
  }));

  return (
    <div ref={popupRef} className="fixed right-0 top-0 w-72 p-6 h-full bg-white shadow-lg z-50">
      <div className="flex flex-row items-center mb-6">
        <button onClick={() => setIsOpen(false)}>
          <IoArrowBackCircleOutline size="25px"/>
        </button>
        <div className="flex items-center pl-12">
          <h2 className="font-bold text-lg">{selectedMarker.name}</h2>
        </div>
      </div>
      {vmsToShow.map(vm => 
        <ToggleableList key={vm.name} items={vm.components} vmName={vm.name} status={vm.status} selectedService={selectedService}/>
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
  const { currentService } = router.query;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);  
  console.log(currentService)

  const handleMarkerClick = (marker : Marker) => {
    setSelectedMarker(marker);
    setIsPopupOpen(true);
  };
  if(session){
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
                <BreadcrumbItem key="world" href={`/worldView?service=${currentService}`}  startContent={<GiWorld/>} isCurrent={currentPage === "world"}>
                  {currentService}
                </BreadcrumbItem>
              </Breadcrumbs>
              <h1 className='text-4xl font-bold text-pri-500 mt-1 pt-2'>{currentService}</h1>
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
                  {sortedServices.map(service => service.serviceName === currentService ? (
                    service.countries.map(({ name, iso, coordinates, status, vm }) => (
                      <Marker key={iso} coordinates={[coordinates[0], coordinates[1]]} className="map-marker cursor-pointer " onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })}>
                        {
                            status === "Critical" 
                            ? (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                                <circle r={4.2} fill="#ffa5a1" stroke="#f01e2c" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                              </Tooltip>
                            ): status === "Warning"
                            ? (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                                <circle r={4.2} fill="#ffc17a" stroke="#ff7e00" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                              </Tooltip>
                            ): status === "Normal"
                            ?  (<Tooltip showArrow={true} content={tooltipContent(name, iso, vm)}>
                                <circle r={4.2} fill="#acdf87" stroke="#4c9a2a" strokeWidth={1} onClick={() => handleMarkerClick({ name, iso, coordinates, status, vm })} />
                              </Tooltip>
                            ): null
                          }
                      </Marker>
                    ))
                  ) : null)}
                </ComposableMap>
              </div>
              <div className={`transition-all duration-150 ease-in-out ${isPopupOpen ? "w-2/6 opacity-100" : "w-0 opacity-0"}`}>
                <RightPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} selectedMarker={selectedMarker} selectedService={currentService}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}