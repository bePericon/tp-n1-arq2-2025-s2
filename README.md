# ARQ2 - 2025s2 - LIME

**tp-n1-arq2-2025-s2**

## Description

**This project is a backend service for managing purchases of products such as MercadoLibre. It is defined about exagonal architecture (DDD)**

## Features

-   **User, Seller and Product Management:** Create, read, update, and delete.
-   **Purchase Management:** Create purchases.
-   **Clean Architecture:** Organized into domain, application, and infrastructure layers.
-   **Unit Testing:** Comprehensive unit tests using Jest about domain layer.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.17.1 or higher)
-   [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/bePericon/tp-n1-arq2-2025-s2.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd path/your/downloaded/project/tp-n1-arq2-2025-s2
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Create enviroment file:

    - Copy ```.env.example``` and rename it for ```.env```

### Running the Project

-   **Development Server:**

    ```bash
    npm run dev
    ```

-   **Build and Run:**

    ```bash
    npm run build
    npm run start
    ```

### Running Tests

```bash
npm run test
```

### Project Structure

```
project-root/
├── src/                    # Source code
│   ├── purchases/          # Purchase-related code
│   │   ├── domain/         # Domain layer (entities, repositories, use cases)
│   │   ├── application/    # Application layer (DTOs, services)
│   │   ├── infrastructure/ # Infrastructure layer (database, external services)
│   │   └── tests/          # Unit tests
│   ├── ...                 # Other modules
├── ...                     # Other files
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file

```

### API Endpoints

#### Users endpoints
- POST: /api/users - Create user
    ```json
    {
        "name": "Name",
        "lastName": "Last name",
        "mail": "email@email.com"
    }
    ```
- GET: /api/users/:id - Get user by ID  
- PUT: /api/users/:id - Update user by ID  
    ```json
    // It is possible to edit each field separately
    {
        "name": "Other Name",
        //"lastName": "Last name",
        //"mail": "email@email.com"
    }
    ```
- DELETE: /api/users/:id - Delete user by ID


#### Sellers endpoints
- POST: /api/sellers - Create seller
    ```json
    {
        "companyName": "Company Name",
        "mail": "company.email@email.com"
    }
    ```
- GET: /api/sellers/:id - Get seller by ID  
- PUT: /api/sellers/:id - Update seller by ID  
    ```json
    // It is possible to edit each field separately
    {
        "companyName": "Other Company Name",
        //"mail": "company.email@email.com"
    }
    ```
- DELETE: /api/sellers/:id - Delete seller by ID


#### Products endpoints
- POST: /api/products - Create product
    ```json
    {
        "name": "Product name",
        "description": "Description",
        "price": 1000,
        "stock": 2,
        "sellerId": "sellerId"
    }
    ```
- GET: /api/products/:id - Get product by ID  
- PUT: /api/products/:id - Update product by ID  
    ```json
    // It is possible to edit each field separately
    {
        //"name": "Product name",
        "description": "Other description",
        //"price": 1000,
        //"stock": 2,
    }
    ```
- DELETE: /api/products/:id - Delete product by ID
- GET: /api/products/search?name=wordToSearch - Search products
- GET: /api/products/filter?greaterThan=priceNumber - Filter products

    - Filters: 
        - greaterThan
        - lessThan
        - min
        - max

#### Purchases endpoints
- POST: /api/purchases - Create purchase
    ```json
    {
        "userId": "userId",
        "quantity": 1,
        "productId": "productId"
    }
    ```
- GET: /api/purchases/:id - Get purchase by ID  


### Contact

B. Emmanuel Pericon - brianpericon.e92@gmail.com
