

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
 Le premier mobile est l'application. Ensuite, il faut lui préciser les modules que notre application utilisent : le module des controlleurs
 Le module de nos services, puis un autre module externe qui est ngRoute, permettant de gérer les routes (pour les changements de vue)
 */
var testApp = angular.module('testApp', ['ngRoute', 'listControllers', 'services']);

// configuration des routes de notre application
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
// Ce module est contient l'ensemble des controlleurs de notre application
var listControllers = angular.module('listControllers', []);

// Controller des informations de la personne
// InfoService : c'est un service qui va permettre de récupérer les infos de l'utilisateur en base de données (Web SQL)
listControllers.controller('infoCtrl', ['$scope', 'InfoService', function ($scope, InfoService) {

    // On appelle la méthode getUserInfos de notre services, une fois que le traitement de cette méthode est fini, 
    // On appelle le callback de succès de la promise (explication dans le service InfoService)
    InfoService.getUserInfos().then(function(infos){;
        // Mis à jour de la vue avec les infos de l'utilisateur
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
// Ce module contient l'ensemble des services
var services = angular.module('services', []);

// Premier service : récupération des informations de l'utilisateur
services.factory('InfoService', function($q) {

  // Première variable de notre objet InfoService
  this.getUserInfos = function(){

    // Mis en place du callback : on créé un objet deffered, 
    /* l'objet deferred représente une action. En fait, c'est grâce à cette action que la valeur de l'objet Promise sera disponible. */
    // EN JS : c'est asynchrone, cad, que si on appelle une fonction, on attend pas son retour pour continuer la suite du programme.
    // Dans notre cas, le problème était le suivant : les informations en bases n'avaient pas le temps d'être récupérées, du coup, la variable "infos"
    // du controlleur était vide, et on avait pas d'info. Avec la mise en place du "promise", on est sûr de récupérer les infos, pour ensuite faire un traitement
    // a postériori, avecl l'utilisation de ma méthode "then" dans le controlleur
    var deferred = $q.defer(); 

    // Cordova met à disposition une API afin de stocker une BDD dans la le navigateur du smartphone.
    var db = window.openDatabase("test", "1.0", "Test DB", 5000000);

    // Ouverture d'un transaction, réquète, l'action deffered renvoie le résultat à la promise si ca se passe bien
    db.transaction(function(tx){
       tx.executeSql('SELECT * FROM INFO', [], function(tx, results){
       deferred.resolve(results.rows.item(0));
       }, function(transaction, error) {
            // Sinon promise renverra une erreur
            deferred.reject(error);
          });
    });
    // On renvoie la valeur de la promesse (envoyé grâce au deffered)
    return deferred.promise;
  };

  // On retourne l'objet InfoService
  return this;
});