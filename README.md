# assembly-planer-frontend
Welcome to the frontend application of our Assembly-Planning-Tool. It's written in React and helps you managing assembly events for different customers and assembler teams as well as managing employees and their permissions.

# Set up
## Start Backend
Make sure that the assembly-planer-backend application is already running. Set the path to your backend int the `BackendURL.js` and make sure no other applications are currently using the choosen port.

## Get project from Gitlab
Clone the repository from gitlab into your local repository: https://gitlab.hof-university.de/jwerner/planer-frontend

## Install dependecies and run application
Open a terminal and move into the root folder of your local repository. Then run `npm i` or `npm install`
After all dependecies are installed run `npm start` to start the frontend application.

If the application does not open in your browser automatically go to your browser and open http://localhost:3000. Pay attention to which port you are using (can be different to the default one (3000)).

# Log In
To access all features you first need to log in with the default admin user:
  username: admin
  password: admin

This in administrative account that allows you to create other users like managers or fitters.