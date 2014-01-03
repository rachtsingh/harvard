var debug;

var key = ''; // the key used to decrypt the data
var encrypted = ''; // the actual encrypted json

angular.module('harvard', ['ui.bootstrap']);
var ModalDemoCtrl = function ($scope, $modal, $log, $http) {

  $scope.member = false;
  $scope.encrypted = '';
  $scope.key = '';
  $scope.loggedin = false;

  $http.get('harvard.dat').then(function(res){
    $scope.encrypted = res.data;
    console.log("got encrypted data!");
    $scope.trydecrypt();
  });

  /* FACEBOOK STUFF */
  window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '238589536318580',
      status     : true,
      xfbml      : true
    });

    
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      if (response.status === 'connected') {
        $scope.loggedin = true;
        console.log("at least firing");
        FB.api('601401026562908/?fields=docs', function(res){
          if (!('docs' in res)){
            return;
          }
          res.docs.data.forEach(function(doc){
            if (doc.subject == "Class of 2018: The Social Network(s)"){
              $scope.member = true;
              $scope.key = doc.id;
              console.log("Got key! " + $scope.key);
              $scope.trydecrypt();
            }
          });
        });
      }/* else if (response.status === 'not_authorized') {
        FB.login(function(response){
          console.log("Logged in!");
        }, {scope: 'user_groups'});
      } else {
        FB.login(function(response){
          console.log("Logged in!");
        }, {scope: 'user_groups'});
      }*/
    });
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        $scope.loggedin = true;
        console.log("at least firing");
        FB.api('601401026562908/?fields=docs', function(res){
          if (!('docs' in res)){
            return;
          }
          res.docs.data.forEach(function(doc){
            if (doc.subject == "Class of 2018: The Social Network(s)"){
              $scope.member = true;
              $scope.key = doc.id;
              console.log("Got key! " + $scope.key);
              $scope.trydecrypt();
            }
          });
        });
      } else if (response.status === 'not_authorized') {
        FB.login(function(response){
          console.log("Logged in!");
        }, {scope: 'user_groups'});
      } else {
        FB.login(function(response){
          console.log("Logged in!");
        }, {scope: 'user_groups'});
      }
   });
  };

  // Load the SDK asynchronously
  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script'); 
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());

  $scope.open = function (id) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        id: function(){
          return id;
        },
        posts: function(){
          return $scope.posts;
        }
      }
    });
  };

  $scope.thing = function(event){
    $scope.open(this.post.from.id);
  }

  $scope.trydecrypt = function(){
    //console.log($scope.encrypted.)
    var post = CryptoJS.AES.decrypt($scope.encrypted.toString(), $scope.key.toString());
    try {
      var temp = post.toString(CryptoJS.enc.Utf8);
      console.log(temp);
      $scope.posts = JSON.parse(temp);
      console.log($scope.posts);
      $scope.$apply();
      $scope.digest();
      //console.log($scope.posts.length);
    } catch (err) {
      console.log(err);
    }
  }
};

var ModalInstanceCtrl = function ($scope, $modalInstance, id, posts) {

  $scope.posts = posts;
  $scope.posts.forEach(function(element){
    if (element.from.id == id){
      $scope.post = element;
    }
  });

  $scope.id = id;

  //process string to make p tags!
  var str = $scope.post.message;
  var fin = '';
  var list = str.split('\n');
  $scope.post.list = list;

  $scope.ok = function () {
    $modalInstance.close();
  };
};

