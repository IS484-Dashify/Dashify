import React, { useState } from 'react';

const YourComponent: React.FC = () => {
  const [data, setData] = useState<any>(); // You can adjust the type according to your JSON structure

  const newjson = [
    {
      "serviceName": "Service 1 (Zabbixxxxxxxxxxx)",
      "status": "Normal",
      "countries": [
        { 
          "name": "Denmark", 
          "iso": "DK", 
          "coordinates": [9.5018, 56.2639], 
          "status":"Normal", 
          "vm": [
            {
              "name": "VM 1",
              "status": "Normal",
              "components": [
                {
                  "name": "Node.js Server 1",
                  "status": "Normal"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "serviceName": "Service 2 (Prometheus)",
      "status": "Normal",
      "countries": [
        { 
          "name": "Finland", 
          "iso": "FIN", 
          "coordinates": [25.7482, 61.9241], 
          "status":"Normal", 
          "vm": [
            {
              "name": "VM 1",
              "status": "Normal",
              "components": [
                {
                  "name": "Node.js Server 2",
                  "status": "Normal"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
  const updateInfo = async () => {
    try {
      const response = await fetch('api/updateInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({newjson}),
      });
      const responseData = await response.json();
      console.log(responseData.message); // Log the response message
    } catch (error) {
      console.error('Error updating JSON:', error);
    }
  };
  return (
    <div>
      <button onClick={updateInfo}>button</button>
    </div>
  );
};

export default YourComponent;
