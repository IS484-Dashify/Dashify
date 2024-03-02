function transformJSON(rawData) {
  const columnNames = rawData.Columns.map((column) => column.ColumnName);
  const chartData = columnNames.map((columnName) => {
    const metricData = [];
    const columnIndex = rawData.Columns.findIndex(
      (column) => column.ColumnName === columnName
    );
    rawData.Rows.forEach((row) => {
      const dataPoint = {
        [columnName === "Cpu Usage" ? "CPU Usage" : columnName]:
          row[columnIndex],
      };
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

function transformTrafficJSON(transformedData) {
  let result = [];
  for (let i = 0; i < transformedData["Traffic In"].length; i++) {
    let trafficInDataRow = transformedData["Traffic In"][i];
    let trafficInDataPoint = trafficInDataRow["Traffic In"];
    let trafficOutDataRow = transformedData["Traffic Out"][i];
    let trafficOutDataPoint = trafficOutDataRow["Traffic Out"];
    let dateTimeString = trafficOutDataRow["Datetime"];
    if (trafficInDataPoint != null && trafficOutDataPoint != null) {
      let temp = {
        Datetime: dateTimeString,
        "Traffic In": trafficInDataPoint,
        "Traffic Out": trafficOutDataPoint,
      };
      result.push(temp);
    }
  }
  return result;
}

async function proxyApiCall (req, res) {
  const targetUrl = "http://20.82.137.238:3001/queryAdx"; // The HTTP URL you're trying to request
  //   const response = await fetch(targetUrl); // Use fetch API to make the HTTP request
  const requestBody = {
    query: `nifi_metrics | order by Datetime desc | take 1440`
  };

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  // .then((response) => response.json())
  // .then((data) => {
  //   const transformedData = transformJSON(data.Tables[0]);
  //   const transformedTrafficData = transformTrafficJSON(transformedData);
  //   // console.log(data.Tables[0])
  //   setMetrics(transformedData);
  //   setTrafficMetrics(transformedTrafficData);
  //   setLastUpdated(getCurrentSGTDateTime());
  //   setLoading(false);
  // })
  // .catch((error) => {
  //   console.error("Error:", error);
  // });
  const data = await response.json();
  const transformedData = transformJSON(data.Tables[0]);
  const transformedTrafficData = transformTrafficJSON(transformedData);
  const returnJson = {
    metrics: transformedData,
    trafficMetrics: transformedTrafficData,
  };
  res.status(200).json(returnJson); // Send the data back to the client over HTTPS
};

export default proxyApiCall;
