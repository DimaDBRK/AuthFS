# Full Stack Developer Assignment
![Logo](other/Auth.jpg)

This application aims to augment a basic authentication system with advanced features that allow users to create organizations and invite other registered users to join these organizations. 

The app's technology stack comprises:
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
  - [Tests](#tests)
  - [Future Scalability](#future-scalability)
  - [Installation](#installation)

## Description

App prioritizes user experience by providing clear feedback messages and efficient frontend routing through React-Router.

By enhancing the authentication system with these features, the app aims to provide a secure and user-friendly environment for creating and managing organizations, fostering collaboration and efficient user interaction.
![Description](other/Screen1.jpg)


## Database

PostgreSQL.
Models ref: backend\app\models.py
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
    author_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET DEFAULT'), nullable=True)

OrganizationUser - Users who are affiliated with an organization. One User can belong to several organizations.
> class OrganizationUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

Commands:
flask db init
flask db migrate -m "Users table"
flask db upgrade

## Backend and API

Flask server.
Models ref: backend\app\routes.py
List of API’s:
User
* post /signup - register
* post /signin - login
* get /users -  all users info
* post /users/delete-user - delete user (by email)
* get /users/user/<string:email> - get User Info (by email)
* put /users/user/update -  protected, update User Info (by email)


Tokens and Auth
* get /verify - PROTECTED route to check token for Auth component in React

Organization management
* post /create-org - create new organization
* deleted /delete-org - delete organization (by name)
* get /organizations - all organizations info
* post /get-org-by-author - PROTECTED, only organizations info created by user = author
* post /add-users-to-org - add user to organization (and check if this user don't belong to this organization)
* post /delete-user-from-org - delete user from organization (by email and organization name)
* get /get-users-by-org - get users = emails for this organization


## Frontend

React frontend:
Material UI is employed to design and structure the application's pages.
Dark and Light themes enhance user experience.


Users have the capability to save preferences and manage their profiles, encompassing actions such as updating their email, deleting their profile, as well as adding new Organizations.

![Organization](other/Organizationmanagement.jpg)
On the Settings page, admins have organization management capabilities, allowing them to create and delete organizations, as well as include and remove users from them.

Pages and main components.

![Organization](other/Nav.jpg)
Nav bar:
* User 
* Settings 
* Switch themes button
* User Email and Avatar
* Log out and User Profile in additional menu

## Authentication
![Signin](other/Signin.jpg)
Token-based authentication employs access token, stored in Frontend app memory and the same token in  stored cookies for future Auth system scalability. Life time of token could be changed in config.py (JWT_ACCESS_TOKEN_EXPIRES). By default = 5 min. 
A dedicated API facilitates token verification and updates token in every request. JSON Web Token (JWT) serves as the foundation, utilizing JSON to craft access tokens, thereby enabling the utilization of application or API resources.

Furthermore, the implementation of Protected Routes within React Router ensures that authorized access is maintained.
Protected Route is - /settings.

On server side - /get-org-by-author, it could be tested by visiting User page.

In Profile it is possible to test Aut system - check token, delete token and get new one with redirection to sign in page and back.

![Profile](other/Profile.jpg)

On Logout token deleted.

User Roles and Permissions:
The system has only one User role.

## Tests

The tests encompass both backend and frontend automation test cases, implemented using Pytest. For the frontend, Selenium WebDriver is utilized.

Ref: backed/tests

>API
- 19 tests 

>Frontend
- 2 tests

How to start:
1. in python virtual inv go cd dir to tests folder.
2. run command: (py -m) pytest -v -s --html=report.html test_api.py
3. Report will be in file: report.html (to open in browser)
   
![Report](other/Report.jpg)

## Future Scalability

The application is designed with a modular structure, providing the potential for seamless integration of additional features and data sources in the future.

## Installation
Pay attention: 
Backend
  
config.py - includes parameters
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
  JWT_SECRET_KEY = os.environ.get('SECRET_KEY')
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)  # token lifetime
  SQLALCHEMY_TRACK_MODIFICATIONS = False

Create .env file with parameters:
DATABASE_URL= example:  postgresql://username:password@localhost:5432/mydatabase
SECRET_KEY= here your key

Frontend:
For correct cookies and requests Proxy set:
in package.json:
"proxy": "http://127.0.0.1:5000",

If there is problem on MacOS:
Mac OSX Monterey (12.x) and later currently uses ports 5000 and 7000 for its Control centre hence the issue.
Try running your app from port other than 5000 and 7000
Change port on Flask server:
if __name__ == "__main__":
    app.run(port=8000, debug=True)

1. Clone the repository:

```bash
git clone REPO NAME
cd yourproject

2. Install Backend Flask server:
Install Python: Flask is a Python framework, so you need to have Python installed. You can download Python from the official website: https://www.python.org/downloads/

Create a Virtual Environment (Optional): It's recommended to create a virtual environment to isolate your project dependencies. You can do this using the venv module that comes with Python. Open your terminal and run: python -m venv venv

Activate the virtual environment:
On Windows: venv\Scripts\activate
On macOS and Linux: source venv/bin/activate

Run the Flask application - app.py

3.Install the dependencies for the React frontend:
cd ./frontend
npm install

Start the React development server:
npm start

4. The Flask server will run on http://localhost:5000 and the React development server will run on http://localhost:3000. You can access the application by opening your web browser and navigating to http://localhost:3000.


