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

### Contact

B. Emmanuel Pericon - brianpericon.e92@gmail.com