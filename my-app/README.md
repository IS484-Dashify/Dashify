# Dashify
Dashify is a solution designed to aggregate and consolidate alerts and status updates from a multitude of monitoring tools employed across diverse technological layers, including infrastructure, middleware, and applications. Our objective is to establish a platform that quickly identifies issues, delivers a thorough overview of service statuses, and streamlines incident management, ultimately providing a comprehensive understanding of the health and status of all applications.

## Overview
- Frontend: React (Next.js), TailwindCSS, ShadCN, NextUI
- Backend: Python (Flask), JavaScript (Node.js)
- Platforms: Azure, Vercel, Apache NiFi 
- Database: MySQL
## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development purposes.
```
git clone https://github.com/IS484-Dashify/Dashify.git
```
### Frontend Development
1. Navigate to the `/my-app` Directory:
```
cd my-app
```
2. Install dependencies
```
npm install
```
3. Enviornment Variables
Create .env file and include the enviornment variables stated in the `User Guide document`

4. Create a production build
```
npm run build
```
5. Start the production build
```
npm run start
```
6. If unable to carry out step 4 & 5, start development mode instead
```
npm run dev
```

The production build/development server will start by default at `http://localhost:3000`.