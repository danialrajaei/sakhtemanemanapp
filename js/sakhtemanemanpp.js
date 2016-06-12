var masterUrl='http://sakhtemaneman.ir';
var app = angular.module('sakhtemaneman', ['ngRoute','mobile-angular-ui']);
  
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  //'mobile-angular-ui.gestures']);
  
  app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'home.html',controller: 'indexController', reloadOnSearch: false})
  .when('/login',     {templateUrl: 'login.html',controller: 'loginController', reloadOnSearch: false})
  .when('/payment',        {templateUrl: 'payment.html',controller: 'paymentController', reloadOnSearch: false})
  .when('/messages',        {templateUrl: 'messages.html',controller: 'messagesController', reloadOnSearch: false})
  .when('/declarations',          {templateUrl: 'declarations.html',controller: 'declarationsController', reloadOnSearch: false})
  .when('/logout',     {templateUrl: 'logout.html',controller: 'logoutController', reloadOnSearch: false})
  .when('/payments',     {templateUrl: 'payments.html',controller: 'paymentsController', reloadOnSearch: false})
  .when('/trans',     {templateUrl: 'trans.html',controller: 'transController', reloadOnSearch: false})
});

app.run(function($rootScope){
	$rootScope.ShowSideBar = true;
});

app.controller('loginController', function($rootScope,$scope,$http) {
	$rootScope.ShowSideBar = false;
	$scope.loginModel = {grant_type:"password",username:"",password:""};
    $scope.login=function(){
		$rootScope.loading = true;
		$http({
			  method: 'POST',
			  url: masterUrl+'/Token',
			  data: 'grant_type='+$scope.loginModel.grant_type+'&username='+$scope.loginModel.username+'&password='+$scope.loginModel.password
			  //data:JSON.stringify($scope.loginModel)
			}).then(function successCallback(response) {
				//response.data.access_token
				window.localStorage.setItem("token", response.data.access_token);
				window.location.replace("/");
			  }, function errorCallback(response) {
				  $rootScope.loading = false;
				if(response.data.error=="invalid_grant")
				{
					$('.alert-danger').show().addClass('bounceInDown');
					$rootScope.error='اطلاعات ورود اشتباه است';
				}
				else
				{
					$('.alert-danger').show().addClass('bounceInDown');
					$rootScope.error='اشکال در برقراری ارتباط لطفاً مجدداً تلاش کنید';
				}
			  });
		};
});

app.controller('indexController', function($scope,$http){
    var token = window.localStorage.getItem("token");
	var headers={};
	console.log("load already");
	return;
	if(token==null)
	{
		window.location.replace('/#login');
	}
	else
	{
		headers.Authorization = 'Bearer ' + token;
		var tokenFlag=false;
		$rootScope.loading = true;
		var promise= $http({
			method: 'POST',
			  url: masterUrl+'/app/checktoken',
			  headers:headers
		}).then(function successCallback(response) {
				tokenFlag=true;
				$http({
					method: 'GET',
					url: masterUrl+'/app/getapartmentatg',
					headers:headers
					}).then(function successCallback(response) {
						$rootScope.loading = false;
						$scope.apartmentsAtG = response.data;
					}, function errorCallback(response) {});
			}, function errorCallback(response) {
				$rootScope.loading = false;
				window.localStorage.clear();
				window.location.replace('/#login');
			});
	}
	});

	app.controller('paymentController', function($scope,$http){
		var token = window.localStorage.getItem("token");
		var headers={};
		if(token==null)
		{
			window.location.replace('/#login');
		}
		else
		{
			headers.Authorization = 'Bearer ' + token;
			var tokenFlag=false;
			$rootScope.loading = true;
			var promise= $http({
				method: 'POST',
				  url: masterUrl+'/app/checktoken',
				  headers:headers
			}).then(function successCallback(response) {$rootScope.loading = false;}, function errorCallback(response) {
				$rootScope.loading = false;
				window.localStorage.clear();
				window.location.replace('/#login');
				});
		};
		$scope.paymentModel = {PaymentType:0,DateTime:'',Description:'',PaymentAttachment:'',Value:0};
		$scope.paySubmit=function(type){
			$scope.paymentModel.PaymentType = type;
			$rootScope.loading = true;
			$http({
				method: 'POST',
				  url: masterUrl+'/app/PaySubmit',
				  headers:headers,
				  data:$scope.paymentModel
			}).then(function successCallback(response) {$rootScope.loading = false;}, function errorCallback(response) {$rootScope.loading = false;});
		}
	});

	app.controller('messagesController', function($scope,$http){
		var token = window.localStorage.getItem("token");
		var headers={};
		if(token==null)
		{
			window.location.replace('/#login');
		}
		else
		{
			headers.Authorization = 'Bearer ' + token;
			var tokenFlag=false;
			var promise= $http({
				method: 'POST',
				  url: masterUrl+'/app/checktoken',
				  headers:headers
			}).then(function successCallback(response) {
				$scope.loadMessages();
			}, function errorCallback(response) {
				$rootScope.loading = false;
				window.localStorage.clear();
				window.location.replace('/#login');
				});
		}
	$scope.loadMessages = function(){
		$rootScope.loading = true;
		$http({
					method: 'GET',
					url: masterUrl+'/app/GetMessages',
					headers:headers
					}).then(function successCallback(response) {
						$rootScope.loading = false;
						$scope.messages = response.data;
					}, function errorCallback(response) {$rootScope.loading = false;});
	};
	
	$scope.sendMessage = function(){
		$rootScope.loading = true;
			$http({
					method: 'GET',
					url: masterUrl+'/app/PutMessage?commentString='+$scope.MessageModel,
					headers:headers
					}).then(function successCallback(response) {
						$rootScope.loading = false;
						$scope.loadMessages();
					}, function errorCallback(response) {$rootScope.loading = false;});
			};
	});

	app.controller('declarationsController', function($scope,$http){
		var token = window.localStorage.getItem("token");
		var headers={};
		if(token==null)
		{
			window.location.replace('/#login');
		}
		else
		{
			headers.Authorization = 'Bearer ' + token;
			var tokenFlag=false;
			$rootScope.loading = true;
			var promise= $http({
				method: 'POST',
				  url: masterUrl+'/app/checktoken',
				  headers:headers
			}).then(function successCallback(response) {
				$http({
					method: 'GET',
					url: masterUrl+'/app/GetDeclars',
					headers:headers
					}).then(function successCallback(response) {
						$rootScope.loading = false;
						$scope.declarations = response.data;
					}, function errorCallback(response) {$rootScope.loading = false;});
			}, function errorCallback(response) {
				$rootScope.loading = false;
				window.localStorage.clear();
				window.location.replace('/#login');
				});
		}
	});
	
	app.controller('paymentsController', function($scope,$http){
		var token = window.localStorage.getItem("token");
		var headers={};
		if(token==null)
		{
			window.location.replace('/#login');
		}
		else
		{
			headers.Authorization = 'Bearer ' + token;
			var tokenFlag=false;
			var promise= $http({
				method: 'POST',
				  url: masterUrl+'/app/checktoken',
				  headers:headers
			}).then(function successCallback(response) {
				$rootScope.loading = true;
				$http({
					method: 'GET',
					url: masterUrl+'/app/GetPayments',
					headers:headers
					}).then(function successCallback(response) {
						$rootScope.loading = false;
						$scope.payments = response.data;
					}, function errorCallback(response) {$rootScope.loading = false;});
			}, function errorCallback(response) {
				$rootScope.loading = false;
				window.localStorage.clear();
				window.location.replace('/#login');
				});
		}
	});
	
	app.controller('transController', function($scope,$http){
		var token = window.localStorage.getItem("token");
		var headers={};
		if(token==null)
		{
			window.location.replace('/#login');
		}
		else
		{
			headers.Authorization = 'Bearer ' + token;
			var tokenFlag=false;
			var promise= $http({
				method: 'POST',
				  url: masterUrl+'/app/checktoken',
				  headers:headers
			}).then(function successCallback(response) {
				$rootScope.loading = true;
				$http({
					method: 'GET',
					url: masterUrl+'/app/GetTransactions',
					headers:headers
					}).then(function successCallback(response) {
						$rootScope.loading = false;
						$scope.trans = response.data;
					}, function errorCallback(response) {});
			}, function errorCallback(response) {
				$rootScope.loading = false;
				window.localStorage.clear();
				window.location.replace('/#login');
				});
		}
	});
	
app.controller('logoutController', function(){
	$rootScope.loading = false;
	window.localStorage.clear();
	window.location.replace('/#login');
});