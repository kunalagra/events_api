# Events REST API 
  

## Tech Stack

- Server: NodeJS - Currently learning
- Database: MongoDB - Inbuilt support for B-Tree Indexes (used for dates), and Support for GeoData (GeoJSON) with Indexing support too. 


## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/kunalagra/events_api

# Go into the repository
$ cd events_api

# Rename .env.example to .env
$ mv .env.example .env

# Install dependencies
$ npm install

# Run the app in dev
$ npm run dev
```
> [!IMPORTANT]  
> Populate your .env keys with their respective values. 

> [!NOTE]
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.




## API Documentation

### Get Events

Retrieve a list of events based on provided latitude, longitude, date, and pagination parameters.

- **URL**: `/api/events/find`
- **Method**: `GET`

#### Request Parameters

| Parameter  | Type   | Description                                         |
|------------|--------|-----------------------------------------------------|
| latitude   | Float  | Latitude coordinate of the location                 |
| longitude  | Float  | Longitude coordinate of the location                |
| date       | String | Date in the format YYYY-MM-DD to filter events      |
| page       | Integer| Optional. Page number for pagination (default: 1)   |

#### Response

```json
{
  "events": [
    {
      "event_name": "Event Name",
      "city_name": "City Name",
      "date": "YYYY-MM-DD",
      "weather": "Weather Data",
      "distance_km": 10.5
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalEvents": 100,
  "totalPages": 10
}
```

#### Error Responses

- **400 Bad Request**: If `latitude`, `longitude`, or `date` parameters are missing or invalid.
- **500 Internal Server Error**: If an internal server error occurs.

### Create Events

Create new events by providing event data either in JSON or CSV format.

- **URL**: `/api/events/create`
- **Method**: `POST`

#### Request Body (JSON)

```json
[
  {
    "event_name": "Event Name",
    "city_name": "City Name",
    "date": "YYYY-MM-DD",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
]
```

#### Request Body (CSV)

A CSV file containing columns: `event_name`, `city_name`, `date`, `latitude`, `longitude`.

#### Response

```json
{
  "message": "Inserted Events into DB!"
}
```

#### Error Responses

- **400 Bad Request**: If the request body is missing or invalid.
- **500 Internal Server Error**: If an internal server error occurs.