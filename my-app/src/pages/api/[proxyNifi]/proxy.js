async function proxyApiCall (req, res) {
  const { query, method } = req;
  const proxyNifi = query.proxyNifi;
  const targetUrl = proxyNifi['endPoint']; // The HTTP URL you're trying to request
  //   const response = await fetch(targetUrl); // Use fetch API to make the HTTP request
  const requestBody = {
    query: proxyNifi['query']
  };

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  res.status(200).json(data); // Send the data back to the client over HTTPS
};

export default proxyApiCall;
