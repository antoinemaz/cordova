

/* JS DU MENU, SANS ANGULARJS */
var snapper = new Snap({
    element: document.getElementById('content'),
    disable: 'right'
});


document.getElementById('open-left').addEventListener('click', function(){

    if( snapper.state().state=="left" ){
        snapper.close();
    } else {
        snapper.open('left');
    }

});

/* FIN MENU */

/**
 * Déclaration de l'application : routes
 */
var testApp = angular.module('testApp', ['ngRoute', 'listControllers', 'services']);

testApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/info', {
      templateUrl : 'partials/info.html',
      controller: 'infoCtrl'
    }).
    when('/depense', {
      templateUrl : 'partials/depense.html',
      controller: 'depenseCtrl'
    }).
    otherwise({
      redirectTo : '/info'
    });
}]);

/** Liste des controlleurs */
var listControllers = angular.module('listControllers', []);

// Controller des informations de la personne
listControllers.controller('infoCtrl', ['$scope', 'InfoService', function ($scope, InfoService) {

    InfoService.getUserInfos().then(function(infos){;
        $scope.nom = infos.nom;
        $scope.prenom = infos.prenom;
        $scope.age = infos.age;
    });

	$scope.succes = false;

	$scope.saveData = function() {
		$scope.succes = true;
	};

}]);

// Controller des dépenses
listControllers.controller('depenseCtrl', ['$scope', function ($scope) {


}]);

/* Services */

var services = angular.module('services', []);

services.factory('InfoService', function($q) {

  this.getUserInfos = function(){

    var deferred = $q.defer();

    var db = window.openDatabase("test", "1.0", "Test DB", 5000000);

    db.transaction(function(tx){
       tx.executeSql('SELECT * FROM INFO', [], function(tx, results){
       deferred.resolve(results.rows.item(0));
       }, function(transaction, error) {
            deferred.reject(error);
          });
    });
    return deferred.promise;
  };

  return this;
});