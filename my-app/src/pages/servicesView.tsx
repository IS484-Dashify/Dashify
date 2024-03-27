import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { AiOutlineHome, AiOutlineClose } from "react-icons/ai";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import RagFilter from "../components/ragFilter";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import * as Label from "@radix-ui/react-label";
import Link from "next/link";
import Sidebar from "../components/navbar";


export default function ServiceView() {
  const router = useRouter();
  const { data: session } = useSession();
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

  // initialize states
  const [currentPage, setCurrentPage] = React.useState("services");
  const [services, setServices] = useState<any>(); // ! this is the original list, do not manipulate this directly
  const [searchedServices, setSearchedServices] = useState(services); // this is used to determine rendered services
  const [filteredServices, setFilteredServices] = useState(services); // this is used to determine rendered services
  const [renderedServices, setRenderedServices] = useState(services); // * this is what is being rendered as cards
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSettings, setFilterSettings] = useState<Array<string>>([
    "Critical",
    "Warning",
    "Normal",
  ]);  

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const endpoint = 'get-all-service-name-and-status'; 
        const port = '5006'
        const ipAddress = '4.231.173.235'; 
        const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
        if (response.ok) {
          const data = await response.json();
          const order: { [key: string]: number } = { Critical: 0, Warning: 1, Normal: 2 };
          const sortedData = data.sort((a:any, b:any) => {
            return order[a["status"]] - order[b["status"]];
          });
          setServices(sortedData);
          setRenderedServices(sortedData);
          setSearchedServices(sortedData);
          setFilteredServices(sortedData);
        } else {
          throw new Error("Failed to perform server action");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllServices();
  }, []);

  // handle search & filter
  // Determine services that meet search criteria
  useEffect(() => {
    let result = [];
    if (services) {
      for (let service of services) {
        if (
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          result.push(service);
        }
      }
    }
    setSearchedServices(result);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine services that are included in filter
  const handleFilterClick = (filter: string) => {
    let result = [];
    if (filterSettings.includes(filter)) {
      result = filterSettings.filter((item) => item !== filter);
    } else {
      result = [...filterSettings, filter];
    }
    setFilterSettings(result);
  };

  useEffect(() => {
    let result = [];
    if (services) {
      for (let service of services) {
        if (filterSettings.includes(service.status)) {
          result.push(service);
        }
        setFilteredServices(result);
      }
    }
  }, [filterSettings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine final rendered services
  useEffect(() => {
    let result = [];
    if (searchedServices) {
      for (let service of searchedServices) {
        if (filteredServices.includes(service)) {
          result.push(service);
        }
      }
    }
    setRenderedServices(result);
  }, [searchedServices, filteredServices]);

  // Handle reset
  const handleReset = () => {
    setSearchQuery("");
    setFilterSettings(["Critical", "Warning", "Normal"]);
  };

  if (session && services){
    return (
      <main>
        <div className="h-screen min-h-full flex flex-row">
          <Sidebar />
          <div className="w-full px-14 py-6 h-full ml-16">
            <div id="top-menu" className="mb-8 z-50">
              <Breadcrumbs
                size="lg"
                underline="hover"
                onAction={(key) => setCurrentPage(String(key))}
              >
                <BreadcrumbItem
                  key="services"
                  href="/servicesView"
                  startContent={<AiOutlineHome />}
                  isCurrent={currentPage === "services"}
                >
                  Services
                </BreadcrumbItem>
              </Breadcrumbs>
              <h1 className="text-4xl font-bold text-pri-500 mt-1 pb-8 pt-2">
                Services
              </h1>
              <div className="flex justify-center xl:items-center w-full flex-col xl:flex-row ">
                <div className="flex w-fit">
                  <Label.Root
                    className="text-[15px] font-medium leading-[35px] text-text mr-2"
                    htmlFor=""
                  >
                    Filter By Status
                  </Label.Root>
                  <RagFilter
                    filterSettings={filterSettings}
                    handleFilterClick={handleFilterClick}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-[15px] xl:ml-8 mt-4 xl:mt-0 relative">
                  <input
                    autoComplete="off"
                    className="inline-flex h-[2.5rem] w-[34rem] max-w-full appearance-none bg-transparent border-1 border-slate-500/20 shadow-inner items-center justify-center rounded-[4px] pl-[10px] pr-[30px] text-[15px] leading-none text-text placeholder:text-text/50 outline-none hover:placeholder:text-pri-500 hover:bg-pri-100/70 hover:border-pri-500 focus:shadow focus:bg-pri-100/70 focus:border-pri-500 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-pri-500 transition-all duration-200 ease-in-out"
                    type="text"
                    id="searchQuery"
                    placeholder="Search services by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="h-[2.5rem] px-4 bg-pri-500 rounded-[4px] text-[#F2F3F4] border-1 border-pri-300 shadow-md shadow-transparent hover:border-pri-500 hover:bg-pri-500 hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring"
                    onClick={() => {
                      handleReset();
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
            {renderedServices.length > 0 ? (
              <div className="grid grid-cols-4 gap-7">
                {renderedServices.map(({ sid, name, status }: { sid: string, name: string, status: string }, index: number) => (
                  <div
                    className={`py-4 px-6 cursor-pointer z-0 border-l-4 rounded-lg bg-white shadow-lg shadow-transparent hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring ${
                      status === "Critical"
                        ? "border-reddish-200"
                        : status === "Normal"
                        ? "border-greenish-200"
                        : "border-amberish-200"
                    }`}
                    key={index}
                  >
                    <Link href={`/worldView?sid=${sid}`}>
                      <div id="serviceCard" className="flex justify-between">
                        <h4 className="font-bold text-md text-text">
                          {name}
                        </h4>
                        <div>
                          <MdOutlineArrowForwardIos
                            size={20}
                            className="text-text/30 h-full"
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center w-full text-text/60 italic">
                <p>No services found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }
}
