# Event Seat Reservation

REST API service for online reservation system using NodeJs, Redis and Docker.

The main goal is to create a service that supports a busy online reservation system using NodeJs, Redis and Docker.

We should be able to;

- Create event
- See seats availbale for event
- Hold a seat
- Reserve a seat

Bonus

- Limit seats held by user
- Refresh held seat

## Requirements

Docker must be installed [docker](https://www.docker.com/) to run the API.

## Getting Started

To start the service run:

```bash
docker-compose up -d
```

## API Specifications

### Create event

```http
POST /api/events
```

#### Request

| Parameter    | Type     | Description                                                  |
| :----------- | :------- | :----------------------------------------------------------- |
| `totalSeats` | `number` | **Required**. Number of seats between 10 and 1000 (included) |

#### Response

```javascript
{
  "eventId" : uuid,
  "seats" : number,
}
```

### Get event seats

```http
GET /api/events/:eventId/seats
```

#### Request

| Parameter | Type   | Description            |
| :-------- | :----- | :--------------------- |
| `eventId` | `uuid` | **Required**. Event ID |

#### Response

```javascript
["seatId"];
```

### Hold event seat

```http
POST /api/reservations/event/:eventId/hold
```

#### Request

| Parameter | Type     | Description            |
| :-------- | :------- | :--------------------- |
| `eventId` | `uuid`   | **Required**. Event ID |
| `seatId`  | `string` | **Required**. Seat ID  |
| `userId`  | `uuid`   | **Required**. User ID  |

#### Response

```javascript
{
    'message': 'Seat held'
}
```

### Reserve event seat

```http
POST /api/reservations/event/:eventId/reserve
```

#### Request

| Parameter | Type     | Description            |
| :-------- | :------- | :--------------------- |
| `eventId` | `uuid`   | **Required**. Event ID |
| `seatId`  | `string` | **Required**. Seat ID  |
| `userId`  | `uuid`   | **Required**. User ID  |

#### Response

```javascript
{
    'message': 'Seat reserved'
}
```

### Refresh event seat

```http
POST /api/reservations/event/:eventId/refresh
```

#### Request

| Parameter | Type     | Description            |
| :-------- | :------- | :--------------------- |
| `eventId` | `uuid`   | **Required**. Event ID |
| `seatId`  | `string` | **Required**. Seat ID  |
| `userId`  | `uuid`   | **Required**. User ID  |

#### Response

```javascript
{
    'message': 'Seat held'
}
```

## Status Codes

Returns the following status codes in its API:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 500         | `INTERNAL SERVER ERROR` |

## TODO

- Move nested redis requests to functions
- Create a .env file

## License

[MIT](https://choosealicense.com/licenses/mit/)
