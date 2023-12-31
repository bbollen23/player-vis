# General Overview

This visualization uses a Flask API as a back-end and a React + D3.js front-end (with no React.js framework). If this was to be put into production, the user can build the react application and then access the front end by using the default path ("/") for the API (e.g. http://localhost:5000/)

# Application Setup
To start, we'll need to install the proper npm and python packages. This was developed using the following base versions:

-- npm version 8.12.1
-- pip version 20.0.2
-- python3 version 3.8.10
-- Node version 18.4.0

Any version above these is expected to work properly. 

If you'd like to, you can use a python3 virtual environment to ensure that no pip packages you install will interfere with your existing pip packages. To do this, you can simply use the following:

```
python3 -m venv .venv
. .venv/bin/activate  
```

Now, install the necessary python3 packages using the following:

```pip install -r ./api/requirements.txt```

Use `pip3` if that is your respective pip command for Python3.

After this, you can install the necessary npm packages. First, move to the `client` directory where the React application is located.

```
cd client
npm install
```

Once that is finished, we can now run the application

# Run the Application
There are two ways to run the application. The first is to build the React application and then only use the Flask Application as our entry point. The second is to start both applications separately.

## Running the application only using Flask

_A quick note on Flask Port Selection_: In the client folder, there is a file called `.env`. The only variable in this environment file is the base URL for all API requests. If you decide to _not_ use the standard port 5000 for the Flask application, you _must_ change this variable to use the correct port. This also must be done before starting the React application or before building it. There is no error handling in this application for not being able to connect to the API as it is meant to be a simple application. In production, a more robust error handling system would be normally introduced.

Move to the client directory and build the React application. From the last step, you may already be in the client directory. Once there, call the following:

```
npm run build
```

This will build the React application and output a `build` folder inside the `client` directory. This contains an `index.html` file which will be referenced in our Flask Application as the entry point. There is no routing in this single page web application, so the `index.html` file is the only static file that will be served.

Move into the `api` directory and start the Flask server.

```
cd ../api
flask --app app run
```
By default, this will serve the application on port 5000. You can adjust this accordingly using the `port` argument. For example, running on port "3001" would require the command `flask --app app run --port=3002`. Make sure to adjust the client `.env` file accordingly if the port is changed.

You can now access the application by using "http://localhost:5000/" fully in your Web browser (adjust the port as necessary).

## Running the application using Flask and React

When developing, it may be easier to start the application separately so that you do not have to 're-build' the React application anytime a change is made. 

Move into the api directory and start the Flask application. This is assuming you are currently in the root directory of the repository

```
cd api
flask --app app run
```
Now that the Flask server is running (with a default port of 5000), move into the client directory and start the React application.
```
cd ../client
npm start
```

Now your React applicaiton is running on port 3000. To access the application, you can visit "http://localhost:3000".




