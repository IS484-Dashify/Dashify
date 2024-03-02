// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  data : any;
};
interface Queries {
  [key : string]: [string, string];
}
interface ApiRequestsData {
  endPoint: string;
  query: string;
}
interface Component {
  component: string;
  country : string;
  VM : string;
  service : string;
  apiRequestData: ApiRequestsData;
}

async function fetchQuery(component : Component) {
  const requestBody = {
    query: component.apiRequestData.query,
  };
  
  const res = await fetch(component.apiRequestData.endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })

  const data = await res.json();

  let componentResponse = {
    component : component.component,
    country : component.country,
    VM : component.VM,
    service : component.service,
    data : data
  }
  
  return componentResponse
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    try {
        // 1. Handle POST request
        const { componentList } = req.body;
        const queries: Queries = require('./../../../data/queries.json');
    
        // 2. Define API endpoints
        const apiRequestsDataArr : ApiRequestsData[] = [];
        for (let component of componentList) {
          let API : ApiRequestsData = {
            'endPoint' :`http://20.82.137.238:${queries[component.component][1]}/queryAdx`,
            'query' : queries[component.component][0] + "5"
          };
          apiRequestsDataArr.push(API);
          component['apiRequestData'] = API;
        }
        
        // console.log("componentList:", componentList)

        // 3. Call APIs simultaneously
        const apiRequests = componentList.map(async (component : Component) => {
          return await fetchQuery(component);
        })
        // wait for all API requests to complete
        const response = await Promise.all(apiRequests);
        console.log("Response:", response);
        
        const formattedData = response.map((data, index) => {
          data['metrics'] = transformJSON(data.data['Tables'][0])
          data['trafficMetrics'] = transformTrafficJSON(data['metrics']);
          delete data.data;
          return data
        });

        console.log("FormattedData:", formattedData[0]);
        res.status(200).json({ message: 'POST request received', data: formattedData });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error', data: error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

// ! Helper functions and Types to transform data
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
interface Metric {
  [key:string] : (DiskUsage[] | Clock[] | CPUUsage[] | SystemUptime[] | MemoryUsage[] | DatetimeOnly[] | TrafficIn[] | TrafficOut[])
}
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

function convertNullToZero(arr: any[]) {
  let result = [];
  for(let dataPoint of arr){
    if(dataPoint[Object.keys(dataPoint)[0]] == null){
      dataPoint[Object.keys(dataPoint)[0]] = 0;
    }
    result.push(dataPoint);
  }
  return result;
}

// convert array to dictionary, key is the name of the metric
function convertToDictionary(arr: any[]) {
  let result : Metric = {};
  for(let subArray of arr){
    let key = Object.keys(subArray[0])[0];
    result[key] = subArray.reverse();
  }

  let metricsToCleanup= ["CPU Usage", "Disk Usage", "Memory Usage"];
  for(let metric of metricsToCleanup){
    result[metric] = convertNullToZero(result[metric]);
  }
  return result;
}

function formatDate(dateTimeString : number) {
  // console.log("DateTimeString:", dateTimeString);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let dateTime = new Date(dateTimeString * 1000);
  const formattedDate = `${dateTime.getDate()} ${monthNames[dateTime.getMonth()]} ${dateTime.getFullYear().toString().slice(-2)}, ${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;
  return formattedDate;
}

function transformTrafficJSON(transformedData : Metric) {
  let result = [];
  for(let i=0; i<(transformedData["Traffic In"]).length; i++){
    let trafficInDataRow = transformedData[("Traffic In")][i] as unknown as TrafficIn;
    let trafficInDataPoint = trafficInDataRow['Traffic In'];
    let trafficOutDataRow = transformedData["Traffic Out"][i] as unknown as TrafficOut;
    let trafficOutDataPoint = trafficOutDataRow['Traffic Out'];
    let dateTimeString = trafficOutDataRow['Datetime'];
    if(trafficInDataPoint != null && trafficOutDataPoint != null){
      let temp = {
        'Datetime': dateTimeString,
        'Traffic In': trafficInDataPoint,
        'Traffic Out': trafficOutDataPoint
      }
      result.push(temp);
    }
  }
  return result;
}

function transformJSON(rawData: RawData): Metric {
  const columnNames = rawData.Columns.map(column => column.ColumnName);
  const chartData = columnNames.map(columnName => {
    const metricData: any[] = [];
    const columnIndex = rawData.Columns.findIndex(column => column.ColumnName === columnName);
    rawData.Rows.forEach(row => {
      const dataPoint: any = { [columnName === "Cpu Usage" ? "CPU Usage" : columnName]: row[columnIndex] };
      const clockIndex = columnNames.indexOf("Clock");
      const dateTimeString = row[clockIndex];
      if (dateTimeString) {
        const formattedDate = formatDate(Number(dateTimeString));
        dataPoint["Datetime"] = formattedDate;
      }      
      metricData.push(dataPoint);
    });
    return metricData;
  });
  return convertToDictionary(chartData);
}