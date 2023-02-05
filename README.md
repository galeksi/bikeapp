# SolitaDev BIKEAPP 2023

Application for public bikes in Helsinki

## Description:

Web-application with Node.js Backend, React.js frontend and MongoDB database. Backend server Express and Apollo for GraphQL API.
The application displays:

- Public bike stations in the Helsinki metropolitan area on the map and in a list view
- The station list can be searched and details to single stations with map location and statistics can be viewed
- Public bike trips for May-July in a list view wit details
- Trips can be filtered by departure station, return station and date
  The application backend has a REST API endpoint to uplad, validate and save datasets for stsations and trips with csv files.
  All other queries are done through GraphQL.

## Prerequisites:

Application is written with Node verion v18.10.0. Same or later version should be installed.

Frontend in sepparate repository: https://github.com/galeksi/bikeapp-frontend

Variables in .env files:

- Backend: MONGODB_URI & PORT
- Frontend: REACT_APP_MAPS_API_KEY

## Configurations:

Public production version: https://bikeapp-aleksirendel.fly.dev/

To run locally:

- git clone backend
- npm update to install all dependencies (alternatively yarn upgarde)
- add and configure .env file locally
- npm run dev for backend -> Starts the application with priduction build frontend

Of course one can also clone the frontend, npm update and npm start (Backend should be running)

## Tests:

Unittests:

Backend has tests for datauploads and validations in folder 'tests'. The tests rely on csv files in the subfolder 'csv'.

-> Run tests with command 'npm test -- tests/dataupload_api.test.js'

E2E tests:

Frontend uses cypress for E2E tests. To use cypress the frontend and backend have to both run separately. Tests are in cypress/e2e/bikeapp.cy.js.

-> Run tests with command 'npm run cypress:open'

IMPORTANT: Running Linux on Windows Subsystem (WSL2) might need some further setup to open cypress. More info here: https://nickymeuleman.netlify.app/blog/gui-on-wsl2-cypress

## Technology choices:

Backend:

- nodemon: Reserts dev server after changes automatically
- apollo-server: Common server option for GrqphQL
- body-parser: Parses json request bodys
- cors: To enable cross-origin sharing with frontend and backend in sepparate repos
- dataloader: To solve 1+N problem and minimize requests to database
- dotenv: Access .env variables
- express: Backend server
- fast-csv: For parsing uploaded csv datasets
- graphql: API alternative to REST
- graphql-tag: To define gql TypeDefs
- lodash: Nice toolset for arrays and collections
- mongoose: For DB queries and Database schemas
- multer: To upload csv file locally
- moment: To validate dates
- is-valid-coordinates: To validate coordinates

Frontend:

- React: Obvious choice with Node Backend
- Apollo client: Tho query Apollo server
- Tailwind css: Nice and more flexible alternative to Bootstrap or MaterialUI
- Cypress: For E2E Testing
- Google maps api: To show stations and details on map
- Several packages for filtering and viewing: react-datepicker, react-paginate, react-select

## ToDo

Unfortunately testing ist not complete. The dataupload API and the GraphQL API should be tested in addition to E2E tests. Due to problems with supertest and running the needed serverobject the tests are not written yet.
The testfile dataupload_api.test.js exists already but the initial test fails.
