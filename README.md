# regMan
CRM to manage registrations to summer camps

2 separate installations are requiered: one for the backend and one for the frontend.
Go to the server and run `npm i`.
Go to the client and run `npm i`.

Install Postgres and have it running in the default port.
Sequelize will initiate a db called 'crisoltest_db'. Feel free to change it at your convenience.

After this, run `npm start` in both the client and the server. The client uses CRACO to handle internal paths for the components. If you don't start the project with npm start, it won't work.
In each folder you'll find a copy of the .env file with some mock data.

In the .env.copy of the server, you'll find the JWT details for the auth0. Since they're for a mock program, feel free to use them. It might make things easier for you :)

Same with the .env file of the client.

Thanks for picking up this project!! I'm really happy ^_^