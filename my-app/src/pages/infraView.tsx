import React, { useEffect, useState }from 'react';
import { useSession } from "next-auth/react";
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineLocationOn } from "react-icons/md";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { GiWorld } from "react-icons/gi";
import { TfiReload } from "react-icons/tfi";
import { VscGraph } from "react-icons/vsc";
import { Breadcrumbs, BreadcrumbItem, DropdownItemProps } from "@nextui-org/react";
import { useRouter } from 'next/router';
import Sidebar from "./components/navbar";
import InfraFilter from "./components/infraFilter"
import rawData from './../../public/vmInfo.json';
import { AreaChart } from '@tremor/react';

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
interface RawData {
  TableName: string;
  Columns: Column[];
  Rows: Row[];
}

function findCountryAndNameByComponent(componentName: string, services: Service[]) {
  let results: string[] = [];

  services.forEach(service => {
    service.countries.forEach(country => {
      country.vm.forEach(vm => {
        const componentFound = vm.components.some(component => component.name === componentName);
        if (componentFound) {
          results.push(vm.name)
          results.push(country.name)
        };
      });
    });
  });
  return results;
}

export default function InfrastructureView() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = React.useState("infra");
  const router = useRouter();
  const service = router.query.currentService as string | undefined;
  const component = router.query.currentComponent as string | undefined;
  const componentDetails = findCountryAndNameByComponent(component!, data)
  const [metrics, setMetrics] = useState<{ [key: string]: any[] }>({});
  useEffect(() => {
    console.log("Metrics:", metrics);
  }, [metrics]);
  const [systemStatus, setSystemStatus] = useState(true);
  const [downtime, setDowntime] = useState(0);

  useEffect(() => {
    console.log("Session:", session);
    if (!session) {
      router.push("/auth/login");
    }
  }, [session, router]);

  // * Retrieve metrics from db on page load
  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = () => {
    const time = 10; 
    const requestBody = {
      query: `nifi_metrics | order by Datetime desc | take ${time}`
    };
  
    fetch('http://20.82.137.238:3001/queryAdx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
      const transformedData = transformJSON(data.Tables[0]); 
      console.log(data.Tables[0])
      setMetrics(transformedData);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  
  // ! Check if system is down
  useEffect(() => {
    if(loading == false){
        const metricTimestamp = new Date(metrics[0][0].Datetime).getTime();
        const currentTimestamp = new Date().getTime();
        const timeDifference = currentTimestamp - metricTimestamp;
        if (timeDifference < 240000) {
          setSystemStatus(true); // system down
        } else {
          setSystemStatus(false); // system up
          setDowntime(timeDifference);
        }
    }
  }, [metrics, loading]);
  
  function transformJSON(rawData: RawData): any[] {
    const columnNames = rawData.Columns.map(column => column.ColumnName);
    const chartData = columnNames.map(columnName => {
      const metricData: any[] = [];
      const columnIndex = rawData.Columns.findIndex(column => column.ColumnName === columnName);
      rawData.Rows.forEach(row => {
        const dataPoint: any = { [columnName]: row[columnIndex] };
        dataPoint["Datetime"] = row[columnNames.indexOf("Datetime")];
        metricData.push(dataPoint);
      });
      return metricData;
    });
    return chartData;
  }

  if(loading === false && session && Object.keys(metrics).length > 0){
    return (
      <main>
        <div className="h-full flex flex-row">
          <Sidebar/>
          <div className="w-full px-14 py-6 ml-16 h-full">
            <div id='top-menu' className="z-50">
              <Breadcrumbs 
                size="lg" 
                underline="hover" 
                onAction={(key) => setCurrentPage(String(key))}
              >
                <BreadcrumbItem key="services" startContent={<AiOutlineHome/>} href="/servicesView">
                  Services
                </BreadcrumbItem>
                <BreadcrumbItem key="world" href={`/worldView?service=${service}`}  startContent={<GiWorld/>}>
                  {service}
                </BreadcrumbItem>
                <BreadcrumbItem key="infra" href={`/worldView?service=${service}&component=${component}`}  startContent={<VscGraph/>} isCurrent={currentPage === "infra"}>
                  {component}
                </BreadcrumbItem>
              </Breadcrumbs>
              <div className='mt-1 pb-8 pt-2'>
                <div className='xl:flex lg:flex xl:flex-row lg:flex-row items-end justify-between mb-2'>
                  <h1 className='text-4xl font-bold text-pri-500'>{component}</h1>
                  <div className='flex items-center'>
                    <button onClick={fetchData}>
                      <TfiReload />
                    </button>
                    <span className='italic pl-3'>
                      Last updated 14 minutes ago
                    </span>
                  </div>
                </div>
                <p className='flex items-center'><MdOutlineLocationOn className='mr-2'/> {componentDetails[1]}</p>
                <p className='flex items-center'><HiOutlineComputerDesktop className='mr-2'/> {componentDetails[0]}</p>
              </div>
            </div>
            <div className="flex h-full flex-col w-full">
              <div className='xl:flex lg:flex xl:flex-row lg:flex-row w-full mb-4'>
                {systemStatus ? (
                  <div className='flex flex-col lg:w-1/3 xl:w-1/3 pr-4 w-full'>
                    <div className="bg-green-100 p-4 rounded-lg shadow mb-4">
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">System Status</h2>
                      <p className="text-3xl flex justify-center items-center text-green-700">Up</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow mb-4 lg:mb-0 xl:mb-0">
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">System Uptime (In Seconds)</h2>
                      <p className="text-3xl flex justify-center items-cente">{metrics[1][0].Clock}</p>
                    </div> 
                  </div>                
                ) : (
                  <div className='flex flex-col lg:w-1/3 xl:w-1/3 pr-4 w-full'>
                    <div className="bg-red-100 p-4 rounded-lg shadow mb-4">
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">System Status</h2>
                      <p className="text-3xl flex justify-center items-center text-red-500">Down</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">System Downtime (In Seconds)</h2>
                      <p className="text-3xl flex justify-center items-center">{downtime}</p>
                    </div>
                  </div>
                )}
                <div className="bg-white p-4 rounded-lg shadow lg:w-2/3 xl:w-2/3 w-full">
                  <h2 className="text-lg text-gray-600 font-bold mb-4">Logs</h2>
                  {/* Add graph here */}
                </div>
              </div>
              <div className='flex items-center w-full mb-4 mt-6'>
                <InfraFilter/>
              </div>
              <div className='grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4'>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg  text-gray-600 font-bold mb-4">CPU Usage</h2>
                  <AreaChart
                    className="mt-4 h-72"
                    data={metrics[2]}
                    index="date"
                    yAxisWidth={65}
                    categories={["CPU Usage"]}
                    colors={['indigo']}
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg text-gray-600 font-bold mb-4">Memory Usage</h2>
                  {/* Add graph here */}
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg text-gray-600 font-bold mb-4">Disk Usage</h2>
                  {/* Add graph here */}
                </div>
                <div className="bg-white p-4 rounded-lg ">
                  <h2 className="text-lg  text-gray-600 font-bold mb-4">Traffic</h2>
                  {/* Add graph here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  };
}