// my app.js looks different than the file I got most of my auth from: http://devdactic.com/restful-api-user-authentication-2/

(function(){
  angular.module('toDoApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {



  // MainRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  // function MainRouter($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'home.html',
      controller: 'SignupController'
    })
    .state('login', {
      url: '/user',
      templateUrl: 'home.html',
      controller: 'LoginController'
    })
    .state('user', {
      url: '/user',
      templateUrl: 'user.html',
      controller: 'UserController'
    })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  })

    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
      $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
        if (!AuthService.isAuthenticated()) {
          console.log(next.name);
          if (next.name !== 'login' && next.name !== 'signup') {
            event.preventDefault();
            $state.go('login');
          }
        }
      });
    });


  // } // end MainRouter function
})();
