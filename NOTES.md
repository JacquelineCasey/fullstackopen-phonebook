
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
- 3.12: Set up a MongoDB database, and write a utility file `mongo.js` that can be
    used in the following ways:
    - `npm mongo.js <PASSWORD> "full name" 123-233-4444` to add an entry
    - `npm mongo.js <PASSWORD>` to list entries.
- 3.13: Change fetching of phonebook entries so that data is fetched from the database.
  - Verify that the frontend and backend still work.

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

- We want users to access the `phonebook-frontend/build/index.html` when they 
- navigate to `/` of the heroku link / localhost:3001 (the backend).
  - Use express's static serving: `app.use(express.static('phonebook-frontend/build'))`.
- We need to setup a build script. (`npm run build`)
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
- Switch that `build:ui` script to `build` so that Heroku detects and runs it at
  build time. (https://devcenter.heroku.com/articles/nodejs-support)
- Add a 'cacheDirectories' array to make the process faster
  (see: https://github.com/mars/heroku-cra-node/blob/master/package.json)

For reference, a successful run of building the thing on Heroku can be found
in `SupplementalNotes/successfulHerokuRun.txt`.

I am considering the use of `npm ci` to replace `npm install`. (ci = clean install)
https://docs.npmjs.com/cli/v7/commands/npm-ci
- The main thing is that `package-lock.json` has to be up to data.
- CI was almost twice as slow, as it clean installs (does not use cache)
  - It might be good if slug size gets large and we want to remove the cache.

## Debugging

In VSCode, you can go to any of the `package.json` files, and find the debug
button that floats above the `scripts` array. Debugging a script allows you to
debug any of the files that it ends up running, so this is a decent way to debug
the express app. You can also hover over the individual script
names to either run or debug them.

Unfortunately, I have still not resolved the breakpoint issue for the React app. 
In fact, this time, no breakpoints were set at all.

## process.argv

`process.argv` is an array that contains the arguments associated with the process.
The name of the program is the first (index 0) argument, so for `node mongo.js <password>`:
- `process.argv[0] = node (expanded, technically)`
- `process.argv[1] = mongo.js (expanded, technically)`
- `process.argv[2] = <password>`
- `process.argv.length = 3`
