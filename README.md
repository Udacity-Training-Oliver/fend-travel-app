# Travel App

## Table of Contents

* [Introduction](#introduction)
* [Commands](#commands)
* [Project Structure](#project-structure)
* [Testing](#testing)
* [Project History](#project-history)

## Introduction
The starter project has been taken as a template and was enhanced step by step, mainly the WebPack/JavaScript/Testing parts. This project was more complex than the others, primarily because of the required testing with Jest. 

A lot of code refactoring became necessary and not all scenarios have been tested as I would have prefered them to be tested. More details on this topic can be found in the chapter [Testing](#testing).

There is a **debug flag** together with the debug output function in the file `./lib.debug.js` which can be used to get some more "telemtry" from the application. The functionality is generally available (client/server/test/...).

As in all my projects I used ESLint for code validation. To get it up and running npm came into play to set up the necessary dependencies. That's the reason for the additional files and directories.

From the following standards
* AirBnB
* Google
* Standard

**Google** has been chosen as it comes closest to the *Udacity* JavaScript StyleGuide:
http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html

## Commands

The following commands for building and running tests are available

* npm run build-dev:  Build development version of the application and start it immedeately
* npm run build-prod: Build production version of the application  
* npm test: Run the tests 

## Project Structure

```
__tests__
  - endpoints.spec.js
  - formHandler.spec.js
  - validators.spec.js
  
src

+ client
  + js
    - clientMock.js
    - formHandler.js
  + styles
    - resets.scss
    - base.scss
    - footer.scss
    - form.scss
    - header.scss
  + views
    - index.html
    
+ lib
  - config.js
  - debug.js
  - mockAPIResuls.js
  
+ server
  - endpoints.js
  - server.js
  - validators.js
  
webpack.dev.js
webpack.prod.js
README.md
```

## Testing
After the installation of Jest as testing framework the following test suites have been created for the following modules (see project structure):

* **endpoints**: Backend endpoint tests
* **formHandler**: Client-side tests
* **validators**: Validator tests

The test suites are below the folder `__tests__` and following naming conventions suffixed by `.spec.js`. 
