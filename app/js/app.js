(function () {
    angular.module('A-Fina', ['ngRoute']);

    angular.module('A-Fina')
        .config(['$routeProvider', RouteProvider]);

    RouteProvider.$inject = ['$routeProvider'];
    function RouteProvider($routeProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'partials/main.html'
            })
            .when('/model', {
                templateUrl: 'partials/model.html',
                controller: 'ModelController as vm'
            });
    };       
})();