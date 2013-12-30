var debug;
angular.module('harvard', ['ui.bootstrap']);
var ModalDemoCtrl = function ($scope, $modal, $log, $http) {

  $http.get('harvard.json').then(function(res){
    $scope.posts = res.data;
    $scope.posts.forEach(function(element){
      if (element.from.name == 'Luran He'){
        console.log(element);
      }
    });
    console.log("got it!");
    console.log($scope.posts.length)
  });

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
  /*for (var i = 1; i < list.length - 1; i++){
    fin += '</p>' + list[i] + '<p>';
  }
  fin = '<p>' + fin + '</p>';*/
  $scope.post.list = list;
  //$scope.post.message = fin;

  //document.getElementsByClassName('modal')[0].style.backgroundColor = "white";
  //document.getElementsByClassName('modal')[0].style.display = "inherit";

  $scope.ok = function () {
    $modalInstance.close();
  };
};
