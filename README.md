# Authentication

The authentication service is built using Express.js and currently utilizes Firebase as its primary authentication source. However, it can also support other authentication providers by implementing the AuthProvider interface. The specific provider to be used will be determined by the value of the x-auth-provider header in the request.

---

### Prerequisites

- To run this project locally, you must have Node.js, npm, and Redis installed on your machine.

### Execution

This project is set up to use 'ts-node-dev', allowing for changes to take effect immediately without the need to restart the server.
Use the following command to start the application in development mode:

```
$ yarn dev
```

To run the app in production mode, use the following command:

```
$ yarn build && yarn start:prod
```

---

`POST /token `

```
curl --location --request POST 'http://localhost:3002/token' \
--header 'x-auth-provider: firebase' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userToken":"tokenValue"
}'
```

---

`POST /token/refresh `

```
curl --location --request POST 'http://localhost:3002/token/refresh' \
--header 'x-auth-provider: firebase' \
--header 'Authorization: Bearer authToken'
```

---

`GET /token/verify `

```
curl --location --request GET 'http://localhost:3002/token/verify' \
--header 'x-auth-provider: firebase' \
--header 'Authorization: Bearer authToken'
```

---

`GET /users/me `

```
curl --location --request GET 'http://localhost:3002/users/me' \
--header 'x-auth-provider: firebase' \
--header 'Authorization: Bearer authToken'
```

---

`GET /users/:id `

```
curl --location --request GET 'http://localhost:3002/users/<userId>' \
--header 'x-auth-provider: firebase' \
--header 'Authorization: Bearer authToken'
```
