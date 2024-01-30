import { Inter } from "next/font/google";
import React from 'react';
import SearchBar from './components/searchBar'
import { Breadcrumb, Card, Avatar} from 'antd';
import { LoginOutlined, CreditCardOutlined, NotificationOutlined, SearchOutlined, EnvironmentOutlined} from '@ant-design/icons';

const inter = Inter({ subsets: ["latin"] });

const serviceList = {
  "Geolocation" : ["green", EnvironmentOutlined],
  "Login": ["red", LoginOutlined],
  "Payment": ["amber", CreditCardOutlined],
  "Notification": ["green", NotificationOutlined],
  "Search": ["green", SearchOutlined],
}

// sorting functions be changed depending on the serviceList
const sortedServiceArray = Object.entries(serviceList).map(([serviceName, [status, Icon]]) => ({
  serviceName,
  status,
  Icon
}));
sortedServiceArray.sort((a, b) => {
  const order = { red: 0, amber: 1, green: 2 };
  return order[a.status] - order[b.status];
});


export default function Home() {

  return (
    <main>
      <div className="p-14">
        <Breadcrumb
          className="text-xl mb-10"
          items={[
            {
              title: "Services",
            },
          ]}
        />
        <SearchBar/>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {sortedServiceArray.map(({ serviceName, status, Icon }) => (
            <Card 
              key={serviceName} 
              className="w-72"
            >
              {status === "red" 
              ? (<Avatar  
                  icon={Icon && <Icon />} 
                  style={{ backgroundColor: "#ffa5a1", color: "#f01e2c"}}
                />
              ): status === "amber"
              ? (<Avatar  
                  icon={Icon && <Icon />} 
                  style={{ backgroundColor: '#ffc17a', color: "#ff7e00"}}
                />
              ): status === "green"
              ?  (<Avatar  
                  icon={Icon && <Icon />} 
                  style={{ backgroundColor: "#acdf87", color: "#4c9a2a" }}
                />
              ): null}
              <span className="ml-10">{serviceName}</span>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}