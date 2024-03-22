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

type Status = "Critical" | "Warning" | "Normal";
interface GroupedData {
  [country: string]: Vm[];
}
interface Vm {
  components: Component[], 
  country: string, 
  iso: string,
  location: string, 
  mName:string, 
  status: Status
}
interface Component {
  cName: string;
  cStatus: Status;
  cid: number
}
type Marker = Vm[];
interface Notification {
  nid: number,
  cid: number,
  reason: string,
  isRead: boolean
  datetime: string,
  status: Status
}

function getReasonsAndDatesByCid(data:any[], cid:number | string) {
  console.log("Data:", data, "CID:", cid)
  console.log("Filtered data:", data.filter(item => item.cid === cid))
  console.log("Mapped data:", data.filter(item => item.cid === cid).map(item => ({ reason: item.reason, date: item.datetime })))
  return data
    .filter(item => item.cid === cid)
    .map(item => ({ reason: item.reason, date: item.datetime }));
}


const tooltipContent = (countryName: string, iso: string, vms: Vm[]) => {
  const status_counts = {"Normal": 0, "Critical": 0, "Warning": 0};
  if (countries.includes(iso) && hasFlag(iso)) {
    vms.forEach(({status}) => {
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
        <span className="inline-flex items-center me-2"><AiOutlineBars className="me-1"/> {Object.keys(vms).length}</span>
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

const ToggleableList = ({ components, vmName, sid, status, alerts } : {components : Component[], vmName : string, sid : string | string[] | undefined, status : Status, alerts: Notification[] }) => {
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
        <div className={`mt-3 transition-all duration-300 overflow-hidden w-full ${isOpen ? "h-fit" : "h-0"}`}>
          {components.map((component, index) => (
            <Link key={index} href={`/infraView?sid=${sid}&cid=${component.cid}`}>
              <div className="pb-1">
                <div className="hover:underline flex items-center justify-between">
                  <span>{component.cName}</span>
                  <FaCircle className={statusColors[component.cStatus]} />
                </div>
                {component.cStatus === 'Critical' || component.cStatus === 'Warning' ? (
                  <div className="flex justify-between text-xs italic mb-2">
                    <span>{getReasonsAndDatesByCid(alerts, component.cid)[0]["date"]}</span>
                    <span>{getReasonsAndDatesByCid(alerts, component.cid)[0]["reason"]}</span>
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

const RightPopup = ({isOpen, setIsOpen, selectedMarker, sid, alerts} :  {isOpen : boolean, setIsOpen:(value: boolean) => void, selectedMarker : Marker | null, sid : string | string[] | undefined, alerts:Notification[] }) => {
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
  
  return (
    <div ref={popupRef} className="fixed right-0 top-0 w-72 p-6 h-full bg-white shadow-lg z-50">
      <div className="flex flex-row items-center mb-6">
        <button onClick={() => setIsOpen(false)}>
          <IoArrowBackCircleOutline size="25px"/>
        </button>
        <div className="flex items-center pl-12">
          <h2 className="font-bold text-lg">{selectedMarker[0]["country"]}</h2>
        </div>
      </div>
      {selectedMarker.map(vm => 
        <ToggleableList key={vm.mName} components={vm.components} vmName={vm.mName} sid={sid} status={vm.status} alerts={alerts}/>
      )}
    </div>
  );
};

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

  
  const [currentPage, setCurrentPage] = React.useState("world");
  const sid = router.query.sid;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);  
  const [apiData, setApiData] = useState<Vm[]>() ;
  const [dataByCountry, setDataByCountry] = useState<GroupedData>({});
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    const fetchAllStatuses = async () => {
      try {
        const endpoint = `get-service-status-details/${sid}`; 
        const port = '5006'
        const ipAddress = '127.0.0.1'; 
        const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
        if (response.ok) {
          const data = await response.json();
          setApiData(data)
          
          // Format data from backend
          const groupedData: GroupedData = {}; 
          for (const key in data) { 
            const { country } = data[key]; 
            if (!groupedData[country]) {
              groupedData[country] = [];
            }
            const machineValue = { ...data[key] }; 
            groupedData[country].push(machineValue);    
          }
          const order: { [key: string]: number } = { Critical: 0, Warning: 1, Normal: 2 };
          for (const country in groupedData){
            // Sort all VMs in a country by status
            groupedData[country] = groupedData[country].sort((a:Vm, b:Vm) => {
              return order[a["status"]] - order[b["status"]];
            });
  
            // Sort all Components in one VM by status
            groupedData[country].forEach((vm: Vm) => {
              vm.components = vm.components.sort((a: Component, b: Component) => {
                return order[a.cStatus] - order[b.cStatus];
              });
            });
          }
          setDataByCountry(groupedData)
        } else {
          throw new Error("Failed to perform server action");
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchAllServices = async () => {
      try {
        const endpoint = `get-service-by-sid/${sid}`; 
        const port = '5001'
        const ipAddress = '127.0.0.1'; 
        const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
        if (response.ok) {
          const data = await response.json();
          setServiceName(data["results"]["name"])
          fetchAllStatuses();
        } else {
          throw new Error("Failed to perform server action");
        }
      } catch (error) {
        console.error(error);
      }
    };
    if(sid != null){
      fetchAllServices();
    }
  }, [sid]);

  const handleMarkerClick = (marker : Marker) => {
    setSelectedMarker(marker);
    setIsPopupOpen(true);
  };

  function convertLocationToList(location: any) {
    location = location.replace('[', '').replace(']', '').split(', ');
    location = location.map(Number);
    return location;
  }

  const [alerts, setAlerts] = useState<Notification[]>([]);
  const fetchAllNotification = async () => {
    try {
      const endpoint = 'get-all-notifications'; 
      const port = '5008';
      const ipAddress = '127.0.0.1'; 
      const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
      
      if (response.ok) {
        const data: Notification[] = await response.json();
        const sortedAlerts = data.filter(notification => 
          ['Critical', 'Warning', 'Normal'].includes(notification.status)
        )
        setAlerts(sortedAlerts);
      } else {
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllNotification();
  }, []);

  if(session && apiData){
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
                <BreadcrumbItem key="world" href={`/worldView?service=${sid}`}  startContent={<GiWorld/>} isCurrent={currentPage === "world"}>
                  {serviceName}
                </BreadcrumbItem>
              </Breadcrumbs>
              <h1 className='text-4xl font-bold text-pri-500 mt-1 pt-2'>{serviceName}</h1>
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
                  {Object.values(dataByCountry).map((dataByCountryElement) =>
                    // TODO:  For each marker, pass in a list of VMs + their components
                    <Marker
                      key={convertLocationToList(dataByCountryElement[0]['country'])}
                      coordinates={[convertLocationToList(dataByCountryElement[0]['location'])[0], convertLocationToList(dataByCountryElement[0]['location'])[1]]}
                      className="map-marker cursor-pointer"
                      onClick={() => handleMarkerClick(dataByCountryElement)}
                    >
                      {dataByCountryElement[0]['status'] === "Critical" ? (
                        <Tooltip showArrow={true} content={tooltipContent(dataByCountryElement[0]['country'], dataByCountryElement[0]['iso'], dataByCountryElement)}>
                          <circle
                            r={4.2}
                            fill="#ffa5a1"
                            stroke="#f01e2c"
                            strokeWidth={1}
                          />
                        </Tooltip>
                      ) : dataByCountryElement[0]['status'] === "Warning" ? (
                        <Tooltip showArrow={true} content={tooltipContent(dataByCountryElement[0]['country'], dataByCountryElement[0]['iso'], dataByCountryElement)}>
                          <circle
                            r={4.2}
                            fill="#ffc17a"
                            stroke="#ff7e00"
                            strokeWidth={1}
                          />
                        </Tooltip>
                      ) : dataByCountryElement[0]['status'] === "Normal" ? (
                        <Tooltip showArrow={true} content={tooltipContent(dataByCountryElement[0]['country'], dataByCountryElement[0]['iso'], dataByCountryElement)}>
                          <circle
                            r={4.2}
                            fill="#acdf87"
                            stroke="#4c9a2a"
                            strokeWidth={1}
                          />
                        </Tooltip>
                      ) : null}
                    </Marker>
                  )}
                </ComposableMap>
              </div>
              <div className={`transition-all duration-150 ease-in-out ${isPopupOpen ? "w-2/6 opacity-100" : "w-0 opacity-0"}`}>
                <RightPopup isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} selectedMarker={selectedMarker} sid={sid} alerts={alerts}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}