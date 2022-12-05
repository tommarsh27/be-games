# Board Game Reviews API

Welcome to Tom Marsh's Board Games API.

# Hosted Project

The hosted project can be found at https://games-tm.cyclic.app

# The Project

The project is an API which allows a user to interact with a database through their browser. The API accesses application data programmatically, with the intention of mimicking real-world back end services (i.e. Reddit) which provide information to front end architecture.

The project interacts with a PSQL database using node-postgres.

The database itself is populated with four tables. These contain information about board games, board game reviews, users who own those board games, and comments on the board game reviews. The four tables relate to each other in such a way that a request may be made which requests combined information from each table and returns aggregate data.

The endpoints.json file details the various endpoints contained within the project. It contains examples of what a request made to each endpoint might return.

The project aims to demonstrate my understanding of application programming interfaces and my ability to write and test code effectively. The project contains comprehensive error-handling in order to make the API as functional and user-friendly as possible.

# Setting up the API

If you would like to use this API, you can git clone it. To do this, navigate to https://github.com/tommarsh27/be-games. Once there, click the Code drop down button, and copy the displayed https link or click "Open with GitHub Desktop" if you are a desktop app user. If you have copied the link, navigate to your desired directory within your terminal, and enter 'git clone https://github.com/tommarsh27/be-games'. You should then be able to open the repo in VS Code or your code editing software of choice.

Once open, run npm install to install project dependencies locally. This will install the following dependencies necessary for the repo to function:

dotenv
express
jest-extended
pg
pg-format
supertest

To use the database in this repo you will need to create 2 dotenv files in the main directory - 
one called .env.development and the other called .env.test

.env.development should contain one line - PGDATABASE=nc_games
.env.test should contain - PGDATABASE=nc_games_test

These are the environment variables for the development and test databases.

Without them the connection.js file will not be able to connect to either database.

Next you will need to seed your local database. This can be done by running the command 'npm run setup-dbs' and then 'npm run seed'. To run the test files, you can either run the command 'npm t' or choose to run specific test files by copying the relative path from the files in the tests folder and then running 'npm t <<file_name>>'.

# Minimum Requirements

The following versions of node.js and postgres are needed:

node: v16.16.0 postgres: v14.5
