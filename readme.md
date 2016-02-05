## Food Server

> API for keeping track of our favorite lunch places. Need to add calendar so we can schedule potlucks and stuff!

* Currently running on: (no deployment yet)

Routes in the User Registration section are authenticated
by Username/Password unless otherwise mentioned.

Routes elsewhere in the app other than GET requests are authenticated by passing
an 'X-Access-Token' header along with the request.

### User Registration & Auth

#### Creating a User

**Route:** `POST api/users`

**Params:**

| Parameter |  Type  |
| --------- |  ----  |
|  Password | String |
|  Name     | String |
|  Username | String |
|  Email    | String |

Note that usernames must be unique

Example success (Code 201 - Created):

```json
{
  "message": "User Created!"
}
```
Example Failure (Code 422 - Unprocessable Entity):

```json
{
  "message": "A user with that username already exists."
}
```

#### Logging In with an Existing User

**Route:** `POST admin/users/login`

**Params:**

| Parameter | Type   |
| --------- | ------ |
| Username  | String |
| Password  | String |

Example Success (Code 200 - OK)

```json
{
  "success": true,
  "message": "Enjoy your token!",
  "token"  : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibmF0ZSIsInVzZXJuYW1lIjoibmF0ZSIsImlhdCI6MTQ0NDg1MTcxNSwiZXhwIjoxNDQ0OTM4MTE1fQ.9kOJEZb_f7HZ8RgmqbPwhDXALx2TDR1fH5lzPtlGzcA"
}
```

Example Failure (Code 401 - Unauthorized)

```json
{
  "message": "Authentication failed. Wrong password."
}
```
Or

```json
{
  "message": "Authentication failed. User not found."
}
```
#####Getting a Single User

**Route:** `GET api/users/:user_id`

####Editing an Existing User

**Route:** `PUT api/users/:user_id`

**Params:**

| Parameter |  Type  |
| --------- |  ----  |
|  Password | String |
|  Name     | String |
|  Username | String |

Example Success (Code 200 -OK):

```json
{
  "message" : "User updated"
}
```

####Deleting an Existing User

**Route:** `DELETE api/users/:user_id`

**Params:** None.

Example Success (Code 200 -OK):

```json
{
  "message" : "Succesfully Deleted"
}
```


### Restaurants

### Getting All Restaurants

**Route** `GET restaurants`

#### Creating Restaurants

**Route:** `POST restaurants`

**Params:**

| Parameter    |  Type  |
| ---------    |  ----  |
|  Name        | String |
|  Description | String |
|  Type        | String |
|  Image       | String |
|  City        | String |
|  State       | String |


Note that names must be unique

Example success (Code 201 - Created):

```json
{
  "message": "Member Created!"
}
```
Example Failure (Code 422 - Unprocessable Entity):

```json
{
  "message": "A restaurant with that name already exists."
}
```
#####Getting a Single Restaurant

**Route:** `GET api/restaurants/:restaurant_id`

####Editing an Existing Restaurant

**Route:** `PUT api/restaurants/:restaurant_id`

**Params:** Same as creation

Example Success (Code 200 -OK):

```json
{
  "message" : "Member updated"
}
```

####Deleting an Existing restaurant

**Route:** `DELETE api/restaurants/:restaurant_id`

**Params:** None.

Example Success (Code 200 -OK):

```json
{
  "message" : "Succesfully Deleted"
}
```
