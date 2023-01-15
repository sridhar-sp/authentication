# Authentication

The authentication service is built using Express.js and currently utilizes Firebase as its primary authentication source. However, it can also support other authentication providers by implementing the AuthProvider interface. The specific provider to be used will be determined by the value of the x-auth-provider header in the request.

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
