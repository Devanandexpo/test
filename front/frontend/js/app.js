// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-flexslider',
    'ui.swiper',
    'angularPromiseButtons',
    'toastr',
    'ngCookies',
    //'ngResource',
    'ngIdle',
    'app.directives',
    //'voiceRss',
    'jlareau.bowser',
	'angular-cache'
]);
//angular.module('manage', ['ngResource']);
// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider,IdleProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL
	//$httpProvider.defaults.headers.get = { 'X-Frame-Options' : 'ALLOW-FROM https://sailsjs.com' };
    //$resourceProvider.defaults.stripTrailingSlashes = false;
    // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    //$httpProvider.defaults.headers = 'application/x-www-form-urlencoded';
    // $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    
    // for http request with session
    //$httpProvider.defaults.withCredentials = false;
    //ttsProvider.setSettings({ key: '5a1cc1a178c24b89ba23fd6e3b1bb6c5' });
    //$qProvider.errorOnUnhandledRejections(false);
    //IdleProvider.idle(1); // 1sec idle
    //IdleProvider.timeout(20*60); // in seconds
    $stateProvider
        .state('home', {
            url: "/:id",
            templateUrl: tempateURL,
            controller: 'HomeCtrl'
        })
        .state('login', {
            url: "/login",
            templateUrl: tempateURL,
            controller: 'LoginCtrl'
        })
        .state('forgotpassword', {
            url: "/forgotpassword/:id",
            templateUrl: tempateURL,
            controller: 'ForgotPasswordCtrl'
        })
        .state('form', {
            url: "/form",
            templateUrl: tempateURL,
            controller: 'FormCtrl'
        })
        .state('grid', {
            url: "/grid",
            templateUrl: tempateURL,
            controller: 'GridCtrl'
        });
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(isproduction);
});


myApp.run(['$http','$document','$rootScope','bowser','Idle','$window', function run(  $http,$document,$rootScope,bowser,Idle,$window ){
    // For CSRF token compatibility with Django
    
    //$http.defaults.xsrfCookieName = 'csrftoken';
    //$http.defaults.xsrfHeaderName = 'X-CSRFToken';
    //$http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
    //** django urls loves trailling slashes which angularjs removes by default.
    //$resourceProvider.defaults.stripTrailingSlashes = false;
     //return function(scope, elm, attrs) {
    if ( bowser.msie )
        $rootScope.browser = "msie";
    if ( bowser.firefox )
        $rootScope.browser = "firefox";
    if ( bowser.chrome )
        $rootScope.browser = "chrome";
    if ( bowser.safari )
        $rootScope.browser = "safari";
    if ( bowser.opera )
        $rootScope.browser = "opera";
    if ( bowser.android )
        $rootScope.browser = "android"; //native
    if ( bowser.ios )
        $rootScope.browser = "ios"; //native
    if ( bowser.samsungBrowser )
        $rootScope.browser = "samsungBrowser"; //native
    if ( bowser.msedge )
        $rootScope.browser = "msedge";
    //console.log($rootScope.browser);
    $rootScope.transcript="";
    //$rootScope.tabvalue={};
    angular.element(document).ready(function(){
		//if($rootScope.isLoggedin)
		{
			/*var windowElement = angular.element($window);
			windowElement.on('beforeunload', function (event) {
				// do whatever you want in here before the page unloads.        
				window.stop();
				// the following line of code will prevent reload or navigating away.
				event.preventDefault();
			});*/
			/*
			function disableF5(e) { console.log("refresh"); if ((e.which || e.keyCode) == 116) e.preventDefault(); };
			// To disable f5
				
			$(document).bind("keydown", disableF5);
			
			$(document).on("keydown", disableF5);

			// To re-enable f5
				
			$(document).unbind("keydown", disableF5);
			
			$(document).off("keydown", disableF5);
			
			
			window.history.forward(1);
			//document.attachEvent("onkeydown", my_onkeydown_handler);
			function my_onkeydown_handler() {
				console.log("refresh");
				switch (event.keyCode) {
					case 116 : // 'F5'
						event.returnValue = false;
						event.keyCode = 0;
						window.status = "We have disabled F5";
						break;
				}
			}
			*/
		}
        //$(".faqtoggle").click(function(){
        $(document).on('click', '.faqtoggle', function(){ 
            var element = $(this).parent().parent().find('.faqmore');
            if($(element).is(":visible"))
            {
                console.log("hide now");
                $(element).hide("slow");
                $rootScope.faqviewbtn = "View More";
                $(this).text("View More");
            }
            else
            {
                console.log("show now");
                $(element).show("slow");
                $rootScope.faqviewbtn = "View Less";
                $(this).text("View Less");
            }
            // $(this).parent().parent().find('.faqmore').toggle("slow");
            return false;
        });
    });
    $(document).on('click', '.chat-body .changedthbg', function () {
        var stage = $(this).attr("data-bgstage");
        //console.log(stage);
        $(".stage" + stage).css('background-color', '#fff');
        $(".stage" + stage).css('color', '#003874');

        $(this).css('background-color', '#003874');
        $(this).css('color', '#fff');
    });
    Idle.watch();
    // $(window).bind('beforeunload', function(eventObject) {
    //     //alert("Are you sure");
    //     var scope = angular.element(document.getElementById('chat_window_1')).scope();
    //     //scope.logout();
    //     $.jStorage.flush();
    //     $rootScope.isLoggedin = false;
    //     $rootScope.chatlist = [];
    //     $.jStorage.set("showchat",false);
    //     $rootScope.chatOpen = true;
    // });
    //$(window).addEventListener("beforeunload", function (e) {
    // $window.onbeforeunload = function (event) {
    //     var scope = angular.element(document.getElementById('chat_window_1')).scope();
    //     //scope.logout();
    //     $.jStorage.flush();
    //     $rootScope.isLoggedin = false;
    //     $rootScope.chatlist = [];
    //     $.jStorage.set("showchat",false);
    //     $rootScope.chatOpen = true;
    // };
    // $window.onunload = function (event) {
    //     var scope = angular.element(document.getElementById('chat_window_1')).scope();
    //     //scope.logout();
    //     $.jStorage.flush();
    //     $rootScope.isLoggedin = false;
    //     $rootScope.chatlist = [];
    //     $.jStorage.set("showchat",false);
    //     $rootScope.chatOpen = true;
    // };
    /*$(window).on('beforeunload', function() {   // most browsers except Safari
         //doSomeMagic(param);
         // $.jStorage.flush();
         // $rootScope.isLoggedin = false;
         // $rootScope.chatlist = [];
         // $.jStorage.set("showchat",false);
         // $rootScope.chatOpen = true;
       // alert("before ");
		window.stop();
		event.preventDefault();
		 
    }).on('unload', function() {         // Chrome
         //doSomeMagic(param);
		 //alert("after");
		window.stop();
		event.preventDefault();
    });*/
    // window.onbeforeunload = function (event) {
    //     var message = 'Important: Please click on \'Save\' button to leave this page.';
    //     if (typeof event == 'undefined') {
    //         event = window.event;
    //         console.log(event);
    //     }
    //     if (event) {
    //         event.returnValue = message;
    //     }
    //     return message;
    // };
    // window.onbeforeunload = function(e){  
    //     //return 'Calling some alert messages here'; //return not alert
    //     console.log(e);
    // }
    $(window).on('beforeunload', function(){
        //return 'Are you sure you want to leave?';
    });

    $(window).on('unload', function(){
        // $.jStorage.flush();
        // $rootScope.isLoggedin = false;
        // $rootScope.chatlist = [];
        // $.jStorage.set("showchat",false);
        // $rootScope.chatOpen = true;

    });
    
    // function ngOnloadDirective() {
    //         return {
    //             restrict: "A",
    //             scope: {
    //                 callback: "&ngOnload"
    //             },
    //             link: (scope, element, attrs) => {
    //                 element.on("load", (event) => scope.callback({ event: event }));
    //             }
    //         };
    //     };
    $rootScope.$on('IdleTimeout', function() {
        var scope = angular.element(document.getElementById('chat_window_1')).scope();
        scope.logout();
        // end their session and redirect to login
    });
     
}])
// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});
