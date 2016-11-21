// from http://devdactic.com/restful-api-user-authentication-2/

angular.module('toDoApp')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {
  url: 'http://127.0.0.1:8100/api'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
});
