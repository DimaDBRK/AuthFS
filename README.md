# Full Stack Developer Assignment
![Logo](other/Auth.jpg)

The application presents a diverse range of graphs derived from the data stored within the database. A robust authentication system is integrated to guarantee secure user entry to both data and functionalities. The Full Stack Fine Dashboard App exhibits data through dynamic charts and provides comprehensive user profile administration. The app's technology stack comprises:

- Frontend: React and Material UI
- Backend: Flask
- Database: PostgreSQL
- Authentication System: JWT-based


## Table of Contents

- [Full Stack Developer Assignment](#full-stack-developer-assignment)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Database](#database)
  - [Backend and API](#backend-and-api)
  - [Frontend](#frontend)
  - [Authentication](#authentication)
    - [User Roles and Permissions:](#user-roles-and-permissions)
  - [Future Scalability](#future-scalability)
  - [Installation](#installation)

## Description

App offers a streamlined approach to business intelligence, focusing on essential functionalities without the burden of costly licenses. While established BI systems like Tableau, Power BI or Fine BI provide extensive data analytics capabilities, they often come at a significant financial expense.

Many users find that their daily work only requires a handful of reports, typically around 5 to 10 views, along with standard filters and the ability to analyze data in detail using CSV downloads. Fine Dashboard caters to this specific need.

By prioritizing simplicity and efficiency, App empowers users with curated views and straightforward features, ensuring they can access the insights they need without unnecessary complexity.
![Description](other/Screen1.jpg)


## Database

ElephantSQL automates every part of setup and running of PostgreSQL clusters.
ref: backend\app\models.py
There are Tables:

User - includes user information
> class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(1000), nullable=False)

Organization - name and the user who initiated its creation.
> class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

OrganizationUser - Users who are affiliated with an organization. One User can belong to several organizations.
> class OrganizationUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

## Backend and API

Flask server.
List of API’s:
User
* post /users/register - register
* post users//users/login - logout
* pos users//logout - logout
* get users/users -  protected, all users
* get users/user/:user_id - get User Info By Id
* put users/users/user/:user_id -  protected, update User Info By Id
* post users/user/deleteprofile - protected, delete user profile

Tokens and Auth
* get /verify 

Organization management
* post wbapi/updatedb -  protected, refresh - update data from World Bank API
* get wbapi/data - get all data (flat table)
* get wbapi/datachart - get data for Chart in special format, for specific data code
* get wbapi/geography - get data in geography format;
* get wbapi/datapages - get data with server side pagination (Pages format);
* get wbapi/reports -  get reports info
* get wbapi/allusersreports - get al lusers reports, including all reports and info;
* post  wbapi/allusersreports -  protected, insert User Report (Add button)
* post  wbapi/deleteuserreport -  protected, delete User Report (Remove button);
* get wbapi/alluserreportsisdispaly/:user_id - all User Reportsis Display
* post  wbapi/cornjobdata - start/stop cron Job Data collection or clear table;
* get  wbapi/cornjobdata - live Data 

## Frontend

React frontend:
Material UI is employed to design and structure the application's pages.
Dark and Light themes

Data Visualization: 
Nivo (https://nivo.rocks/) and Recharts (https://recharts.org/) charting libraries have been utilized to achieve a refined and sophisticated appearance for the dashboard.

Filtering of data has been implemented both on the server and in the frontend.

The combination of MUI GridDataGrid and GridToolbar facilitates efficient management of server-side pagination and data export to files.


Users have the capability to save preferences and manage their profiles, encompassing actions such as updating their username, deleting their profile, as well as adding and removing reports (views).

Pages and main components.
![Dashboard](dashboard.jpg)
Side bar includes:
* Dashboard - cards of reports
* My reports - dynamically updated list of user reports
* Settings - Reports management (add and remove from My reports list) and Profile
* Developer settings - additional features

Nav bar:
* Button to open and close Side bar
* Dashboard button
* Switch themes button
* User Name and Role info
* Log out and Profile in additional menu

## Authentication
![Signin](other/Signin.jpg)
Token-based authentication employs two distinct tokens: the access token, stored in cookies with a short lifespan, and the refresh token, stored in both a dedicated database table and local storage, featuring a prolonged lifespan. A dedicated API facilitates token verification and updates upon the validation of the refresh token. JSON Web Token (JWT) serves as the foundation, utilizing JSON to craft access tokens, thereby enabling the utilization of application or API resources.

Furthermore, the implementation of Protected Routes within React Router ensures that authorized access is maintained.

### User Roles and Permissions:
The system delineates between two distinct user roles: User and Developer.
Developers are endowed with specialized access privileges, encompassing features such as Database management on the Developer page, access to a comprehensive users list, and the capability to delete refresh tokens.
On the other hand, users are allocated restricted access, limited solely to the exploration of reports.
This role-based structure ensures a controlled and secure user experience.


## Future Scalability

The application is designed with a modular structure, providing the potential for seamless integration of additional features and data sources in the future.

## Installation
1. .env file for server includes:
- PORT => by server side
- DB_HOST=...
- DB_PORT=...
- DB_USER=...
- DB_NAME=...
- DB_PASS=...
- ACCESS_TOKEN_SECRET=...
- ACCESS_TOKEN_EXPIRES_IN=60
- REFRESH_TOKEN_SECRET=...
- REFRESH_TOKEN_EXPIRES_IN=300


2. Clone the repository:

```bash
git clone REPO NAME
cd yourproject

2. Install the dependencies for the Node.js server:
cd server
npm install

Start the Node.js server:
npm start

3.Install the dependencies for the React frontend:
cd ../client
npm install

Start the React development server:
npm start

4. The Node.js server will run and the React development server will run on http://localhost:3000. You can access the application by opening your web browser and navigating to http://localhost:3000.


