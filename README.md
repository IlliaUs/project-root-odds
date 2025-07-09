# Sports Betting Dashboard with Google Sheets Integration

## Overview

This project consists of two Node.js(NestJS) microservices that together provide a sports betting dashboard integrated with Google Sheets:

- **odds-dashboard**:  
  Fetches up-to-date sports games and odds data from [The Odds API](https://the-odds-api.com/) and stores it in a local PostgreSQL database.

- **writer-service**:  
  Reads data from the database and writes it to a Google Sheets document, providing an easy-to-use interface to view games and odds.

---

## Technologies and Tools

- Node.js  
- NestJS  
- PostgreSQL (hosted on Google Cloud SQL)  
- Google Sheets API  
- Google Apps Script  
- The Odds API  
- Google Cloud Run (for microservices deployment)

---

## Local Setup (Optional)

This project is fully deployed on Google Cloud Run and Google Cloud SQL, so local setup is **not required** to use or test the system.  
However, if you want to run the services locally for development or debugging, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-monorepo.git
    cd your-monorepo
    ```

2. Install dependencies and generate Prisma client for each microservice:

    ```bash
    cd odds-dashboard
    npm install
    npx prisma generate

    cd ../writer-service
    npm install
    ```

3. Use Docker Compose to start the services and PostgreSQL database locally:

    ```bash
    docker-compose up --build
    ```

4. Create `.env` files in each service directory with necessary environment variables (see `.env.example`).

5. Run the services locally (e.g., `npm run start:dev`).

---

## Deployment

- Both microservices are deployed on **Google Cloud Run**.  
- PostgreSQL database is hosted on **Google Cloud SQL**.  
- The linked Google Sheets dashboard is publicly accessible:  
  [Google Sheets Link](https://docs.google.com/spreadsheets/d/1G5-zGuF6fRgKBQxnH0cmYDuinqmO79BjNfC5Uxy77YY/edit?usp=sharing)

---

## APIs Used

- [The Odds API](https://the-odds-api.com/) — for retrieving sports games and odds data.

---

## Refresh Mechanism

The data refresh is implemented via a Google Apps Script linked to the Google Sheet, which triggers the `writer-service` refresh through a button in the spreadsheet UI.

---

## Future Improvements

- Rename **odds-dashboard** to **fetcher-service** for consistency.

- Implement automated scheduled data refresh in the microservices.

