import React, { useEffect, useState }from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineLocationOn } from "react-icons/md";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { GiWorld } from "react-icons/gi";
import { TfiReload } from "react-icons/tfi";
import { VscGraph } from "react-icons/vsc";
import { Breadcrumbs, BreadcrumbItem, DropdownItemProps, select } from "@nextui-org/react";
import Sidebar from "./components/navbar";
import InfraFilter from "./components/infraFilter"
import { AreaChart } from '@tremor/react';
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
interface Column {
  ColumnName: string;
  DataType: string;
  ColumnType: string;
}

interface Row {
  [index: number]: number | string | null;
}
interface RawData {
  TableName: string;
  Columns: Column[];
  Rows: Row[];
}
interface Metric extends Array<DiskUsage[] | Clock[] | CPUUsage[] | SystemUptime[] | MemoryUsage[] | DatetimeOnly[] | TrafficIn[] | TrafficOut[]> {}
interface DiskUsage {
  "Disk Usage": number;
  "Datetime": string;
}
interface Clock {
  "Clock": number;
  "Datetime": string;
}
interface CPUUsage {
  "CPU Usage": number;
  "Datetime": string;
}
interface SystemUptime {
  "System Uptime": number;
  "Datetime": string;
}
interface MemoryUsage {
  "Memory Usage": number;
  "Datetime": string;
}
interface DatetimeOnly {
  "Datetime": string;
}
interface TrafficIn {
  "Traffic In": number | null;
  "Datetime": string;
}
interface TrafficOut {
  "Traffic Out": number | null;
  "Datetime": string;
}
interface TrafficMetric {
  Datetime: string;
  'Traffic In': number | null; // Assuming 'Traffic In' can be null
  'Traffic Out': number | null; // Assuming 'Traffic Out' can be null
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
  const [selectedDateRange, setSelectedDateRange] = useState<string>("15");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [trafficMetrics, setTrafficMetrics] = useState<TrafficMetric[]>([]);
  const [systemStatus, setSystemStatus] = useState(true);
  const [timeDiff, setTimeDiff] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    // console.log("Session:", session);
    if (!session) {
      router.push("/auth/login");
    }
  }, [session, router]);

  // * Retrieve metrics from db on page load
  useEffect(() => {
    fetchData();
  }, [selectedDateRange]); 

  const fetchData = () => {
    const time = selectedDateRange; 
    const queries = {
      "Node.js Server 1": ["nifi_metrics | order by Datetime desc | take ", "3001" ],
      "Node.js Server 2": ["prometheus_metrics_v3 | take ", "3002"]
    }
    const requestBody = {
      query: `${queries[component][0]}${time}`
    };
  
    fetch(`http://20.82.137.238:${queries[component][1]}/queryAdx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
      const transformedData = transformJSON(data.Tables[0]); 
      const transformedTrafficData = transformTrafficJSON(transformedData);
      console.log(data.Tables[0])
      setMetrics(transformedData);
      setTrafficMetrics(transformedTrafficData);
      setLoading(false);
      setMinutes(0)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  
  // ! Check if system is down
  useEffect(() => {
    if(loading == false){
      const latestElement = metrics[0][parseInt(selectedDateRange) - 1];
      console.log(latestElement)
      if('Disk Usage' in latestElement && 'Datetime' in latestElement){ // This line is necessary for typescript to verify that firstElement is of type DiskUsage
        const diskUsageElement = latestElement as DiskUsage;
        const metricTimestamp = new Date(diskUsageElement.Datetime);
        const currentTimestamp = new Date()
        if (!isNaN(metricTimestamp.getTime()) && !isNaN(currentTimestamp.getTime())) {
          const timeDifference = (currentTimestamp.getTime() - metricTimestamp.getTime()) / 1000;
          setTimeDiff(timeDifference);
          if (timeDifference < 240000) {
            setSystemStatus(true); // system down
          } else {
            setSystemStatus(false); // system up
          }
        }
      }
    }
  }, [metrics, loading]);
  
  function transformJSON(rawData: RawData): Metric[] {
    const columnNames = rawData.Columns.map(column => column.ColumnName);
    const chartData = columnNames.map(columnName => {
      const metricData: any[] = [];
      const columnIndex = rawData.Columns.findIndex(column => column.ColumnName === columnName);
      rawData.Rows.forEach(row => {
        const dataPoint: any = { [columnName === "Cpu Usage" ? "CPU Usage" : columnName]: row[columnIndex] };
        const dateTimeString = row[columnNames.indexOf("Datetime")];
        if (dateTimeString) {
          let dateTime = new Date(String(dateTimeString).slice(0, -1)); // ! temporary fix for mistakingly adding 'Z' at the end of the date string
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const formattedDate = `${dateTime.getDate()} ${monthNames[dateTime.getMonth()]} ${dateTime.getFullYear().toString().slice(-2)}, ${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;
          dataPoint["Datetime"] = formattedDate;
        }      
        metricData.push(dataPoint);
      });
      return metricData;
    });
    // console.log("ChartData:", chartData);
    return chartData.map(subArray => subArray.reverse());
  }

  function transformTrafficJSON(transformedData : Metric[]) {
    let result = [];
    for(let i=0; i<transformedData[0].length; i++){
      let trafficInDataRow = transformedData[6][i];
      let trafficInDataPoint = trafficInDataRow['Traffic In'];
      let trafficOutDataRow = transformedData[7][i];
      let trafficOutDataPoint = trafficOutDataRow['Traffic Out'];
      let dateTimeString = transformedData[0][i]['Datetime'];
      if(trafficInDataPoint != null && trafficOutDataPoint != null){
        let dateTime = new Date(String(dateTimeString).slice(0, -1)); // ! temporary fix for mistakingly adding 'Z' at the end of the date string
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${dateTime.getDate()} ${monthNames[dateTime.getMonth()]} ${dateTime.getFullYear().toString().slice(-2)}, ${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;
        let temp = {
          'Datetime': formattedDate,
          'Traffic In': trafficInDataPoint,
          'Traffic Out': trafficOutDataPoint
        }
        result.push(temp);
      }
    }
    // console.log("Result:", result);
    console.log("Traffic Metrics:", result);
    return result;
  }

  function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return { days, hours, minutes, seconds: remainingSeconds };
  }

  useEffect(() => {
    const calculateTime = () => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const minutesSinceRender = Math.floor(elapsedTime / 60000); 
        setMinutes(minutesSinceRender);
      }, 60000); 
      return () => clearInterval(interval);
    };
    calculateTime();
  }, []); 


  console.log(metrics)
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
                <BreadcrumbItem key="world" href={`/worldView?currentService=${service}`}  startContent={<GiWorld/>}>
                  {service}
                </BreadcrumbItem>
                <BreadcrumbItem key="infra" href={`/worldView?currentService=${service}&currentComponent=${component}`}  startContent={<VscGraph/>} isCurrent={currentPage === "infra"}>
                  {component}
                </BreadcrumbItem>
              </Breadcrumbs>
              <div className='mt-1 pb-8 pt-2'>
                <div className='xl:flex lg:flex xl:flex-row lg:flex-row items-end justify-between mb-2'>
                  <h1 className='text-4xl font-bold text-pri-500'>{component}</h1>
                  <div className='flex items-center'>
                    <button 
                      className='px-4 py-2 flex justify-center items-center border-1 rounded-lg shadow hover:hover:bg-pri-100/70 hover:text-pri-500 hover:shadow-pri-200 transition-all duration-300 ease-in-out'
                      onClick={fetchData}
                    >
                      <TfiReload className='mr-1.5'/>
                      Reload
                    </button>
                    <span className='italic pl-3'>
                      Last updated {minutes} minutes ago
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
                      <p className="text-3xl flex justify-center items-center text-green-700">Running</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow mb-4 lg:mb-0 xl:mb-0">
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">System Uptime</h2>
                      <p className="text-3xl flex justify-center items-end">
                        {`${formatTime(metrics[3][0]['System Uptime']).days}`}<span className='text-xl pr-2'>d </span>
                        {`${formatTime(metrics[3][0]['System Uptime']).hours}`}<span className='text-xl pr-2'>h </span>
                        {`${formatTime(metrics[3][0]['System Uptime']).minutes}`}<span className='text-xl pr-2'>m </span>
                        {`${formatTime(metrics[3][0]['System Uptime']).seconds}`}<span className='text-xl'>s </span>
                      </p>
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
                      <p className="text-3xl flex justify-center items-center">{timeDiff}</p>
                    </div>
                  </div>
                )}
                <div className="bg-white p-4 rounded-lg shadow lg:w-2/3 xl:w-2/3 w-full">
                  <h2 className="text-lg text-gray-600 font-bold mb-4">Logs</h2>
                  {/* Add graph here */}
                </div>
              </div>
              <div className='flex items-center w-full mb-4 mt-6'>
                <InfraFilter selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange}/>
              </div>
              <div className='grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4'>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg  text-gray-600 font-bold mb-4">CPU Usage</h2>
                  <AreaChart
                    className="mt-4 h-72"
                    data={metrics[2]}
                    index="Datetime"
                    yAxisWidth={65}
                    categories={["CPU Usage"]}
                    colors={['blue']}
                    valueFormatter={(value: number) => `${value * 100}%`}
                    tickGap={50}
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg text-gray-600 font-bold mb-4">Memory Usage</h2>
                  <AreaChart
                    className="mt-4 h-72"
                    data={metrics[4]}
                    index="Datetime"
                    yAxisWidth={65}
                    categories={["Memory Usage"]}
                    colors={['cyan']}
                    valueFormatter={(value: number) => `${value * 100}%`}
                    tickGap={50}
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg text-gray-600 font-bold mb-4">Disk Usage</h2>
                  <AreaChart
                    className="mt-4 h-72"
                    data={metrics[0]}
                    index="Datetime"
                    yAxisWidth={65}
                    categories={["Disk Usage"]}
                    colors={['blue']}
                    valueFormatter={(value: number) => `${value}%`}
                    tickGap={50}
                  />
                </div>
                <div className="bg-white p-4 rounded-lg border-t-4 border-amberish-200 shadow">
                  <h2 className="text-lg  text-gray-600 font-bold mb-4">Traffic</h2>
                  <AreaChart
                    className="mt-4 h-72"
                    data={trafficMetrics}
                    index="Datetime"
                    yAxisWidth={65}
                    categories={["Traffic In", "Traffic Out"]}
                    colors={['blue', 'cyan']}
                    valueFormatter={(value: number) => `${value} bytes`}
                    tickGap={50}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  };
}