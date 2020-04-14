# Travel App

## Table of Contents

* [Introduction](#introduction)
* [Commands](#commands)
* [Project Structure](#project-structure)
* [Testing](#testing)

## Introduction
There is a **debug flag** together with the debug output function in the file `./lib.debug.js` which can be used to get some more "telemtry" from the application. The functionality is generally available (client/server/test/...).

In the file `./lib.config.js` the following switches can be configured:
```
  enableDebugInfo = {true | false}
  useMock:  = {true | false} (a mock API will be used)
  serverName: HOSTNAME, e.g. 'localhost',
  serverPort: PORT, e.g. 8081,
```

To use the real API three API Keys needs to be specified in the file `.env` which is not part of the repository for security reasons:

```
GEONAMES_API_KEY=xzy
DARKSKY_API_KEY=aaaaaaaaaaaaaaa
PIXABAY_API_KEY=bbbbbbbbbbbbbbb
```

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
  - htmlRenderer.spec.js
  - validators.spec.js
  
src

+ client
  + images
    - clear-day.png
    - clear-night.png
    - cloudy.png
    - fog.png
    - no-weather-info.png
    - partly-cloudy-day.png
    - partly-cloudy-night.png
    - rain.png
    - README.txt (reference of the images)
    - sleet.png
    - snow.png
    - wind.png
  + js
    - clientMock.js
    - formHandler.js
  + styles
    - base.scss
    - colors.scss
    - footer.scss
    - form.scss
    - header.scss
    - layout.scss
    - photos.scss
    - resets.scss
    - styles.scss
  + views
    - index.html
    
+ lib
  - config.js
  - country.js
  - debug.js
  - htmlRenderer.js
  - mockAPIResultData.json
  - mockAPIResuls.js
  - mockCoordinatesData.json
  - mockPhotoData.json
  - mockWeatherData.json
  - weather.json
  
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
* **htmlRenderer**: Client-side tests
* **validators**: Validator tests

The test suites are below the folder `__tests__` and following naming conventions suffixed by `.spec.js`. 
