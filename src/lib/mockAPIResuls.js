const mockAPIResults = {
  validAndExistingUrl: {
    'ok': true,
    'title': 'test json response',
    'message': 'this is a message',
    'time': 'now',
    'polarity': 'positive',
    'polarity_confidence': 0.67,
    'subjectivity': 'objective',
    'subjectivity_confidence': 0.67,
    'text': 'of course some text needs to be here',
  },
  validButNotExistingUrl: {
    'ok': false,
    'status': 404,
    'statusText': 'Not Found',
  },
  invalidUrl: {
    'ok': false,
    'status': 406,
    'statusText': 'Not Acceptable',
  },
  internalServerError: {
    'ok': false,
    'status': 500,
    'statusText': 'Internal Server Error',
  },
  geonamesSuccess: {
    'postalCodes': [
      {
        'adminCode2': '00',
        'adminCode3': '01056',
        'adminName3': 'Kreis Pinneberg',
        'adminCode1': 'SH',
        'lng': 9.80085833333333,
        'countryCode': 'DE',
        'postalCode': '25421',
        'adminName1': 'Schleswig-Holstein',
        'ISO3166-2': 'SH',
        'placeName': 'Pinneberg',
        'lat': 53.6591083333333,
      },
    ],
  },
};

module.exports = mockAPIResults;
