(function(){
  angular.module('toDoApp', ['ui.router'])
    .config(MainRouter);

  MainRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function MainRouter($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'home.html'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'home.html'
    })
    .state('user', {
      url: '/user',
      templateUrl: 'user.html'
    });


    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

  } // end MainRouter function
})();
