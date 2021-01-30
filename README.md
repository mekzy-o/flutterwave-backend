# flutterwave-backend

> This challenge was done as part of the requirement for the flutterwave Node.js Job.

# Rule Validation API

This API validates data against the specified condition.

## Installing / Getting started

To get started, follow the steps listed below:

- Copy the environment variables sample file i.e `cp .env.sample .env`.
- Fill in the required environment variables e.g `PORT=8080`.
- Run `npm ci` to install all dependencies and dev-dependencies without updating their version.
- Run `npm run start:dev` to start the development environment, and enable server to listen for incoming requests.

## Building

This app was developed using ES6 syntax and transpile by babel;

## Features

The API has two endpoints.

- `GET /` The default home route
- `POST /validate-rule` The route for rule-validation api.

## Links

- API Base URL: https://rule-validator-backend.herokuapp.com/
- GitHub Repository: https://https://github.com/mekzy-o/flutterwave-backend

## Making requests

### GET /

Response body

```json
{
  "message": "My Rule-Validation API.",
  "status": "success",
  "data": {
    "name": "John Doe",
    "github": "@johndoe",
    "email": "johndoe@gmail.com",
    "mobile": "080000000",
    "twitter": "@johndoe"
  }
}
```

### POST /validate-rule

#### Sample Successful Validation:

Request Body

```json
{
  "rule": {
    "field": "missions.count",
    "condition": "gte",
    "condition_value": 30
  },
  "data": {
    "name": "James Holden",
    "crew": "Rocinante",
    "age": 34,
    "position": "Captain",
    "missions": {
      "count": 45,
      "successful": 44,
      "failed": 1
    }
  }
}
```

Response body

```json
{
  "message": "field missions.count successfully validated.",
  "status": "success",
  "data": {
    "validation": {
      "error": false,
      "field": "missions.count",
      "field_value": 45,
      "condition": "gte",
      "condition_value: 30
    }
  }
}
```

#### Sample Unsucessful Response:

Request body

```json
{
  "rule": {
    "field": "0",
    "condition": "eq",
    "condition_value": "a"
  },
  "data": "damien-marley"
}
```

Error Response body

```json
{
  "message": "field 0 failed validation.",
  "status": "error",
  "data": {
    "validation": {
      "error": true,
      "field": "0",
      "field_value": "d",
      "condition": "eq",
      "condition_value": "a"
    }
  }
}
```
