myApp.directive('img', function ($compile, $parse) {
        return {
            restrict: 'E',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                if (!attrs.noloading) {
                    $element.after("<img src='img/loading.gif' class='loading' />");
                    var $loading = $element.next(".loading");
                    $element.load(function () {
                        $loading.remove();
                        $(this).addClass("doneLoading");
                    });
                } else {
                    $($element).addClass("doneLoading");
                }
            }
        };
    })
    /*.directive('object', function ($q,$compile, $parse,$http,$rootScope) {
        return {
            restrict: 'E',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                if (!attrs.noloading) {
                    $element.after("<img src='img/loading.gif' class='loading' />");
                    var $loading = $element.next(".loading");
                    $element.load(function () {
                        
                        //var doc = $($element).contents()[0].documentElement;
                        // Get contents here:
                        var dfd = $q.defer();
                        var dataattr = $element.attr("data");
                        var dataid = $element.attr("id");
                        var myiframe = document.getElementById(dataid);
                        
                        $("#"+dataid).ready(function () {
                            $rootScope.scrollChatWindow();
                            $loading.remove();
                            $(this).addClass("doneLoading");
                            // /console.log(dataid,"Loaded");
                        });
                        //console.log(dataattr,"obhe");
                        // $http.jsonp(dataattr)
                        // .then(function(data,status){
                        //     console.log(data.results.length);
                        //     if (data.results.length) {
                        //     console.log('success!')
                        //     dfd.resolve(true);
                        //     } else {
                        //     dfd.reject(false);
                        //     }
                        // });
                    });
                } else {
                    $($element).addClass("doneLoading");
                }
            }
        };
    })*/
    
    // .directive("ngOnload",  function() {
    //     return {
    //         restrict: "A",
    //         scope: {
    //             callback: "&ngOnload"
    //         },
    //         link: (scope, element, attrs) => {
    //             element.on("load", (event) => scope.callback({ event: event }));
    //             console.log("done");
    //         }
    //     };
    // })
    .directive('hideOnScroll', function ($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {
                var $element = $(element);
                var lastScrollTop = 0;
                $(window).scroll(function (event) {
                    var st = $(this).scrollTop();
                    if (st > lastScrollTop) {
                        $(element).addClass('nav-up');
                    } else {
                        $(element).removeClass('nav-up');
                    }
                    lastScrollTop = st;
                });
            }
        };
    })


    .directive('fancybox', function ($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {
                var $element = $(element);
                var target;
                if (attr.rel) {
                    target = $("[rel='" + attr.rel + "']");
                } else {
                    target = element;
                }

                target.fancybox({
                    openEffect: 'fade',
                    closeEffect: 'fade',
                    closeBtn: true,
                    padding: 0,
                    helpers: {
                        media: {}
                    }
                });
            }
        };
    })

    .directive('autoHeight', function ($compile, $parse) {
        return {
            restrict: 'EA',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                var windowHeight = $(window).height();
                $element.css("min-height", windowHeight);
            }
        };
    })
    .directive('chatbotHeight', function ($compile, $parse) {
        return {
            restrict: 'EA',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                var windowHeight = $(window).height();
                var chatbotH = windowHeight - 53;
                //$element.css("min-height", chatbotH);
                $element.height(chatbotH);
                // var w = angular.element($window);
                // w.bind('chatbotHeight', function () {
                //     scope.$apply();
                // });
            }
        };
    })


    .directive('replace', function () {
        return {
            require: 'ngModel',
            scope: {
                regex: '@replace',
                with: '@with'
            },
            link: function (scope, element, attrs, model) {
                model.$parsers.push(function (val) {
                    if (!val) {
                        return;
                    }
                    var regex = new RegExp(scope.regex);
                    var replaced = val.replace(regex, scope.with);
                    if (replaced !== val) {
                        model.$setViewValue(replaced);
                        model.$render();
                    }
                    return replaced;
                });
            }
        };
    })
    
    .directive('validPasswordC', function() {
        return {
            require: 'ngModel',
            scope: {

              reference: '=validPasswordC'

            },
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue, $scope) {

                    var noMatch = viewValue != scope.reference
                    ctrl.$setValidity('noMatch', !noMatch);
                    return (noMatch)?noMatch:!noMatch;
                });

                scope.$watch("reference", function(value) {;
                    ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

                });
            }
        }
    })
   .directive('iframeOnload', [function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                //var $body = $(element).contents().find('body');
				element.hide();
				var loadingtxt = "<div class='loadingimg'><img src='img/loading.gif' class='loading'><p class='loadingmsg'>Please wait your query is being processed</p></div>";
                element.after(loadingtxt);
				var $loading = element.next(".loadingimg");
				element.load(function () {
					
					$(this).addClass("doneLoading");
				});
				setTimeout(function(){
					$loading.remove();
					element.show();
				},3000);
				
                /*$(element).load(function() {
                    // cached body element overrides when src loads
                    // hence have to cache it again            
                    //$body = $(element).contents().find('body');
                    //$body.css(scope.$eval(attrs.iframeOnload));
                    console.log("Loaded");
                });*/
                
                attrs.$observe('iframeOnload', function(value) {
                    //$body.css(scope.$eval(value));
                }, true);
            }
        };
    }])
    .directive('sbLoad', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var fn = $parse(attrs.sbLoad);
                elem.on('load', function (event) {
                scope.$apply(function() {
                    fn(scope, { $event: event });
                });
                });
            }
        };
    }])
    .directive('orientable', function ($rootScope) {       
        return {
            link: function(scope, element, attrs) {   

                element.bind("load" , function(e){ 
                    console.log("Done");
                    $rootScope.scrollChatWindow();
                    // success, "onload" catched
                    // now we can do specific stuff:

                    // if(this.naturalHeight > this.naturalWidth){
                    //     this.className = "vertical";
                    // }
                });
            }
        }
    })
	.directive('focus', function () {
	  return function (scope, element, attrs) {
			   element.focus();
	  }
	})
	/*.directive('shortcut', function() {
	  return {
		restrict: 'E',
		replace: true,
		scope: true,
		link:    function postLink(scope, iElement, iAttrs){
			jQuery(document).on('keydown', function(e){
				//scope.$apply(scope.keyPressed(e));
				//console.log(e);
				if (e.keyCode == 116 || (window.event.ctrlKey && e.keyCode == 82)) {
					window.event.returnValue = false;
					window.event.keyCode = 0;
					window.status = "Refresh is disabled";
					window.stop();
					if (e.preventDefault) {
						e.preventDefault();
						e.stopPropagation();
					}
					console.log('disabling');
				}
		   });
		}
	  };
	})*/
    // myApp.directive('ngRightClick', function($parse) {
    //     return function(scope, element, attrs) {
    //         var fn = $parse(attrs.ngRightClick);
    //         element.bind('contextmenu', function(event) {
    //             scope.$apply(function() {
    //                 event.preventDefault();
    //                 fn(scope, {
    //                     $event: event
    //                 });
    //             });
    //         });
    //     };
    // })
    
;