# Free Mentors API

This is a GraphQL API for managing users and their roles in a mentorship platform. It allows users to register, log in, and change roles (if they are an admin). The API is built using Django, Graphene, and MongoDB.

---

## Table of Contents
1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Project](#running-the-project)
2. [GraphQL API Documentation](#graphql-api-documentation)
   - [Queries](#queries)
   - [Mutations](#mutations)
3. [Examples](#examples)
4. [Contributing](#contributing)

---

## Getting Started

### Prerequisites
Before running the project, ensure you have the following installed:
- Docker
- Docker Compose

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/free-mentors-api.git
   cd free-mentors-api 
   ```

2. Set up environment variables:
Create a .env file in the root directory and add the following variables:

   ```bash
    MONGO_URI=mongodb://admin:secret@mongodb:27017/free_mentors_db?authSource=admin
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=admin@123
    SECRET_KEY=your-secret-key
    ```

### Running the Project

1. Build and start Docker containers:

   ```bash
   docker-compose up --build
   ```

2. The API will be available at:

   ```bash
    http://localhost:8000/graphql/
    ```


## GraphQL API Documentation

### Queries

#### 1. `allUsers`

Fetch all users or filter by role

#### Arguments:

- `role` (optional): Filter users by role (e.g., `USER`, `ADMIN`).

#### Response:

A list of `UserType` objects.

#### Example Query:

    ```bash
    query {
        allUsers {
        firstName
        lastName
        email
        role
        }
    }
    ``` 
#### Example Filtered Query:

    ```bash
    query {
      allUsers(role: "ADMIN") {
        firstName
        lastName
        email
        role
       }
    }
    ``` 

### Mutations

#### 1. `registerUser`

Register a new user.

#### Arguments:

- `firstName` (required): User's first name.
- `lastName` (required): User's last name.
- `email` (required): User's email.
- `password` (required): User's password.
- `bio` (optional): User's bio.
- `address` (optional): User's address.
- `occupation` (optional): User's occupation.
- `expertise` (optional): User's expertise.

#### Response:

- `success`: Boolean indicating success or failure.
- `message`: A message describing the result.

#### Example Mutation:

    ```bash
    mutation {
        registerUser(
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            password: "password123",
            bio: "Software Engineer",
            address: "123 Main St",
            occupation: "Developer",
            expertise: "Python"
        ) {
            success
            message
        }
    }
    ``` 


#### 2. `loginUser`

Log in a user and generate a JWT token.

#### Arguments:

- `email` (required): User's email.
- `password` (required): User's password.

#### Response:

- `success`: Boolean indicating success or failure.
- `message`: A message describing the result.
- `token`: JWT token for authenticated requests.

#### Example Mutation:

    ```bash
   mutation {
    loginUser(
        email: "john@example.com",
        password: "password123"
    ) {
        success
        message
        token
    }
   }
    ``` 


#### 3. `changeUserRole`

Change the role of a user (admin only).

#### Arguments:

- `userEmail` (required): Email of the user whose role will be changed.
- `newRole` (required): New role for the user (e.g., `USER`, `MENTOR`, `ADMIN`).

#### Response:

- `success`: Boolean indicating success or failure.
- `message`: A message describing the result.

#### Example Mutation:

    ```bash
    mutation {
        changeUserRole(
            user_email: "john@example.com",
            new_role: "ADMIN"
        ) {
            success
            message
        }
    }
    ```