async function proxyApiCall (req, res) {
  const { query, method } = req;

  if (method == "POST"){
    const proxyNifi = req.body;
    const targetUrl = proxyNifi['endPoint'];
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
} else {
  res.status(200).json({ name: 'Connection established' })
}
};

export default proxyApiCall;
