var main = angular.module('main', ['ngRoute', 'ngFileUpload']);

main.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/',	
		{
			controller: 'MainController',
			templateUrl: 'views/partials/homepageLayout.html'
		})
		.otherwise({redirectTo: '/'});
}]);


main.controller('MainController', ['$scope', '$http', 'Upload', function($scope, $http, Upload) {
	$scope.universities = [{name: 'McMaster', value: 'mcmaster'}, {name:'UOttawa', value: 'uottawa'}];
	$scope.upload = function(files, university) {	
		if (files && files.length > 0) {
			Upload.upload({
					url: '/upload',
					file: files[0],
					fields: {'university': $scope.university }
				}) 
				.progress(function(evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            $scope.message = 'Uploading and converting';
				})
				.success(function(data) {
					var anchor = angular.element('<a/>');
     				anchor.attr({
         				href: 'data:attachment/html;charset=utf-8,' + encodeURI(data),
         				target: '_blank',
         				download: 'timetable.ics'
     				})[0].click();
     				$scope.message = 'Finished.';
				})
				.error(function(data) {
					$scope.message = data;
				});
		}
	};
	$scope.countList = [
		{ id: 1, name: 'Fall' },
		{ id: 2, name: 'Winter' }
	];

	$scope.onchange = function(id) {
		var semesterPick = id.name;
	};
	$scope.$on('$viewContentLoaded', function ()
	{
		<!--Angular JS Page Edits-->
		$(document).ready(function(){
		});
	});
}]);
