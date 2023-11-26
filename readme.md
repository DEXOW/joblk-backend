# JobLK Backend
## About
This repository contains the backend code for the JobLK job application platform.

## Technologies
This project is built using the following technologies:

- Node.js
- Express.js
- MySQL

## Development
Prerequisites:

- Node.js 19 or later

### Installation:

1. Clone the repository:
``` 
git clone https://github.com/DEXOW/joblk-backend.git 
```
2. Install dependencies:
```
cd joblk-backend
npm install
```
3. Create a copy of the `.env.example` file and rename it to `.env`:
```
cp .env.example .env
```
4. Configure the ```AUTH_TOKEN``` and ```SESSION_TOKEN``` with a random string:
```
AUTH_TOKEN=''
SESSION_TOKEN_KEY=''
```
- Optionally if you want to use rollbar insert your rollbar project id in the .env file:
```
ROLLBAR_TOKEN=''
```
5. Configure your database connection in the .env file:
```
DB_HOST='HOSTNAME'
DB_PORT=PORT
DB_USERNAME='USERNAME'
DB_PASSWORD='PASSWORD'
DB_NAME='DATABASE_NAME'
```
6. Start the server:
```
npm start
```
- Or to start the development server with nodemon:
```
npm install nodemon
npm run dev
```

## Deployment
To deploy the application to a production environment, you will need to set up a MySQL database and a web server. You can then configure the application to connect to the database and use the web server to serve the application's static files.

## API Endpoints
> Headers 
- auth_token: Provide the valid auth token for authenticated requests

### <b>POST</b> /auth/register  
Request Body : 
```shell
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "password123"
}
```
Response Body :
```shell
{ 
  code: "SUCCESS", 
  message: 'User registered successfully' 
}
```

### <b>POST</b> /auth/login  
Request Body : 
```shell
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```
- Or
```shell
{
  "username": "JohnDoe",
  "password": "password123"
}
```
Response Body :
```shell
{ 
  code: "SUCCESS", 
  message: 'Logged in successfully' 
}
```

### <b>POST</b> /auth/logout  
Request Body : 
```shell
No request body
```
Response Body :
```shell
{ 
  code: "SUCCESS", 
  message: 'Logged out successfully' 
}
```