# regMan [![Build Status](https://travis-ci.com/AlexKMarshall/regMan.svg?branch=master)](https://travis-ci.com/AlexKMarshall/regMan) [![codecov](https://codecov.io/gh/AlexKMarshall/regMan/branch/master/graph/badge.svg)](https://codecov.io/gh/AlexKMarshall/regMan)

CRM to manage registrations to summer camps

## Setup

2 separate installations are required: one for the backend and one for the frontend.

### Backend

Install Postgres and have it running in the default port.
Go to the `/server` and run:

- `npm i`
- `npm run dbcreate` -> creates the DB in Postgres
- `npm run dbinit` -> creates the tables inside the created DB
- `npm run dbseed` -> seeds initial Data into the tables

### Frontend

Go to the client and run `npm i`.

After this, run `npm start` in both the client and the server. The client uses CRACO to handle internal paths for the components. If you don't start the project with npm start, it won't work.
In each folder you'll find a copy of the .env file with some mock data.

In the .env.copy of the server, you'll find the JWT details for the auth0. Since they're for a mock program, feel free to use them. It might make things easier for you :)

Same with the .env file of the client.

Thanks for picking up this project!! I'm really happy ^\_^

## Code coverage

![Code coverage](https://codecov.io/gh/AlexKMarshall/regMan/graphs/sunburst.svg)
