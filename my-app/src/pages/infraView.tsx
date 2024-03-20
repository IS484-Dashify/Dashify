import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { GiWorld } from "react-icons/gi";
import { TfiReload } from "react-icons/tfi";
import { VscGraph } from "react-icons/vsc";
import {
  Breadcrumbs,
  BreadcrumbItem,
  DropdownItemProps,
  select,
} from "@nextui-org/react";
import Sidebar from "./components/navbar";
import InfraFilter from "./components/infraFilter";
import { AreaChart } from "@tremor/react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { DateTimeFormatOptions } from "intl";
import LogViewer from "./components/LogViewer";
import ServerActions from "./components/ServerActions"; // Adjust the path as necessary

const rawTerminalData = [
  "0|server   | /home/dashify-test/nodejs-prometheus/server.js:64\n0|server   |   } catch (error) {\n0|server   |   ^\n0|server   |\n0|server   | SyntaxError: missing ) after argument list\n0|server   |     at Module._compile (internal/modules/cjs/loader.js:723:23)\n0|server   |     at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)\n0|server   |     at Module.load (internal/modules/cjs/loader.js:653:32)\n0|server   |     at tryModuleLoad (internal/modules/cjs/loader.js:593:12)\n0|server   |     at Function.Module._load (internal/modules/cjs/loader.js:585:3)\n0|server   |     at Object.<anonymous> (/usr/local/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)\n0|server   |     at Module._compile (internal/modules/cjs/loader.js:778:30)\n0|server   |     at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)\n0|server   |     at Module.load (internal/modules/cjs/loader.js:653:32)\n0|server   |     at tryModuleLoad (internal/modules/cjs/loader.js:593:12)",
  "/home/dashify-test/.pm2/logs/server-out.log last 15 lines:\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000",
];

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
  vm: Vm[];
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
interface Result {
  datetime : string;
  cid : number;
  mid : number;
  clock : number;
  cpu_usage : number;
  disk_usage : number;
  memory_usage : number;
  traffic_in : number;
  traffic_out : number;
  system_uptime : number;
}
interface FetchedData extends Array<Result> {}
interface Metric {
  [key: string]:
    | DiskUsage[]
    | Clock[]
    | CPUUsage[]
    | SystemUptime[]
    | MemoryUsage[]
    | DatetimeOnly[]
    | TrafficIn[]
    | TrafficOut[];
}
interface DiskUsage {
  "Disk Usage": number;
  Datetime: string;
}
interface Clock {
  Clock: number;
  Datetime: string;
}
interface CPUUsage {
  "CPU Usage": number;
  Datetime: string;
}
interface SystemUptime {
  "System Uptime": number;
  Datetime: string;
}
interface MemoryUsage {
  "Memory Usage": number;
  Datetime: string;
}
interface DatetimeOnly {
  Datetime: string;
}
interface TrafficIn {
  "Traffic In": number | null;
  Datetime: string;
}
interface TrafficOut {
  "Traffic Out": number | null;
  Datetime: string;
}
interface TrafficMetric {
  Datetime: string;
  "Traffic In": number | null; // Assuming 'Traffic In' can be null
  "Traffic Out": number | null; // Assuming 'Traffic Out' can be null
}

interface Queries {
  [key: string]: [string, string];
}

// function findCountryAndNameByComponent(
//   componentName: string,
//   services: Service[]
// ) {
//   let results: string[] = [];

//   services.forEach((service) => {
//     service.countries.forEach((country) => {
//       country.vm.forEach((vm) => {
//         const componentFound = vm.components.some(
//           (component) => component.name === componentName
//         );
//         if (componentFound) {
//           results.push(vm.name);
//           results.push(country.name);
//         }
//       });
//     });
//   });
//   return results;
// }

export default function InfrastructureView() {
  const { data: session } = useSession();
  useEffect(() => {
    // console.log("Session:", session);
    if (!session) {
      router.push("/auth/login");
    }
  }, [session]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState("infra");

  // loading state for fetching data
  const [loading, setLoading] = useState(true);
  const cid = router.query.cid;
  const country = router.query.country as string;
  const service = router.query.currentService as string | undefined;
  const component = router.query.currentComponent as string;
  // const componentDetails = findCountryAndNameByComponent(component!, data);

  // System status
  const [systemStatus, setSystemStatus] = useState(true);

  // Logs
  const [terminalLineData, setTerminalLineData] = useState<JSX.Element | null>(
    null
  );

  // Date range for metrics
  const [selectedDateRange, setSelectedDateRange] = useState<string>("15");
  const [metrics, setMetrics] = useState<Metric>({});
  useEffect(() => {
    console.log("Metrics:", metrics);
  }, [metrics]);
  const [trafficMetrics, setTrafficMetrics] = useState<TrafficMetric[]>([]);
  const [downtime, setDowntime] = useState(0); // time difference between current time and last metric
  const [uptime, setUptime] = useState(0);
  const [metricsStatus, setMetricsStatus] = useState({
    "CPU Usage": "Normal",
    "Disk Usage": "Normal",
    "Memory Usage": "Normal",
    Traffic: "Normal",
  });
  const [overallStatus, setOverallStatus] = useState("Normal");
  useEffect(() => {
    // console.log("Metrics Status:", metricsStatus);
    const order = { Critical: 0, Warning: 1, Normal: 2 };
    const sortedMetricStatus = Object.keys(metricsStatus)
      .sort((a, b) => {
        return (
          order[
            metricsStatus[a as keyof typeof metricsStatus] as keyof typeof order
          ] -
          order[
            metricsStatus[b as keyof typeof metricsStatus] as keyof typeof order
          ]
        );
      })
      .reduce((obj, key) => {
        obj[key] = metricsStatus[key as keyof typeof metricsStatus];
        return obj;
      }, {} as { [key: string]: string | undefined });

    // console.log("Overall Status:", sortedMetricStatus[Object.keys(sortedMetricStatus)[0]]);
    if (systemStatus) {
      setOverallStatus(
        sortedMetricStatus[Object.keys(sortedMetricStatus)[0]] as string
      );
    } else {
      setOverallStatus("Critical");
      setMetricsStatus({
        "CPU Usage": "Critical",
        "Disk Usage": "Critical",
        "Memory Usage": "Critical",
        Traffic: "Critical",
      });
    }
  }, [metricsStatus, systemStatus]);

  // Last Updated
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // * Retrieve metrics from db on page load
  useEffect(() => {
    fetchData();
  }, [selectedDateRange, systemStatus, loading]);
  
  const fetchData = async () => {
    try {
      if (cid != null){
        const endpoint = `get-result/${cid}/${selectedDateRange}`; 
        const port = '5004'
        const ipAddress = '127.0.0.1'; 
        const response = await fetch(`/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data);
          const transformedData = transformJSON(data);
          const transformedTrafficData = transformTrafficJSON(transformedData['trafficIn'], transformedData['trafficOut']);
          const transformedMetricsData = {
            'CPU Usage': transformedData['cpuUsageArr'],
            'Disk Usage': transformedData['diskUsageArr'],
            'Memory Usage': transformedData['memoryUsageArr'],
            'Traffic': transformedTrafficData
          }
          setMetrics(transformedMetricsData);
          setTrafficMetrics(transformedTrafficData);
          // setLastUpdated(getCurrentSGTDateTime());
          setLoading(false);
        } else {
          console.error("fetchData error: response")
          throw new Error("Failed to perform server action");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (loading == false && metrics) {
      // ! Check if system is down
      // const latestElement =
      //   metrics["System Uptime"][parseInt(selectedDateRange) - 1];
      // if ("System Uptime" in latestElement && "Datetime" in latestElement) {
      //   // This line is necessary for typescript to verify that firstElement is of type DiskUsage
      //   const systemUptimeElement = latestElement as SystemUptime;
      //   if (systemUptimeElement["System Uptime"] !== 0) {
      //     setSystemStatus(true);
      //   } else {
      //     setSystemStatus(false);
      //   }
      // }
    }
  },[]);

  function transformJSON (fetchedData : FetchedData) : { cpuUsageArr: CPUUsage[], diskUsageArr: DiskUsage[], memoryUsageArr: MemoryUsage[], trafficIn: TrafficIn[], trafficOut: TrafficOut[] } {
    // * transformJSON is a function that takes in the fetchedData and creates an array of data points for each metric (CPU Usage, Disk Usage and Memory Usage) - TrafficInOut is calculated separately
    const cpuUsageArr : CPUUsage[] = []
    const diskUsageArr : DiskUsage[] = []
    const memoryUsageArr : MemoryUsage[] = []
    const trafficIn : TrafficIn[] = []
    const trafficOut : TrafficOut[] = []
    // reverse fetchedData as data is sorted in descending order (latest to oldest)
    fetchedData.reverse().forEach((dataPoint) => {
      // console.log("DataPoint:", dataPoint);
      const datetime = formatDate(dataPoint['datetime']);
      if (dataPoint['cpu_usage'] != null || dataPoint['cpu_usage'] != 0){
        cpuUsageArr.push({ 'CPU Usage': dataPoint['cpu_usage'], 'Datetime': datetime })
      }
      if (dataPoint['disk_usage'] != null || dataPoint['disk_usage'] != 0){
        diskUsageArr.push({ 'Disk Usage': dataPoint['disk_usage'], 'Datetime': datetime })
      }
      if (dataPoint['memory_usage'] != null || dataPoint['memory_usage'] != 0){
        memoryUsageArr.push({ 'Memory Usage': dataPoint['memory_usage'], 'Datetime': datetime })
      }
      if (dataPoint['traffic_in'] != null || dataPoint['traffic_in'] != 0){
        trafficIn.push({ 'Traffic In': dataPoint['traffic_in'], 'Datetime': datetime })
      }
      if (dataPoint['traffic_out'] != null || dataPoint['traffic_out'] != 0){
        trafficOut.push({ 'Traffic Out': dataPoint['traffic_out'], 'Datetime': datetime })
      }
    })
    return {"cpuUsageArr": cpuUsageArr, "diskUsageArr": diskUsageArr, "memoryUsageArr": memoryUsageArr, "trafficIn": trafficIn, "trafficOut": trafficOut}
  }

  function transformTrafficJSON(trafficInArr : TrafficIn[], trafficOutArr : TrafficOut[]) {
    let result : TrafficMetric[] = [];
    for (let i=0; i < trafficInArr.length; i++){
        result.push({
          "Traffic In": trafficInArr[i]["Traffic In"], 
          "Traffic Out": trafficOutArr[i]["Traffic Out"], 
          "Datetime": trafficOutArr[i]["Datetime"]
      })
    }
    return result;
  }

  function formatDate(dateTimeString: string) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let dateTime = new Date(dateTimeString);
    const formattedDate = `${dateTime.getDate()} ${
      monthNames[dateTime.getMonth()]
    } ${dateTime.getFullYear().toString().slice(-2)}, ${dateTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`;
    return formattedDate;
  }

  // function checkPercentageMetric(
  //   metricList: { [key: string]: string; Datetime: string }[],
  //   metricName: "CPU Usage" | "Disk Usage" | "Memory Usage"
  // ) {
  //   const thresholdList = [[80, 60]];
  //   // find the latest (non-null) metric
  //   let latestMetric;
  //   for (let i = metricList.length - 1; i >= 0; i--) {
  //     let dataPoint = metricList[i];
  //     if (dataPoint[metricName] != null) {
  //       latestMetric = dataPoint[metricName];
  //       break;
  //     }
  //   }
  //   // check metric against threshold
  //   if (latestMetric != null) {
  //     let threshold = thresholdList[0];
  //     const metricValue = Number(latestMetric) as number;
  //     if (metricValue > threshold[0]) {
  //       return "Critical";
  //     } else if (metricValue > threshold[1]) {
  //       return "Warning";
  //     } else {
  //       return "Normal";
  //     }
  //   }
  //   return "Unknown";
  // }

  // function convertNullToZero(arr: any[]) {
  //   let result = [];
  //   for (let dataPoint of arr) {
  //     if (dataPoint[Object.keys(dataPoint)[0]] == null) {
  //       dataPoint[Object.keys(dataPoint)[0]] = 0;
  //     }
  //     result.push(dataPoint);
  //   }
  //   return result;
  // }

  // // find time for earliest 0 uptime (only for down components!!)
  // function findHighestZeroDatetime(data: SystemUptime[]) {
  //   for (let i = data.length - 2; i >= 0; i--) {
  //     const uptimeDict = data[i];
  //     if (uptimeDict["System Uptime"] !== 0) {
  //       return data[i + 1]["Datetime"];
  //     }
  //   }
  // }

  // // convert array to dictionary, key is the name of the metric
  // function convertToDictionary(arr: any[]) {
  //   const filterTime = parseInt(selectedDateRange);
  //   let result: Metric = {};
  //   for (let subArray of arr) {
  //     let key = Object.keys(subArray[0])[0];
  //     result[key] = subArray.reverse();
  //   }
  //   let metricsToCleanup = [
  //     "CPU Usage",
  //     "Disk Usage",
  //     "Memory Usage",
  //     "System Uptime",
  //   ];
  //   for (let metric of metricsToCleanup) {
  //     result[metric] = convertNullToZero(result[metric]);
  //   }
    // if (systemStatus === false) {
    //   // if system down, calc downtime
    //   const downtimeTime = findHighestZeroDatetime(
    //     result["System Uptime"] as unknown as SystemUptime[]
    //   );
    //   if (downtimeTime && typeof downtimeTime === "string") {
    //     const currentTime = new Date();
    //     const timeDiff =
    //       currentTime.getTime() - new Date(downtimeTime).getTime();
    //     setDowntime(timeDiff / 1000);
    //   }
    // }
    // filter data based on filter time
  //   for (let metric of Object.keys(result)) {
  //     result[metric] = result[metric].slice(-filterTime);
  //   }
  //   setUptime(
  //     (
  //       result["System Uptime"][
  //         parseInt(selectedDateRange) - 1
  //       ] as unknown as SystemUptime
  //     )["System Uptime"]
  //   );
  //   return result;
  // }

  // function formatTime(seconds: number) {
  //   const days = Math.floor(seconds / (3600 * 24));
  //   const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = Math.floor(seconds % 60);
  //   return { days, hours, minutes, seconds: remainingSeconds };
  // }

  // terminal data
  useEffect(() => {
    const combinedTerminalData = rawTerminalData.join("\n\n");
    setTerminalLineData(
      <TerminalOutput>{combinedTerminalData}</TerminalOutput>
    );
  }, [rawTerminalData]);

  // last updated
  const getCurrentSGTDateTime = () => {
    const now = new Date();
    const options: DateTimeFormatOptions = {
      timeZone: "Asia/Singapore",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return now.toLocaleString("en-SG", options);
  };
  useEffect(() => {
    setLastUpdated(getCurrentSGTDateTime());
  }, []);

  if (loading === false && session) {
    return (
      <main>
        <div className="h-full flex flex-row">
          <Sidebar />
          <div className="w-full pr-12 py-6 pl-28 h-full">
            <div id="top-menu" className="z-50">
              <Breadcrumbs
                size="lg"
                underline="hover"
                onAction={(key) => setCurrentPage(String(key))}
              >
                <BreadcrumbItem
                  key="services"
                  startContent={<AiOutlineHome />}
                  href="/servicesView"
                >
                  Services
                </BreadcrumbItem>
                <BreadcrumbItem
                  key="world"
                  href={`/worldView?currentService=${service}`}
                  startContent={<GiWorld />}
                >
                  {service}
                </BreadcrumbItem>
                <BreadcrumbItem
                  key="infra"
                  href={`/worldView?currentService=${service}&currentComponent=${component}`}
                  startContent={<VscGraph />}
                  isCurrent={currentPage === "infra"}
                >
                  {component}
                </BreadcrumbItem>
              </Breadcrumbs>
              <div className="mt-1 pb-8 pt-2">
                <div className="xl:flex lg:flex xl:flex-row lg:flex-row items-end justify-between mb-2">
                  <h1 className="text-4xl font-bold text-pri-500">
                    {component}
                  </h1>
                  <div className="flex items-center mt-2 xl:mt-0">
                    <button
                      className="px-4 py-2 flex justify-center items-center border-1 rounded-lg shadow hover:hover:bg-pri-100/70 hover:text-pri-500 hover:shadow-pri-200 transition-all duration-300 ease-in-out"
                      onClick={fetchData}
                    >
                      <TfiReload className="mr-1.5" />
                      Reload
                    </button>
                    <span className="italic pl-3 text-black/50">
                      Last refreshed {lastUpdated}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="flex items-center">
                    <MdOutlineLocationOn className="mr-2" />{" "}
                    {country}
                  </p>
                  <p className="flex items-center">
                    <HiOutlineComputerDesktop className="mr-2" />{" "}
                    {component}
                  </p>
                </div>
              </div>
              <div className="flex h-full flex-col w-full">
                {systemStatus ? (
                  <div className="flex w-full gap-4">
                    <div
                      className={`bg-white p-4 rounded-lg shadow mb-4 w-1/2 border-t-4 ${
                        overallStatus === "Critical"
                          ? "border-reddish-200"
                          : overallStatus === "Warning"
                          ? "border-amberish-200"
                          : "border-greenish-200"
                      }`}
                    >
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">
                        System Status
                      </h2>
                      <p className="text-3xl flex justify-center items-center text-green-600">
                        Running
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow mb-4 w-1/2">
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">
                        System Uptime
                      </h2>
                      <p className="text-3xl flex justify-center items-end">
                        {/* {`${formatTime(uptime).days}`} */}
                        <span className="text-xl pr-2">d </span>
                        {/* {`${formatTime(uptime).hours}`} */}
                        <span className="text-xl pr-2">h </span>
                        {/* {`${formatTime(uptime).minutes}`} */}
                        <span className="text-xl pr-2">m </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full gap-4">
                    <div
                      className={`bg-white p-4 rounded-lg shadow mb-4 w-1/2 border-t-4 ${
                        overallStatus === "Critical"
                          ? "border-reddish-200"
                          : overallStatus === "Warning"
                          ? "border-amberish-200"
                          : "border-greenish-200"
                      }`}
                    >
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">
                        System Status
                      </h2>
                      <p className="text-3xl flex justify-center items-center text-red-500">
                        Down
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow mb-4 w-1/2">
                      <h2 className="text-lg mb-2 text-gray-600 font-bold text-center">
                        System Downtime
                      </h2>
                      <p className="text-3xl flex justify-center items-end">
                        {/* {`${formatTime(downtime).days}`} */}
                        <span className="text-xl pr-2">d </span>
                        {/* {`${formatTime(downtime).hours}`} */}
                        <span className="text-xl pr-2">h </span>
                        {/* {`${formatTime(downtime).minutes}`} */}
                        <span className="text-xl pr-2">m </span>
                        {/* {`${formatTime(downtime).seconds}`} */}
                        <span className="text-xl">s </span>
                      </p>
                    </div>
                  </div>
                )}
                {/* Don't Delete */}
                {/* <div id="simulations"> */}
                  {/* <p className="text-2xl  text-gray-700 font-bold mt-4"> */}
                    {/* Simulations */}
                  {/* </p> */}
                  {/* <div className="flex items-center w-full mb-4 mt-4"> */}
                    {/* Hardcoded simulations */}
                    {/* <ServerActions ipAddress={"20.82.137.238"} /> */}
                    {/* Other content */}
                  {/* </div> */}
                {/* </div> */}
                <h3 className="text-2xl  text-gray-700 font-bold mt-4">
                  Metrics
                </h3>
                <div className="flex items-center w-full mb-4 mt-4">
                  <InfraFilter
                    selectedDateRange={selectedDateRange}
                    setSelectedDateRange={setSelectedDateRange}
                  />
                </div>
                <div className="grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-4">
                  <div
                    className={`bg-white p-4 rounded-lg shadow border-t-4 ${
                      metricsStatus["CPU Usage"] === "Critical"
                        ? "border-reddish-200"
                        : metricsStatus["CPU Usage"] === "Warning"
                        ? "border-amberish-200"
                        : "border-greenish-200"
                    }`}
                  >
                    <p className="text-base text-gray-600 font-bold mb-4">
                      CPU Usage
                    </p>
                    <AreaChart
                      className="mt-4 h-72"
                      data={metrics["CPU Usage"]}
                      index="Datetime"
                      yAxisWidth={65}
                      categories={["CPU Usage"]}
                      colors={["blue"]}
                      valueFormatter={(value: number) => `${value.toFixed(2)}%`}
                      tickGap={50}
                      maxValue={1}
                    />
                  </div>
                  <div
                    className={`bg-white p-4 rounded-lg shadow border-t-4 ${
                      metricsStatus["Memory Usage"] === "Critical"
                        ? "border-reddish-200"
                        : metricsStatus["Memory Usage"] === "Warning"
                        ? "border-amberish-200"
                        : "border-greenish-200"
                    }`}
                  >
                    <p className="text-base text-gray-600 font-bold mb-4">
                      Memory Usage
                    </p>
                    <AreaChart
                      className="mt-4 h-72"
                      data={metrics["Memory Usage"]}
                      index="Datetime"
                      yAxisWidth={65}
                      categories={["Memory Usage"]}
                      colors={["cyan"]}
                      valueFormatter={(value: number) => `${value.toFixed(2)}%`}
                      tickGap={50}
                      maxValue={1}
                    />
                  </div>
                  <div
                    className={`bg-white p-4 rounded-lg shadow border-t-4 ${
                      metricsStatus["Disk Usage"] === "Critical"
                        ? "border-reddish-200"
                        : metricsStatus["Disk Usage"] === "Warning"
                        ? "border-amberish-200"
                        : "border-greenish-200"
                    }`}
                  >
                    <p className="text-base text-gray-600 font-bold mb-4">
                      Disk Usage
                    </p>
                    <AreaChart
                      className="mt-4 h-72"
                      data={metrics["Disk Usage"]}
                      index="Datetime"
                      yAxisWidth={65}
                      categories={["Disk Usage"]}
                      colors={["blue"]}
                      valueFormatter={(value: number) => `${value}%`}
                      tickGap={50}
                      maxValue={100}
                    />
                  </div>
                  <div
                    className={`bg-white p-4 rounded-lg shadow border-t-4 ${
                      metricsStatus["Traffic"] === "Critical"
                        ? "border-reddish-200"
                        : metricsStatus["Traffic"] === "Warning"
                        ? "border-amberish-200"
                        : "border-greenish-200"
                    }`}
                  >
                    <p className="text-base text-gray-600 font-bold mb-4">
                      Traffic
                    </p>
                    <AreaChart
                      className="mt-4 h-72"
                      data={trafficMetrics}
                      index="Datetime"
                      yAxisWidth={65}
                      categories={["Traffic In", "Traffic Out"]}
                      colors={["blue", "cyan"]}
                      valueFormatter={(value: number) => `${value} bytes`}
                      tickGap={50}
                    />
                  </div>
                </div>
                <p className="text-2xl  text-gray-700 font-bold mt-8">
                  Real-time Logs
                </p>
                <div className="mt-4 mb-4">
                  <Terminal height="400px">
                    {/* {terminalLineData} */}
                    <LogViewer channel={`dashify-${cid}`} event="logs" /> {/* replace dashify-logs with dashify-[cid] where cid is from useParams() */}
                  </Terminal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
