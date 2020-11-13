# pasiona-test

## Description
-------------
This is a RESTful api that manages some information regarding insurance policies and company clients
There are two services that provide all of the data needed:

- The list of company clients can be found at: http://www.mocky.io/v2/5808862710000087232b75ac
- The list of company policies can be found at: http://www.mocky.io/v2/580891a4100000e8242b75c5

I have created the following endpoints:

### User authentification -> Can be accessed by users with role "users" and "admin"
---
```
    - POST REQUEST: /api/user/auth
    - Headers
      Content-type: application/json
    - Recieves on valid email
    - {
        "message": "Logged in!",
        "data": {
            "token": "YOUR_TOKEN",
            "id": "YOUR_ID"
            }

    - Example Request:
        - http://localhost:3000/api/user/auth
        - Payload:
        
        {
            "email": "YOUR_EMAIL"
        }
        
```

### Get user data filtered by user id -> Can be accessed by users with role "users" and "admin"
-----
```
 - POST REQUEST: /api/user/auth
    - Headers: 
      Content-type: application/json
      Bearer: YOUR_TOKEN
    - Recieves on valid email
    {
    "message": "user successfully retrieved",
    "data": {
        "user": {
            "id": "SEARCHED_ID",
            "name": "SEARCHED_NAME",
            "email": "SEARCHED_EMAIL",
            "role": "SEARCHED_ROL"
        }
    }

    - Example Request:
        - http://localhost:3000/api/user/id
        - Payload: ```{
            "userId": "ID_TO_SEARCH",
            "tokenId": "YOUR_ID"
        }
```
        
### Get user data filtered by user name -> Can be accessed by users with role "users" and "admin"
----
```
- POST REQUEST: /api/user/userName
    - Headers: 
      Content-type: application/json
      Bearer: YOUR_TOKEN
    - Recieves on valid user name
    ```
    "message": "user successfully retrieved",
    "data": {
        "user": {
            "id": "SEARCHED_ID",
            "name": "SEARCHED_NAME",
            "email": "SEARCHED_EMAIL",
            "role": "SEARCHED_ROL"
        }
    }

    - Example Request:
        - http://localhost:3000/api/user/userName
        - Payload: {
            "userName": "NAME_TO_SEARCH",
            "tokenId": "YOUR_ID"
        }
```
### Get the list of policies linked to a user name -> Can be accessed by users with role "admin"
---
```
- POST REQUEST: /api/policy/userName
    - Headers: 
      Content-type: application/json
      Bearer: YOUR_TOKEN
    - Recieves on valid policy
    ```
    "message": "policies found",
    "data": [
        [
            {
                "id": "7b624ed3-00d5-4c1b-9ab8-c265067ef58b",
                "amountInsured": 399.89,
                "email": "inesblankenship@quotezart.com",
                "inceptionDate": "2015-07-06T06:55:49Z",
                "installmentPayment": true,
                "clientId": "a0ece5db-cd14-4f21-812f-966633e7be86"
            }
        ]
    ]

    - Example Request:
        - http://localhost:3000/api/policy/userName
        - Payload: {
            "userName": "NAME_TO_SEARCH",
            "tokenId": "YOUR_ID"
        }
```
### Get the user linked to a policy number -> Can be accessed by users with role "admin"
---
```
- POST REQUEST: /api/user/policy
    - Headers: 
      Content-type: application/json
      Bearer: YOUR_TOKEN
    - Recieves on valid policy
    ```
    "message": "user successfully retrieved",
    "data": {
        "user": {
            "id": "SEARCHED_ID",
            "name": "SEARCHED_NAME",
            "email": "SEARCHED_EMAIL",
            "role": "SEARCHED_ROL"
        }
    }

    - Example Request:
        - http://localhost:3000/api/user/policy
        - Payload: {
            "policyNumber": "POLICY_TO_SEARCH",
            "tokenId": "YOUR_ID"
        }
```

There is authification using jsonwebtoken where only the email is needed, as there is no data regarding
the password.

Tests have been done using Mocha Chai.

### **Running the application**

1. Open the folder pasiona-test in the console
2. Install npm modules
2. Start the application

```
$ npm i
```

```
$ node server.js
```

nodemon can also be used for development purposes

```
$ npm run nodemon
```

### Running tests
---

1. In the console:

```
$ npm run test
```


![](coverage-screenshot.png)

## Technical Description

The Api was done using Node.js and the Express framework. JSON web tokens were used for authentification.
Custom middlewares were used in order to handle access to the endpoints for certain roles.
Morgan and winston were used for logging, that logs everytime a user makes an api call to an endpoint and when 
a the user is started and abruptly shut down.

Only POST requests were used in the API for the following reasons: 
- If using GET, there's a bigger risk that your server logging tools will also log sensitive information by default.

- Also, in some scenarios, having sensitive information in the URL as query parameters (for example /data/something?secret_key=123321) will also be stored in the browser history, and this might be a risk if shared computers are common for your users. 

The JWT_SECRET has been kept in the .env file to be able to start and use the APP as quickly as possible.

As a guideline to review the API, I suggest first taking a look at the .env file, then the config file to review 
how they get exported.
Then I sugggest looking at the server.js file
Afterwards I suggest looking at the routes files then the logic files.
I believe this will give a general idea of how the arquitecture and the workflow works.





