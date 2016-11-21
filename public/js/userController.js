(function(){
  angular.module('toDoApp')
    .controller('UserController', UserController);

    function UserController($scope, $http, $state, $timeout){

      var self = this;

      this.currentUser = null;
      // this.editedTrip = {};
      this.showEditForm = false;
      this.password = '';
      this.signupUsername = null;
      this.signupPassword = null;
      this.signuperror = null;
      // this.myTrips = [];
      // this.searchedForTrips = [];
      this.searchText = '';
      this.username = '';

      // this.newTrip = {
      //   dateStart: null,
      //   dateEnd: null,
      //   description: null,
      //   foo: null,
      //   place: null,
      //   tripId: null
      // };

      // this.addTrip = function() {
      //   $http({
      //     method: 'POST',
      //     url: '/private/'+self.currentUser,
      //     data: { data: self.newTrip }
      //   })
      //   .then(function(response) {
      //     //clear the form
      //     self.newTrip = {};
      //
      //     //ask the server for this user's updated trip array
      //     return $http({
      //       method: 'GET',
      //       url: '/user/'+response.data.userId+'/trips'
      //     })
      //   })
      //   .catch(function(err) {
      //     console.error(err);
      //   })
      //   .then(function(response){
      //     console.log('response is:', response);
      //     self.myTrips = response.data;
      //   })
      // }; //end this.addTrip

      this.signup = function() {
        $http({
          method: 'POST',
          url: '/signup',
          data: {
            username: self.signupUsername,
            password: self.signupPassword
          }
        })
        .then(function(response) {
          console.log('in signup, response.data is ', response.data);

          //clear form
          self.signupUsername = '';
          self.signupPassword = '';

          $state.go('home');
        })
        .catch(function(err) {
          var resetMessage = function() {
            self.signuperror = '';
          }

          self.signuperror = err.data.message.message;
          console.error(err);

          //clear the message after 3 seconds
          $timeout(resetMessage,3000);
        });
      }; //end this.signup

      this.login = function() {
        $http({
          method: 'POST',
          url: '/login',
          data: {
            username: self.username,
            password: self.password
          }
        })
        .then(function(response) {
          console.log('in login, response.data is ', response.data);
          self.currentUser = response.data.username;
          return $http({
            method: 'GET',
            url: '/user/:userId/todos'
          })
          .then(function(res){
            self.myTodos = res.data;
          })
          .then(function(){
            $state.go('user');
          })
        })
        .catch(function(err) {
          console.error(err);
        });
      }; //end this.login

      this.logout = function() {
        $http({
          method: 'GET',
          url: '/logout'
        })
        .then(function(response) {
          console.log('in logout, response.data is ', response.data);
          self.currentUser = null;
          $state.go('home');
        })
        .catch(function(err) {
          console.error(err);
        });
      }; //end this.logout

      // this.setTripToEdit = function(trip) {
      //   self.showEditForm = true;
      //   trip.dateEnd = new Date(trip.dateEnd);
      //   trip.dateStart = new Date(trip.dateStart);
      //   self.editedTrip = trip;
      // }//end setTripToEdit

      /**
       * Retuns an array of objects with a username and trip information where trips[n].place matches
       * the search string.
       * @version 1
       * @param {object} people An array of person objects, each of which contains a property trips[].
       * @param {string} searchString What to look for in trips[n].place.
       * @returns {object} result An array of objects which are Trip objects + a username.
       */
      var filterTrips = function(people, searchString) {
        var result = [];
        var testRegex = new RegExp(searchString, 'i');

        console.log('in filterTrips, people is ', people);
        console.log('in filterTrips, searchString is ', searchString);

        people.forEach(function(peopleLooper) {
          for (var i = 0; i < peopleLooper.trips.length; i++) {
            if (testRegex.test(peopleLooper.trips[i].place)) {
              peopleLooper.trips[i].username = peopleLooper.username;
              result.push(peopleLooper.trips[i]);
            }
          }
        });

        console.log('at end of filterTrips, result is ', result);
        return  result;
      }; //end filterTrips

      this.search = function(){
        $http({
          method: 'GET',
          url: '/location?place='+self.searchText,
          data: {
            place: { searchString: self.searchText }
          }
        })
        .then(function(res) {
          self.searchedForTrips = [];
          var people = res.data;

          console.log('after search request, people is ', people);

          console.log('self.searchedForTrips is ', self.searchedForTrips);

          self.searchedForTrips = filterTrips(people, self.searchText);

          $state.go('search-results')
        })
        /*
        XXX
        the below code contained within triple x did not work,
        but moving `$state.go...` to inside the above `.then` made it
        work.

          change State to search-results.html
        .then(function(){
          $scope.changeStateToSearchResults = function() {

          }
          return $http({
            method: 'GET',
            url: '/search-results',
            templateUrl: 'search-results.html'
          })
        })
        XXX */
        .catch(function(err){
          console.log(err);
        })
      }; // end this.search

      // DELETE A TRIP FROM A USER'S ARRAY
      // this.deleteTrip = function(id) {
      //   $http.delete(`/private/trip/${id}`)
      //   .then(function(response) {
      //     //get the most recent trip data
      //     self.myTrips = response.data;
      //   });
      // }; //end this.deleteTrip

      // EDIT A TRIP IN A USER'S ARRAY
      // this.editTrip = function(trip) {
      //
      //   self.showEditForm = false;
      //
      //   $http.patch(`/private/trip/${trip.tripId}`, {tripData: trip})
      //   .then(function(response) {
      //     console.log(response.data);
      //
      //     //don't need to update self.myTrips because editing newTrip updates
      //     //it in real time
      //
      //     $state.go('user');
      //   });
      // }; //end this.editTrip

    } // end UserController function
})()
