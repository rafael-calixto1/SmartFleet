# car-fleet-management

## Overview

The  Car Fleet Management API provides endpoints to manage a fleet of vehicles, including operations related to cars, fueling history, tire changes, and drivers.

## Base URL

The base URL for the API is `http://localhost:3000`.

## Table of Contents

1. [Cars](#cars)
   - [Create a New Car](#create-a-new-car)
   - [Get All Cars](#get-all-cars)
   - [Get a Car by ID](#get-a-car-by-id)
   - [Update Car by ID](#update-car-by-id)
   - [Delete a Car by ID](#delete-a-car-by-id)

2. [Fueling](#fueling)
   - [Record Fueling](#record-fueling)
   - [Get Fueling History for a Car](#get-fueling-history-for-a-car)
   - [Get a Specific Fueling Entry by ID](#get-a-specific-fueling-entry-by-id)
   - [Update a Fueling Entry by ID](#update-a-fueling-entry-by-id)
   - [Delete a Fueling Entry by ID](#delete-a-fueling-entry-by-id)

3. [Tire Change](#tire-change)
   - [Record Tire Change](#record-tire-change)
   - [Get Tire Change History for a Car](#get-tire-change-history-for-a-car)
   - [Get a Specific Tire Change Entry by ID](#get-a-specific-tire-change-entry-by-id)
   - [Update a Tire Change Entry by ID](#update-a-tire-change-entry-by-id)
   - [Delete a Tire Change Entry by ID](#delete-a-tire-change-entry-by-id)

4. [Drivers](#drivers)
   - [Add a New Driver](#add-a-new-driver)
   - [Get All Drivers](#get-all-drivers)
   - [Get a Driver by ID](#get-a-driver-by-id)
   - [Update a Driver by ID](#update-a-driver-by-id)
   - [Delete a Driver by ID](#delete-a-driver-by-id)

## Cars

### Create a New Car

- **Endpoint:** `POST /cars`
- **Request:**
  - Body:
    ```json
    {
      "make": "Toyota",
      "model": "Camry",
      "driver": "John Doe"
    }
    ```
- **Response:**
  - Status: 201 Created
  - Body: "Car added successfully"

### Get All Cars

- **Endpoint:** `GET /cars`
- **Response:**
  - Status: 200 OK
  - Body: Array of car objects

### Get a Car by ID

- **Endpoint:** `GET /cars/:id`
- **Request:**
  - Parameters: `id` (Car ID)
- **Response:**
  - Status 200 OK
  - Body: Car object
  - Status 404 Not Found: "Car not found"

### Update Car by ID

- **Endpoint:** `PUT /cars/:id`
- **Request:**
  - Parameters: `id` (Car ID)
  - Body:
    ```json
    {
      "make": "Honda",
      "model": "Accord",
      "driver": "Jane Doe"
    }
    ```
- **Response:**
  - Status 200 OK: "Car updated successfully"
  - Status 404 Not Found: "Car not found"

### Delete a Car by ID

- **Endpoint:** `DELETE /cars/:id`
- **Request:**
  - Parameters: `id` (Car ID)
- **Response:**
  - Status: 200 OK: "Car deleted successfully"
  - Status 404 Not Found: "Car not found"

## Fueling

### Record Fueling

- **Endpoint:** `POST /fueling`
- **Request:**
  - Body:
    ```json
    {
      "carId": 1,
      "fuelAmount": 30.5,
      "fuelDate": "2024-01-11"
    }
    ```
- **Response:**
  - Status: 201 Created
  - Body: "Fueling history added successfully"

### Get Fueling History for a Car

- **Endpoint:** `GET /fueling/:carId`
- **Request:**
  - Parameters: `carId` (Car ID)
- **Response:**
  - Status: 200 OK
  - Body: Array of fueling history entries

### Get a Specific Fueling Entry by ID

- **Endpoint:** `GET /fueling-entry/:id`
- **Request:**
  - Parameters: `id` (Fueling Entry ID)
- **Response:**
  - Status: 200 OK
  - Body: Fueling entry object
  - Status: 404 Not Found: "Fueling entry not found"

### Update a Fueling Entry by ID

- **Endpoint:** `PUT /fueling-entry/:id`
- **Request:**
  - Parameters: `id` (Fueling Entry ID)
  - Body:
    ```json
    {
      "carId": 1,
      "fuelAmount": 35.2,
      "fuelDate": "2024-01-12"
    }
    ```
- **Response:**
  - Status: 200 OK: "Fueling entry updated successfully"
  - Status: 404 Not Found: "Fueling entry not found"

### Delete a Fueling Entry by ID

- **Endpoint:** `DELETE /fueling-entry/:id`
- **Request:**
  - Parameters: `id` (Fueling Entry ID)
- **Response:**
  - Status: 200 OK: "Fueling entry deleted successfully"
  - Status: 404 Not Found: "Fueling entry not found"

## Tire Change

### Record Tire Change

- **Endpoint:** `POST /tire-change`
- **Request:**
  - Body:
    ```json
    {
      "carId": 1,
      "tireChangeDate": "2024-01-15"
    }
    ```
- **Response:**
  - Status: 201 Created
  - Body: "Tire change history added successfully"

### Get Tire Change History for a Car

- **Endpoint:** `GET /tire-change/:carId`
- **Request:**
  - Parameters: `carId` (Car ID)
- **Response:**
  - Status: 200 OK
  - Body: Array of tire change history entries

### Get a Specific Tire Change Entry by ID

- **Endpoint:** `GET /tire-change-entry/:id`
- **Request:**
  - Parameters: `id` (Tire Change Entry ID)
- **Response:**
  - Status: 200 OK
  - Body: Tire change entry object
  - Status: 404 Not Found: "Tire change entry not found"

### Update a Tire Change Entry by ID

- **Endpoint:** `PUT /tire-change-entry/:id`
- **Request:**
  - Parameters: `id` (Tire Change Entry ID)
  - Body:
    ```json
    {
     "carId": 1,
    "tireChangeDate": "2024-01-20"
    }
    ```
- **Response:**
  - Status: 200 OK: "Tire change entry updated successfully"
  - Status: 404 Not Found: "Tire change entry not found"

### Delete a Tire Change Entry by ID

- **Endpoint:** `DELETE /tire-change-entry/:id`
- **Request:**
  - Parameters: `id` (Tire Change Entry ID)
- **Response:**
  - Status: 200 OK: "Tire change entry deleted successfully"
  - Status: 404 Not Found: "Tire change entry not found"

## Drivers

### Add a New Driver

- **Endpoint:** `POST /drivers`
- **Request:**
  - Body:
    ```json
    {
      "name": "John Doe",
      "licenseNumber": "ABC123"
    }
    ```
- **Response:**
  - Status: 201 Created
  - Body: "Driver added successfully"

### Get All Drivers

- **Endpoint:** `GET /drivers`
- **Response:**
  - Status: 200 OK
  - Body: Array of driver objects

### Get a Driver by ID

- **Endpoint:** `GET /drivers/:id`
- **Request:**
  - Parameters: `id` (Driver ID)
- **Response:**
  - Status: 200 OK
  - Body: Driver object
  - Status: 404 Not Found: "Driver not found"

### Update a Driver by ID

- **Endpoint:** `PUT /drivers/:id`
- **Request:**
  - Parameters: `id` (Driver ID)
  - Body:
    ```json
    {
      "name": "Jane Doe",
      "licenseNumber": "XYZ789"
    }
    ```
- **Response:**
  - Status: 200 OK: "Driver updated successfully"
  - Status: 404 Not Found: "Driver not found"

### Delete a Driver by ID

- **Endpoint:** `DELETE /drivers/:id`
- **Request:**
  - Parameters: `id` (Driver ID)
- **Response:**
  - Status: 200 OK: "Driver deleted successfully"
  - Status: 404 Not Found: "Driver not found"

## Server Information

- **Base URL:** `http://localhost:3000`
- **Server Status Endpoint:** `GET /status`
  - **Response:**
    - Status: 200 OK
    - Body: "Server is running"

## Running the Server

To start the server, run the following command:

```bash
npm start
```
 The server will run on port 3000, and you can access the API using the specified endpoints.

