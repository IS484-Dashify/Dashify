import requests

def fetch_all_data():
    try:
        endpoint = 'get-all-results'
        port = '5004'
        ip_address = '127.0.0.1'
        url = f'http://{ip_address}:{port}/api/fetchData?endpoint={endpoint}'
        
        response = requests.get(url)
        
        if response.ok:
            data = response.json()
            # Process the retrieved data here
            return data
        else:
            response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

# Call the function to fetch data
result = fetch_all_data()
print(result)
