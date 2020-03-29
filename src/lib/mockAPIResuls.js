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
};

module.exports = mockAPIResults;
