(function(){
  angular.module('toDoApp')
    // .controller('ToDoController', ToDoController);
    //
    // function ToDoController($scope, $http, $state, $timeout){
    //
    //   var self = this;
    //
    //   this.signup = function() {
    //     $http({
    //       method: 'POST',
    //       url: '/signup',
    //       data: {
    //         username: self.username,
    //         password: self.password
    //       }
    //     })
    //     .then(function(response) {
    //       //clear form
    //       self.signupusername = '';
    //       self.signuppassword = '';
    //       $state.go('home');
    //     })
    //     .catch(function(err) {
    //       // var resetMessage = function() {
    //       //   self.signuperror = '';
    //       // }
    //       // self.signuperror = err.data.message.message;
    //       console.error(err);
    //
    //       //clear the message after 3 seconds
    //       // $timeout(resetMessage,3000);
    //     });
    //   }; //end this.signup
    //
    //   this.login = function() {
    //     $http({
    //       method: 'POST',
    //       url: '/login',
    //       data: {
    //         username: self.username,
    //         password: self.password
    //       }
    //     })
    //     .then(function(response) {
    //       self.currentUser = response.data.username;
    //       return $http({
    //         method: 'GET',
    //         url: '/user/'+response.data.userId
    //       })
    //       .then(function(res){
    //         self.myToDos = res.data;
    //       })
    //       .then(function(){
    //         $state.go('user');
    //       })
    //     })
    //     .catch(function(err) {
    //       console.error(err);
    //     });
    //   }; //end this.login
    // } // end UserController function

    .controller('LoginController', function($scope, AuthService, /*$popup,*/ $state) {
      $scope.user = {
        name: '',
        password: ''
      };

      $scope.login = function() {
        AuthService.login($scope.user).then(function(msg) {
          $state.go('user');
        },
        function(errMsg) {
          var alertPopup = $popup.alert({
            title: 'Login failed!',
            template: errMsg
          });
        });
      };
    }) // end LoginController

    .controller('SignupController', function($scope, AuthService, /*$popup,*/ $state) {
      $scope.user = {
        name: '',
        password: ''
      };

      $scope.signup = function() {
        AuthService.register($scope.user).then(function(msg) {
          $state.go('login');
          var alertPopup = $popup.alert({
            title: 'Register success!',
            template: msg
          });
        },
        function(errMsg) {
          var alertPopup = $popup.alert({
            title: 'Register failed!',
            template: errMsg
          });
        });
      };
    }) // end SignupController

    .controller('UserController', function($scope, AuthService, /*API_ENDPOINT, $http,*/ $state) {
      $scope.destroySession = function() {
        AuthService.logout();
      };

      // $scope.getInfo = function() {
      //   $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      //     $scope.memberinfo = result.data.msg;
      //   });
      // };

      $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
      };
    }) // end UserController

    .controller('ToDoController', function($scope, $state, /*$popup,*/ AuthService, AUTH_EVENTS) {
      $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('login');
        // var alertPopup = $popup.alert({
        //   title: 'Session Lost!',
        //   template: 'Sorry, You have to login again.'
        // });
      });
    }); // end AppCtrl

})()
