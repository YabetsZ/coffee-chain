# ☕️ CoffeeChain Backend System

## Overview

CoffeeChain is a backend system designed to provide API endpoints for tracking the journey of coffee products from farm to cup. This project leverages a blockchain-inspired architecture to ensure transparency, traceability, and fairness in the coffee supply chain. The backend serves as the foundation for the CoffeeChain platform, enabling farmers, companies, and consumers to interact with immutable data about coffee products and their production stages.
- Mobile app that uses it can be found [here](https://github.com/yaftes/coffee-chain)
- Web app that uses it can be found [here](https://github.com/yabets143/Coffeechain)

---

## Features

- **API Endpoints**:
  - Retrieve blockchain data for coffee products.
  - Verify the integrity of blockchain chains.
  - Add new coffee products and production stages.
  - Generate scannable QR codes for product verification.
- **Blockchain Layer**:
  - Simulated private blockchain for immutability and audit trail.
  - Tracks production stages such as farming, harvesting, roasting, packaging, and retail.
- **Data Security**:
  - Ensures tamper-proof data storage using cryptographic hashing.
- **Logging**:
  - Comprehensive logging system using Winston for debugging and monitoring.
- **Validation**:
  - Input validation using Zod schemas for robust API requests.

---

## API Documentation

### Base URL
`http://localhost:5000/api`


## Tech Stack

- **Backend**: Node.js + Express
- **Blockchain Layer**: Simulated private blockchain
- **Validation**: Zod for schema validation
- **Logging**: Winston for logging
- **QR Integration**: QR code generation for product verification
- **Database**: 

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/coffee-chain.git
   ```
2. Navigate to the project directory:
    ```bash
    cd coffee-chain
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a .env file and configure environment variables:
    ```
    PORT=5000
    NODE_ENV=development
    ```
5. Start the development server:
    ```bash
    npm run dev
    ```

### Scripts
```bash
npm run build # Compile TypeScript files into JavaScript.
npm run start # Build and start the server.
npm run dev # Start the server in development mode using nodemon.
```
## Project Structure
```bash
src/
├── controllers/       # API controllers
├── database/          # Database connection and queries
├── models/            # TypeScript models for blockchain and products
├── routes/            # API route definitions
├── schemas/           # Zod schemas for validation
├── services/          # Business logic and blockchain services
├── utils/             # Utility functions (e.g., logger)
├── middlewares/       # Custom middleware (e.g., error handling)
├── server.ts          # Entry point for the backend
```
Logging
The project uses Winston for logging. Logs are stored in the logs/ directory:

combined.log - All logs.
error.log - Error logs only.
Validation
All incoming requests are validated using Zod schemas to ensure data integrity. Example schemas include:

* CoffeeProductSchema - Validates coffee product data.
* JourneyStageSchema - Validates production stage data.
  

## Contributors
* Yabets Zekaryas 

## Contact
For questions or support, please contact:

* Email: yabetszekaryas07@gmail.com
* GitHub: CoffeeChain Repository
