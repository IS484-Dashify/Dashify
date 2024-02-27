import { LineChart } from '@tremor/react';

const rawChartData = [
    {
        "Disk Usage": "30.13", 
        "Clock": "1708956660", 
        "Cpu Usage": "0.7", 
        "System Uptime": "58684", 
        "Datetime": "2024-02-26 22:11:00"
    },
    {
        "Disk Usage": "30.13", 
        "Clock": "1708956590", 
        "Cpu Usage": "0.79", 
        "System Uptime": "58624", 
        "Datetime": "2024-02-26 22:09:50"
    },
    {
        "Disk Usage": "30.13", 
        "Traffic In": "7864", 
        "Clock": "1708956530", 
        "Cpu Usage": "0.68", 
        "System Uptime": "58564", 
        "Memory Usage": "0.0", 
        "Traffic Out": "23904", 
        "Datetime": "2024-02-26 22:08:50"
    },
    {
        "Disk Usage": "30.13", 
        "Clock": "1708956470", 
        "Cpu Usage": "0.79", 
        "System Uptime": "58504", 
        "Memory Usage": "0.0", 
        "Datetime": "2024-02-26 22:07:50"
    },
    {
        "Disk Usage": "30.13", 
        "Clock": "1708956410", 
        "Cpu Usage": "0.68", 
        "System Uptime": "58444", 
        "Memory Usage": "0.0", 
        "Datetime": "2024-02-26 22:06:50"
    }
]

const chartData = [
    {
        "Disk Usage": "30.13", 
        "Datetime": "2024-02-26 22:11:00"
    },
    {
        "Disk Usage": "42", 
        "Datetime": "2024-02-26 22:09:50"
    },
    {
        "Disk Usage": "27.4", 
        "Datetime": "2024-02-26 22:08:50"
    },
    {
        "Disk Usage": "29.7", 
        "Datetime": "2024-02-26 22:07:50"
    },
    {
        "Disk Usage": "32", 
        "Datetime": "2024-02-26 22:06:50"
    }
]
export default function Example() {
    return (
        <LineChart
            className="h-80"
            data={chartData}
            index="Datetime"
            categories={['Disk Usage']}
            colors={['indigo']}
            // valueFormatter={dataFormatter}
            yAxisWidth={60}
            onValueChange={(v) => console.log(v)}
        />
    );
}