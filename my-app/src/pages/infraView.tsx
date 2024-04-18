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
import Sidebar from "../components/navbar";
import InfraFilter from "../components/infraFilter";
import { AreaChart } from "@tremor/react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { DateTimeFormatOptions } from "intl";
import Link from "next/link";
import LogViewer from "../components/LogViewer";
import { Tabs, Tab, Chip, Tooltip } from "@nextui-org/react";

const rawTerminalData = [
  "0|server   | /home/dashify-test/nodejs-prometheus/server.js:64\n0|server   |   } catch (error) {\n0|server   |   ^\n0|server   |\n0|server   | SyntaxError: missing ) after argument list\n0|server   |     at Module._compile (internal/modules/cjs/loader.js:723:23)\n0|server   |     at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)\n0|server   |     at Module.load (internal/modules/cjs/loader.js:653:32)\n0|server   |     at tryModuleLoad (internal/modules/cjs/loader.js:593:12)\n0|server   |     at Function.Module._load (internal/modules/cjs/loader.js:585:3)\n0|server   |     at Object.<anonymous> (/usr/local/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)\n0|server   |     at Module._compile (internal/modules/cjs/loader.js:778:30)\n0|server   |     at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)\n0|server   |     at Module.load (internal/modules/cjs/loader.js:653:32)\n0|server   |     at tryModuleLoad (internal/modules/cjs/loader.js:593:12)",
  "/home/dashify-test/.pm2/logs/server-out.log last 15 lines:\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000\n0|server   | Example app listening at http://localhost:3000",
];

type Status = "Critical" | "Warning" | "Normal";
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
// interface Result {
//   datetime: string;
//   cid: number;
//   mid: number;
//   clock: number;
//   cpu_usage: number;
//   disk_usage: number;
//   memory_usage: number;
//   traffic_in: number;
//   traffic_out: number;
//   system_uptime: number;
// }
interface FetchedData {
  "CPU Usage": CPUUsage[];
  "Disk Usage": DiskUsage[];
  "Memory Usage": MemoryUsage[];
  "Traffic Metrics" : TrafficMetric[]
  "System Uptime": number;
  "System Downtime": number;
}
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
interface Name {
  cName: string;
  country: string;
  mName: string;
  sName: string;
}
interface Thresholds {
  critical: number;
  warning: number;
  trafficInWarning: number;
  trafficInCritical: number;
  trafficOutWarning: number;
  trafficOutCritical: number;
}
interface PercentageMetricsData {
  "CPU Usage"?: CPUUsage;
  "Disk Usage"?: DiskUsage;
  "Memory Usage"?: MemoryUsage;
}
interface MetricStatus {
  [key: string]: Status;
  "CPU Usage": Status;
  "Disk Usage": Status;
  "Memory Usage": Status;
  Traffic: Status;
}

export default function InfrastructureView() {
  const router = useRouter();
  const { data: session } = useSession();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  // console.log("Session:", session);

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

  const [currentPage, setCurrentPage] = React.useState("infra");

  // loading state for fetching data
  const [loading, setLoading] = useState(true);
  const cid = router.query.cid as string | string[] | undefined;
  const sid = router.query.sid as string | string[] | undefined;

  // System status
  const [systemStatus, setSystemStatus] = useState(true);

  // Logs
  const [terminalLineData, setTerminalLineData] = useState<JSX.Element | null>(
    null
  );

  // Date range for metrics
  const [fetchedData, setFetchedData] = useState<FetchedData>();
  const [thresholds, setThresholds] = useState<Thresholds>({
    critical: 0,
    warning: 0,
    trafficInWarning: 0,
    trafficInCritical: 0,
    trafficOutWarning: 0,
    trafficOutCritical: 0,
  });
  const [metrics, setMetrics] = useState<Metric>({"Disk Usage:": [], "CPU Usage": [], "Memory Usage": []});
  const [selectedDateRange, setSelectedDateRange] = useState<string>("15"); // 129600 => 90 days
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

  // Last Updated time
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchData = async () => {
    // retrieve data from results.py and store in fetchedData
    try {
      if (cid != null) {
        const endpoint = `get-result/${cid}/${selectedDateRange}`; // pull last 90 days worth of data
        const port = "5004";
        const ipAddress = "4.231.173.235";
        const response = await fetch(
          `/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`
        );
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data.data);
          setFetchedData(data.data);
        } else {
          console.error("fetchData error: response");
          throw new Error("Failed to perform server action");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchThresholds = async () => {
    // retrieve thresholds from thresholds.py
    try {
      if (cid != null) {
        const endpoint = `get-thresholds-by-cid/${cid}`;
        const port = "5005";
        const ipAddress = "4.231.173.235";
        const response = await fetch(
          `/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`
        );
        if (response.ok) {
          const data = await response.json();
          setThresholds({
            critical: data.results["critical"],
            warning: data.results["warning"],
            trafficInWarning: data.results["traffic_in_warning"],
            trafficInCritical: data.results["traffic_in_critical"],
            trafficOutWarning: data.results["traffic_out_warning"],
            trafficOutCritical: data.results["traffic_out_critical"],
          });
          // console.log("Fetched Thresholds:", data);
        } else {
          console.error("fetchThresholds error: response");
          throw new Error("Failed to perform server action");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllNamesAndCountry = async () => {
    try {
      const endpoint = "get-all-names-and-country";
      const port = "5009";
      const ipAddress = "4.231.173.235";
      const response = await fetch(
        `/api/fetchData?endpoint=${endpoint}&port=${port}&ipAddress=${ipAddress}`
      );
      if (response.ok) {
        const data = await response.json();
        // console.log("Data:", data)
        setNames(data);
      } else {
        console.error("fetchAllNamesAndCountry error: response");
        throw new Error("Failed to perform server action");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // * On page load retrieve
  // 1. metrics from results db
  // 2. country name, cName and sName
  // 3. threshold
  const [names, setNames] = useState();
  useEffect(() => {
    fetchData();
    fetchAllNamesAndCountry();
    fetchThresholds();
  }, [cid, selectedDateRange]);

  // * Transform fetched data and set state variables
  // fetchedData is received in descending order
  useEffect(() => {
    // console.log("Fetched Data:", fetchedData);
    if (fetchedData) {
      // * 1. Check if system is up get uptime, if system is down calculate downtime
      // console.log("System up?:", checkSystemStatus(transformedData['systemUptimeArr']));
      if (fetchedData["System Uptime"] != 0) {
        setSystemStatus(true);
        setDowntime(0);
        setUptime(fetchedData["System Uptime"]);

        // Determine metrics status
        const metricsStatus = determineMetricStatus(
          {
            "CPU Usage": fetchedData["CPU Usage"][fetchedData["CPU Usage"].length - 1],
            "Disk Usage": fetchedData["Disk Usage"][fetchedData["Disk Usage"].length - 1],
            "Memory Usage": fetchedData["Memory Usage"][fetchedData["Memory Usage"].length - 1],
          },
          fetchedData["Traffic Metrics"][fetchedData["Traffic Metrics"].length - 1]
        );

        setMetricsStatus(metricsStatus);
        // Determine overall status
        if (Object.values(metricsStatus).includes("Critical")) {
          setOverallStatus("Critical");
        } else if (Object.values(metricsStatus).includes("Warning")) {
          setOverallStatus("Warning");
        } else {
          setOverallStatus("Normal");
        }
      } else {
        setSystemStatus(false);
        console.log("Downtime:", fetchedData["System Downtime"]);
        setDowntime(fetchedData["System Downtime"]);
        // set overall status
        setOverallStatus("Critical");
      }

      // * 2 Set state variables
      setMetrics({
        "CPU Usage": fetchedData["CPU Usage"],
        "Disk Usage": fetchedData["Disk Usage"],
        "Memory Usage": fetchedData["Memory Usage"],
      });
      setTrafficMetrics(fetchedData["Traffic Metrics"]);

      setLastUpdated(getCurrentSGTDateTime());
      setLoading(false);
    }
  }, [fetchedData, thresholds]);

  const findObjectByDatetime = (
    array: TrafficIn[] | TrafficOut[],
    datetime: string
  ) => {
    return array.find((obj) => obj.Datetime === datetime);
  };

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

  function formatTime(seconds: number) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return { days, hours, minutes, seconds: remainingSeconds };
  }

  function determineMetricStatus(
    percentageMetricsData: {
      "CPU Usage": CPUUsage;
      "Disk Usage": DiskUsage;
      "Memory Usage": MemoryUsage;
    },
    trafficData: TrafficMetric
  ) {
    console.log("Determine Metric Status")
    let metricsStatus: MetricStatus = {
      "CPU Usage": "Normal",
      "Disk Usage": "Normal",
      "Memory Usage": "Normal",
      Traffic: "Normal",
    };
    const metricsVars = ["CPU Usage", "Disk Usage", "Memory Usage"];
    for (let variable of metricsVars) {
      if (
        percentageMetricsData[variable as keyof PercentageMetricsData] ===
        undefined
      ) {
        break;
      }
      const latestDataPoint =
        percentageMetricsData[variable as keyof PercentageMetricsData]; // latestDataPoint is either of type CPUUsage, DiskUsage or MemoryUsage
      console.log("Variable:", variable, "Current Metric Value:", latestDataPoint, "Thresholds:", thresholds);
      const currentMetricValue = (latestDataPoint as any)[variable];
      if (currentMetricValue > thresholds["critical"]) {
        metricsStatus[variable] = "Critical";
      } else if (currentMetricValue > thresholds["warning"]) {
        metricsStatus[variable] = "Warning";
      } else {
        metricsStatus[variable] = "Normal";
      }
    }
    console.log("Traffic Data:", trafficData);
    // console.log("Thresholds:", thresholds);

    if (trafficData === undefined) {
      return metricsStatus;
    }

    if (
      (trafficData as any)["Traffic In"] > thresholds["trafficInCritical"] ||
      (trafficData as any)["Traffic Out"] > thresholds["trafficOutCritical"]
    ) {
      metricsStatus["Traffic"] = "Critical";
    } else if (
      (trafficData as any)["Traffic In"] > thresholds["trafficInWarning"] ||
      (trafficData as any)["Traffic Out"] > thresholds["trafficOutWarning"]
    ) {
      metricsStatus["Traffic"] = "Warning";
    } else {
      metricsStatus["Traffic"] = "Normal";
    }
    // console.log("Final Metrics Status:", metricsStatus);
    return metricsStatus;
  }

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

  // console.log(loading)
  // console.log(session)
  // console.log(names)
  // console.log(typeof cid === 'string')

  if (loading === false && session && names && typeof cid === "string") {
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
                <BreadcrumbItem key="services" startContent={<AiOutlineHome />}>
                  <Link href={`/servicesView`} prefetch>
                    Services
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem key="world" startContent={<GiWorld />}>
                  <Link href={`/worldView?sid=${sid}`} prefetch>
                    {names[cid]["sName"]}
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem
                  key="infra"
                  startContent={<VscGraph />}
                  isCurrent={currentPage === "infra"}
                >
                  <Link href={`/infraView?sid=${sid}&cid=${cid}`} prefetch>
                    {names[cid]["cName"]}
                  </Link>
                </BreadcrumbItem>
              </Breadcrumbs>
              <div className="mt-1 pb-8 pt-2">
                <div className="xl:flex lg:flex xl:flex-row lg:flex-row items-end justify-between mb-2">
                  <h1 className="text-4xl font-bold text-pri-500">
                    {names[cid]["cName"]}
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
                    {names[cid]["country"]}
                  </p>
                  <p className="flex items-center">
                    <HiOutlineComputerDesktop className="mr-2" />{" "}
                    {names[cid]["mName"]}
                  </p>
                </div>
              </div>
              <div className="flex h-full flex-col w-full">
                <Tabs
                  aria-label="Options"
                  color="primary"
                  variant="underlined"
                  classNames={{
                    tabList:
                      "gap-6 mx-2 mb-3 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-pri-500",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-pri-500",
                  }}
                >
                  <Tab
                    key="metrics"
                    title={
                      <div className="flex items-center space-x-2">
                        <span>Metrics</span>
                      </div>
                    }
                  >
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
                            {`${formatTime(uptime).days}`}
                            <span className="text-xl pr-2">d </span>
                            {`${formatTime(uptime).hours}`}
                            <span className="text-xl pr-2">h </span>
                            {`${formatTime(uptime).minutes}`}
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
                            {`${formatTime(downtime).days}`}
                            <span className="text-xl pr-2">d </span>
                            {`${formatTime(downtime).hours}`}
                            <span className="text-xl pr-2">h </span>
                            {`${formatTime(downtime).minutes}`}
                            <span className="text-xl pr-2">m </span>
                            {`${formatTime(downtime).seconds}`}
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
                          valueFormatter={(value: number) =>
                            `${value.toFixed(2)}%`
                          }
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
                          valueFormatter={(value: number) =>
                            `${value.toFixed(2)}%`
                          }
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
                  </Tab>
                  <Tab
                    key="Logs"
                    title={
                      <div className="flex items-center space-x-2">
                        <span>Logs</span>
                      </div>
                    }
                  >
                    <div className="mt-4 mb-4">
                      <Terminal height="400px">
                        {/* {terminalLineData} */}
                        <LogViewer
                          channel={`dashify-logs`}
                          event="logs"
                        />
                        {/* replace dashify-logs with dashify-[cid] where cid is from useParams() */}
                      </Terminal>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
