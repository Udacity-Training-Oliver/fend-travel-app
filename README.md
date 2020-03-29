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
* **testTheJest**: Getting Jest up and running (no serious tests)
* **validators**: Validator tests

The test suites are below the folder `__tests__` and following naming conventions suffixed by `.spec.js`. There are two issues I'd like to point out.

First, for testability I tried to extract the server functionality into seperate modules. For the API-module `endpoints.js` I wasn't able to do this for the Alyien-API as it seems that it isn't compatible with JavaScript promises. I asked my mentor and after expoloring my problem he asked the Udacity-team with the above mentioned result. I commented the part out in `endpoints.js` and attached the conversation with my mentor for documentation. 

**This issue may cost me an additional month. I would have prefered if the team had tested the promise-compatibility before chosing it for the students. Beside that I'd like to laud my mentor Veselin who always tried to support me but in this case even he (and also the team) couldn't help.**

Second, as I wasn't able to get the server endpoint mockable, I needed to do some additional mocking on the client side. Some mock-coding became necessary in the productive code of `formHandler.js` like in the following code fragment:

```javascript
let mockResult = '';
await callAnalyzeText(`http://localhost:8081/analyzeText/?url=${urlToAnalyze}`, useMock)
    // Process response from service (or mock, if applicable)
    .then((res) => {
      if (!res.ok) {
        debug(res);
        const errorMessage = createErrorMessage(res);
        throw errorMessage;
      }
      return useMock ? res : res.json();
    })
    // Prepare HTML to show as response
    .then((res) => {
      debug(`returned from server: ${JSON.stringify(res)}`);
      if (useMock) {
        mockResult = res;
      } else {
        document.getElementById('results').innerHTML = getResponseHtml(res);
      }
    })
    // Error handling in case that something went wrong
    .catch((err) => {
      if (useMock) {
        mockResult = err;
      } else {
        document.getElementById('results').innerHTML = getErrorHtml(err);
      }
    });
if (useMock) {
  return mockResult;
}
```

I don't consider this kind of code with `if (useMock) {...}` as best practice but after having some serious issues with some forth/back-refactorings as described before I decided to be pragmatic in the cource of this exercise.

Any advice how to to this better is highly appreciated.

