angular.module('starvingToday').controller('commentEditModalController' , ['$scope' , '$http' , '$state' , 'dataUser' , 'dataRecipe', function($scope , $http , $state, dataUser , dataRecipe)
{

  $scope.editcomment = dataRecipe.getComment();

  $scope.PopulateComment = function(commentid) {
    $http.get('http://138.68.22.10:84/comments/comment/'+commentid).then(
      function(response){
        dataRecipe.setComment(response.data);
        $scope.editcomment = dataRecipe.getComment();
        console.log($scope.editcomment);
        console.log(dataRecipe.getComment());
      },
      function(response){
        $scope.responseDetails = "get failed";
      }
    );
  }

  $scope.LoadComment = function() {
    $scope.editcomment = dataRecipe.getComment();
  }

  $scope.UpdateComment = function() {
    var comment_data = $scope.editcomment;

    var data = JSON.stringify(comment_data);

    var config = {
      headers : {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }

    $http.put('http://138.68.22.10:84/comments/'+comment_data.commentid , data, config)
    .then(
      function (response) {
        $http.get('http://138.68.22.10:84/comments/recipe/' + $scope.recipe.recipeid).then(
          function (response) {
            console.log(response.data);
              var temp = [];
              Object.keys(response.data.comments).forEach(function(key) {
                $http.get('http://138.68.22.10:84/users/id/' + response.data.comments[key].userid).then(
                  function (res) {
                    console.log(res.data.user.firstname + " " + res.data.user.lastname);
                    response.data.comments[key].authorname = res.data.user.firstname + " " + res.data.user.lastname;
                  },
                  function (res) {
                      $scope.comments = 0;
                });
                  temp.push(response.data.comments[key]);
              });
              $scope.comments = temp.reverse();
          },
          function (response) {
              $scope.comments = 0;
        });
      },
      function (response) {
        $scope.responseDetails = "You couldn't even enter a recipe correctly.. for SHAME!" + response.status;
    });

  }
}]);
