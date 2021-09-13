
# Phonebook Backend

This project is associated with https://fullstackopen.com/en/part3/node_js_and_express#exercises-3-1-3-6.
It is the backend of the phonebook project developed in Part 2.

This project is involved in the following exercises:
- 3.1: Implement a backend that returns a hardcoded list of entries. (/api/persons)
- 3.2: Implement a /info page. It does not seem to be part of the api.
- 3.3: Implement functionality for sending a single person. (/api/persons/2)
- 3.4: Handle DELETE requests (/api/persons/2). 
  - The state of the backend resets on launch. That is fine.
- 3.5: Handle POST requests (/api/persons). Use a random number to generate ids.
- 3.6: Add error handling to POST requests.
- 3.7: Add the morgan middleware for logging.
- 3.8: Get the logger to show data received in POST requests.
- 3.9: Make the backend and the frontend work together. They have been combined 
    into one repository. We need not add functionality for updating entries yet.
- 3.10: Deploy the backend to Heroku.
- 3.11: Deploy the frontend to Heroku. Make sure both production and development
    work.
  - PS: Both 3000 and 3001 work now. Only 3001 can serve api resources, however.

## For curious minds: Middleware that executes after the route

https://stackoverflow.com/questions/24258782/node-express-4-middleware-after-routes

## Killing port 3001

I had to do this once: 
https://stackoverflow.com/questions/4075287/node-express-eaddrinuse-address-already-in-use-kill-server
`lsof -i :3000`
`kill -9 {PID}`

## Getting frontend and backend to play together

- Add cors to frontend middleware.
- Make sure the frontend is targetting the right backend url (`api/persons`).
  - Use the proxy trick (package.json), so that we can use a relative url that 
    works for development and production on Heroku.

## Deploying to Heroku

- We want users to access the `build/index.html` when they navigate to `/` of the
  heroku link / localhost:3001 (the backend).
  - Use express's static serving: `app.use(express.static('build'))`.
- We need to setup a build script. (`npm run build:ui`)
  - I am forgoing adding `deploy` scripts, they seem kinda unnecessary since I 
    automatically deploy on push to `origin/main`. If you don't want to deploy, 
    push to another branch!
- Add a `Procfile`.
- Make sure we run on `process.env.PORT`, that is where Heroku wants us to run.
PS: You can view the heroku logs online via the `More` button.

Edit: I am making it so that heroku builds the ui itself before starting. We no
longer send any build folders. We may use build ourselves if we really want to
use the production version of the web app, but otherwise, we launch the frontend
through webpack.

I am trying to use `cacheDirectories` in package.json.
