(function(){
  angular.module('toDoApp')
    .controller('UserController', UserController);

    function UserController($scope, $http, $state, $timeout){

      var self = this;

      this.currentUser = null;
      this.editedToDo = {};
      this.showEditForm = false;
      this.password = '';
      this.signupUsername = null;
      this.signupPassword = null;
      this.signuperror = null;
      this.myToDos = [];
      this.searchedForToDos = [];
      this.searchText = '';
      this.username = '';

      this.newToDo = {
        title: null,
        notes: null,
        isComplete: null,
        dateStart: null,
        dateDue: null,
        createdAt: null,
        updatedAt: null
      };

      this.addToDo = function() {
        $http({
          method: 'POST',
          url: '/private/'+self.currentUser,
          data: { data: self.newToDo }
        })
        .then(function(res) {
          //clear the form
          self.newToDo = {};
          //ask the server for this user's updated toDo array
          return $http({
            method: 'GET',
            url: '/user/'+res.data.userId+'/toDos'
          })
        })
        .catch(function(err) {
          console.log('ERROR =======>', err);
        })
        .then(function(res){
          self.myToDos = res.data;
        })
        .catch(function(err) {
          console.log('ERROR =======>', err);
        })
      }; //end this.addToDo

      this.signup = function() {
        $http({
          method: 'POST',
          url: '/signup',
          data: {
            username: self.signupUsername,
            password: self.signupPassword
          }
        })
        .then(function(res) {
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
          console.log('ERROR =======>', err);
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
        .then(function(res) {
          self.currentUser = res.data.username;
          //clear form
          self.username = '';
          self.password = '';

          return $http({
            method: 'GET',
            url: '/user/:userId/toDos'
          })
          .then(function(res){
            self.myToDos = res.data;
          })
          .then(function(){
            $state.go('user');
          })
        })
        .catch(function(err) {
          console.log('ERROR =======>', err);
        });
      }; //end this.login

      this.logout = function() {
        $http({
          method: 'GET',
          url: '/private/logout'
        })
        .then(function(res) {
          self.currentUser = null;
          $state.go('home');
        })
        .catch(function(err) {
          console.log('ERROR =======>', err);
        });
      }; //end this.logout

      this.setToDoToEdit = function(toDo) {
        self.showEditForm = true;
        self.editedToDo = toDo;
      }//end setToDoToEdit

      var filterToDos = function(people, searchString) {
        var result = [];
        var testRegex = new RegExp(searchString, 'i');

        people.forEach(function(peopleLooper) {
          for (var i = 0; i < peopleLooper.toDos.length; i++) {
            if (testRegex.test(peopleLooper.toDos[i].place)) {
              peopleLooper.toDos[i].username = peopleLooper.username;
              result.push(peopleLooper.toDos[i]);
            }
          }
        });
        return  result;
      }; //end filterToDos

      this.search = function(){
        $http({
          method: 'GET',
          url: '/location?place='+self.searchText,
          data: {
            place: { searchString: self.searchText }
          }
        })
        .then(function(res) {
          self.searchedForToDos = [];
          var people = res.data;
          self.searchedForToDos = filterToDos(people, self.searchText);
          $state.go('search-results')
        })
        .catch(function(err){
          console.log('ERROR =======>', err);
        })
      }; // end this.search

      // DELETE A toDo FROM A USER'S ARRAY
      this.deleteToDo = function(id) {
        $http.delete(`/private/:userId/home/${id}`)
        .then(function(res) {
          //get the most recent toDo data
          self.myToDos = res.data;
        })
        .catch(function(err) {
          console.log('ERROR =======>', err);
        });
      }; //end this.deleteToDo

      // EDIT A toDo IN A USER'S ARRAY
      this.editToDo = function(toDo) {
        self.showEditForm = false;
        toDo.updatedAt = Date.now();
        $http.patch(`/private/toDo/${toDo._id}`, {toDo: toDo})
        .then(function(res) {
          //don't need to update self.myToDos because editing newToDo updates
          //it in real time
          $state.go('user');
        });
      }; //end this.editToDo

    } // end UserController function
})()
