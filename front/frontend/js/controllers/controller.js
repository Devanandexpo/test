
     myApp.controller('HomeCtrl', function ($scope,$rootScope, TemplateService, NavigationService,Menuservice, $timeout,$http,apiService,$state) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })
    
    

    
    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/form.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        // $scope.data = {
        //     name: "Chintan",
        //     "age": 20,
        //     "email": "chinyan@wohlig.com",
        //     "query": "query"
        // };
        $scope.submitForm = function (data) {
            console.log("This is it");
            return new Promise(function (callback) {
                $timeout(function () {
                    callback();
                }, 5000);
            });
        };
    })

    
    .controller('SpeechRecognitionController', function ($scope, $rootScope,$timeout) {

        var vm = this;

        vm.displayTranscript = displayTranscript;
        vm.transcript = '';
        function displayTranscript() {
            vm.transcript = $rootScope.transcript;
            console.log("transcript",$rootScope.transcript);
            $(".chatinput").val($rootScope.transcript);
            $rootScope.pushMsg(0,$rootScope.transcript,$rootScope.backendurl);
            //This is just to refresh the content in the view.
            if (!$scope.$$phase) {
                $scope.$digest();
                //console.log("transcript",$rootScope.transcript);
                $(".chatinput").val("");
            }
        }
        $rootScope.startspeech = function() {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            console.log("new func");
        // recognition.onresult = function(event) 
            { 
                console.log(event); 
            }
            recognition.start();
        };
        /**
         * Handle the received transcript here.
         * The result from the Web Speech Recognition will
         * be set inside a $rootScope variable. You can use it
         * as you want.
         */
        $rootScope.speechStarted = function() {
            console.log("speech Started");
        };
		
		//var SDK;
		//var SDK = require(['js/speech.js']);
		/*
		require(['js/speech.js'], function(fooModule){
			// do something with fooModule
			SDK =fooModule;
			console.log(SDK);
		})*/
		
		/*function Initialize(onComplete) {
            if (!!window.SDK) {
                document.getElementById('content').style.display = 'block';
                document.getElementById('warning').style.display = 'none';
				console.log("Speech Recognition SDK not found.");
                onComplete(window.SDK);
            }
        }
        
        // Setup the recognizer
        function RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {
            
            switch (recognitionMode) {
                case "Interactive" :
                    recognitionMode = SDK.RecognitionMode.Interactive;    
                    break;
                case "Conversation" :
                    recognitionMode = SDK.RecognitionMode.Conversation;    
                    break;
                case "Dictation" :
                    recognitionMode = SDK.RecognitionMode.Dictation;    
                    break;
                default:
                    recognitionMode = SDK.RecognitionMode.Interactive;
            }
            var recognizerConfig = new SDK.RecognizerConfig(
                new SDK.SpeechConfig(
                    new SDK.Context(
                        new SDK.OS(navigator.userAgent, "Browser", null),
                        new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
                recognitionMode,
                language, // Supported languages are specific to each recognition mode. Refer to docs.
                format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)
            var useTokenAuth = false;
            
            var authentication = function() {
                if (!useTokenAuth)
                    return new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);
                var callback = function() {
                    var tokenDeferral = new SDK.Deferred();
                    try {
                        var xhr = new(XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                        xhr.open('GET', '/token', 1);
                        xhr.onload = function () {
                            if (xhr.status === 200)  {
                                tokenDeferral.Resolve(xhr.responseText);
                            } else {
                                tokenDeferral.Reject('Issue token request failed.');
                            }
                        };
                        xhr.send();
                    } catch (e) {
                        window.console && console.log(e);
                        tokenDeferral.Reject(e.message);
                    }
                    return tokenDeferral.Promise();
                }
                return new SDK.CognitiveTokenAuthentication(callback, callback);
            }();
            
            var files = document.getElementById('filePicker').files;
            if (!files.length) {
                return SDK.CreateRecognizer(recognizerConfig, authentication);
            } else {
                return SDK.CreateRecognizerWithFileAudioSource(recognizerConfig, authentication, files[0]);
            }
        }
        // Start the recognition
        function RecognizerStart(SDK, recognizer) {
            recognizer.Recognize((event) => {
                switch (event.Name) {
                    case "RecognitionTriggeredEvent" :
                        UpdateStatus("Initializing");
                        break;
                    case "ListeningStartedEvent" :
                        UpdateStatus("Listening");
                        break;
                    case "RecognitionStartedEvent" :
                        UpdateStatus("Listening_Recognizing");
                        break;
                    case "SpeechStartDetectedEvent" :
                        UpdateStatus("Listening_DetectedSpeech_Recognizing");
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechHypothesisEvent" :
                        UpdateRecognizedHypothesis(event.Result.Text, false);
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechFragmentEvent" :
                        UpdateRecognizedHypothesis(event.Result.Text, true);
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechEndDetectedEvent" :
                        OnSpeechEndDetected();
                        UpdateStatus("Processing_Adding_Final_Touches");
                        console.log(JSON.stringify(event.Result)); // check console for other information in result
                        break;
                    case "SpeechSimplePhraseEvent" :
                        UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                        break;
                    case "SpeechDetailedPhraseEvent" :
                        UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                        break;
                    case "RecognitionEndedEvent" :
                        OnComplete();
                        UpdateStatus("Idle");
                        console.log(JSON.stringify(event)); // Debug information
                        break;
                    default:
                        console.log(JSON.stringify(event)); // Debug information
                }
            })
            .On(() => {
                // The request succeeded. Nothing to do here.
            },
            (error) => {
                console.error(error);
            });
        }
        // Stop the Recognition.
        function RecognizerStop(SDK, recognizer) {
            // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
            recognizer.AudioSource.TurnOff();
        }
        var startBtn, stopBtn, hypothesisDiv, phraseDiv, statusDiv;
        var filePicker;
        var SDK;
        var recognizer;
        var previousSubscriptionKey;
		var key = {};
		var languageOptions = {};
		var formatOptions = {};
		var recognitionMode = {};
		var inputSource = {};
		inputSource.value = "Microphone";
		recognitionMode .value= "Interactive";
		formatOptions.value = "Simple";
		languageOptions.value="en-IN";
		key.value = "3c2d716e86e04527bcc73d6fb45eef78";
		$(document).on('click', '#startBtn', function () {
			
			if (key.value == "" || key.value == "YOUR_BING_SPEECH_API_KEY") {
				alert("Please enter your Bing Speech subscription key!");
				return;
			}
			if (inputSource.value === "File") {
				filePicker.click();
			} else {
				if (!recognizer || previousSubscriptionKey != key.value) {
					previousSubscriptionKey = key.value;
					console.log("clicked");
					Setup();
				}
				hypothesisDiv.innerHTML = "";
				phraseDiv.innerHTML = "";
				RecognizerStart(SDK, recognizer);
				startBtn.disabled = true;
				stopBtn.disabled = false;
			}                
		});
		createBtn = document.getElementById("createBtn");
            startBtn = document.getElementById("startBtn");
            stopBtn = document.getElementById("stopBtn");
            phraseDiv = document.getElementById("phraseDiv");
            hypothesisDiv = document.getElementById("hypothesisDiv");
            statusDiv = document.getElementById("statusDiv");
            //key = document.getElementById("key");
            //languageOptions = document.getElementById("languageOptions");
            //formatOptions = document.getElementById("formatOptions");
            //inputSource = document.getElementById("inputSource");
            //recognitionMode = document.getElementById("recognitionMode");
            filePicker = document.getElementById('filePicker');
            //languageOptions.addEventListener("change", Setup);
            //formatOptions.addEventListener("change", Setup);
            //recognitionMode.addEventListener("change", Setup);
            //startBtn.addEventListener("click", function () {
			
            
		angular.element(document).ready(function(){
            console.log("loaded");
			Initialize(function (speechSdk) {
				console.log(speechSdk);
                SDK = speechSdk;
                //startBtn.disabled = false;
            });
			$timeout(function() {
				Initialize();
				//console.log(SDK);
			},1000);
		});
		$scope.$on('$viewContentLoaded', function(){
			
			$timeout(function() {
				//Initialize();
				//console.log(SDK);
			},1000);
		  });
        document.addEventListener("DOMContentLoaded", function () {
            
        });
        function Setup() {
            if (recognizer != null) {
                RecognizerStop(SDK, recognizer);
            }
            recognizer = RecognizerSetup(SDK, recognitionMode.value, languageOptions.value, SDK.SpeechResultFormat[formatOptions.value], key.value);
        }
        function UpdateStatus(status) {
            statusDiv.innerHTML = status;
        }
        function UpdateRecognizedHypothesis(text, append) {
            if (append) 
                hypothesisDiv.innerHTML += text + " ";
            else 
                hypothesisDiv.innerHTML = text;
            var length = hypothesisDiv.innerHTML.length;
            if (length > 403) {
                hypothesisDiv.innerHTML = "..." + hypothesisDiv.innerHTML.substr(length-400, length);
            }
        }
        function OnSpeechEndDetected() {
            stopBtn.disabled = true;
        }
        function UpdateRecognizedPhrase(json) {
            hypothesisDiv.innerHTML = "";
            phraseDiv.innerHTML += json + "\n";
        }
        function OnComplete() {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }*/
		
		
		var phraseDiv, statusDiv, key, languageOptions, formatOptions;
		var SDK;
		var recognizer;
		var previousSubscriptionKey;
		var hyptext = '';


									  
		function RecognizerStart(SDK, recognizer) {

			
			 recognizer.Recognize(function(event) {
		//	    	// debugger;
					
				// alert("===event.Name======="+event.Name);
					switch (event.Name) {
						case "RecognitionTriggeredEvent" :
							UpdateStatus("Initializing");
							break;
						case "ListeningStartedEvent" :
							UpdateStatus("Listening");
							break;
						case "RecognitionStartedEvent" :
							UpdateStatus("Listening_Recognizing");
							break;
						case "SpeechStartDetectedEvent" :
							UpdateStatus("Listening_DetectedSpeech_Recognizing");
							console.log((event.Result)); // check console for
																		// other information
																		// in result
							
						  // alert("===JSONO===="+JSON.stringify(event.Result));
							console.log(event.Result); 
							 break;
						case "SpeechHypothesisEvent" :
							UpdateRecognizedHypothesis(event.Result.Text);
							console.log((event.Result)); // check console for
																		// other information
																		// in result
							break;
						case "SpeechEndDetectedEvent" :
						   OnSpeechEndDetected();
						   UpdateStatus("Processing_Adding_Final_Touches");
							console.log((event.Result)); // check console for
																		// other information
																		// in result
							break;
						case "SpeechSimplePhraseEvent" :
							UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
							break;
						case "SpeechDetailedPhraseEvent" :
							UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
							break;
						case "RecognitionEndedEvent" :
							OnComplete();
							UpdateStatus("Idle");
						   // alert("end of event");
						   $timeout(function() {
							   if(hyptext != '')
									$rootScope.pushMsg(0,hyptext,$rootScope.backendurl);
							
						   },1000);
							
							console.log((event)); // Debug
																									// information
							break;
					}
				})
			   /* .on('click', function (e) {
					
				});*/
		}

		//Stop the Recognition.
		function RecognizerStop(SDK, recognizer) {
		  // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
		  recognizer.AudioSource.TurnOff();
		}

		var language="en-US",format = 0,subscriptionKey = "3c2d716e86e04527bcc73d6fb45eef78";

		var value ="3c2d716e86e04527bcc73d6fb45eef78";

		
		//});
		function Initialize(onComplete) {
		  /*require(["js/Speech.Browser.Sdk"], function(SDK) {
			  console.log(SDK);
			  onComplete(SDK);
			 // alert("=======SDK=11========"+SDK);
		  });*/
		  if (!!window.SDK) {
               // document.getElementById('content').style.display = 'block';
                //document.getElementById('warning').style.display = 'none';
                onComplete(window.SDK);
            }
		}
		function Setup() {
			//alert("=======SDK========"+SDK+"======RecognitionMode======="+SDK.RecognitionMode.Interactive+"======language========"+language+"=====format======="+format+"=======subscriptionKey======"+subscriptionKey);
		  recognizer = RecognizerSetup(SDK,SDK.RecognitionMode.Interactive,language,format,subscriptionKey);
		  //alert("========="+recognizer);
		}

		function RecognizerSetup(SDK,recognitionMode,language, format, subscriptionKey) {
			//alert("=======SDK1========"+SDK+"======RecognitionMode=1======"+recognitionMode+"======language1========"+language+"=====format1======="+format+"=======subscriptionKey=1====="+subscriptionKey);

		 // debugger;
		  //alert("=======SDK======="+SDK);
		language ="en-IN";
		format = "Simple";
		subscriptionKey= "3c2d716e86e04527bcc73d6fb45eef78";
		  var recognizerConfig = new SDK.RecognizerConfig(
			  new SDK.SpeechConfig(
				  new SDK.Context(
					  new SDK.OS(navigator.userAgent, "Browser", null),
					  new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
			  recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation>)
			  language, // Supported laguages are specific to each recognition mode. Refer to docs.
			  format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)
		//  console.log("====rammm===11===="+navigator.userAgent);
		//  console.log("====rammm===12===="+1.0.00000);

		  // Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
		  var authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

		  return SDK.CreateRecognizer(recognizerConfig, authentication);
		}

		Initialize(function (speechSdk) {
			SDK = speechSdk;
			console.log(SDK);
			/*startBtn.disabled = false;*/
		});

		function OnComplete() {
		   // debugger;
		   /* startBtn.disabled = false;
			stopBtn.disabled = true;*/
			//$(".fa-microphone").removeClass('fa-microphone').addClass('fa fa-microphone');
			
		}
		function UpdateStatus(status) {
		//	  alert("=====yyyy======");
			//  alert("=======Ram========"+status);
			//status = status;
		}
		function OnSpeechEndDetected() {
			 // alert("=====tttt======");
		  /*  stopBtn.disabled = true;*/
			//$(".fa-microphone").removeClass('fa-microphone').addClass('fa fa-microphone');
		}

		function UpdateRecognizedPhrase(json) {
			//  alert("=====json======"+json);
			// phraseDiv.innerHTML = json;
		}
		function UpdateRecognizedHypothesis(text) {
			// chatsentence.innerHTML = text;
		 //   alert("=====UpdateRecognizedHypothesis======"+text);
			 //$("#chatsentence").val(text);
			 console.log(text);
			 hyptext=text;
			 /*if(hyptext != '' )
				hyptext+=' '+text;
			 else 
				 hyptext += text;*/
		 }
		$(document).on('touchstart mousedown ', '#startBtn', function () { 
			if (!recognizer || previousSubscriptionKey != value) {
				  previousSubscriptionKey = value;

				  Setup();
			  }

			/*  chatsentence.innerHTML = "";
			  phraseDiv.innerHTML = "";
			*/
			hyptext='';
			  RecognizerStart(SDK, recognizer);
			 $(this).addClass('hover_effect');
			/*  startBtn.disabled = true;
			  stopBtn.disabled = false;*/
			
		});
		$(document).on('touchend mouseup ', '#startBtn', function () { 
			RecognizerStop(SDK, recognizer);
			$(this).removeClass('hover_effect');
		});
		/*
		var client;
		var key = {};
		var languageOptions = {};
		var formatOptions = {};
		var recognitionMode = {};
		var inputSource = {};
		inputSource.value = "Microphone";
		recognitionMode .value= "Interactive";
		formatOptions.value = "Simple";
		languageOptions.value="en-IN";
		key.value = "3c2d716e86e04527bcc73d6fb45eef78";
		//var languageoptions = document.getElementById("languageoptions");
		var speechActivity = document.getElementById("speechActivity");
		var networkActivity = document.getElementById("networkActivity");

		
		function getKey() {
			return key.value;
		}

		function getLanguage() {
			return languageOptions.value;
		}

		function setText(text) {
			document.getElementById("output").value += text + "\n";
		}

		function start() {
			//document.getElementById("startBtn").disabled = true;
			//document.getElementById("stopBtn").disabled = false;
			client.startMicAndContinuousRecognition();
		}

		function stop() {
			//document.getElementById("startBtn").disabled = false;
			//document.getElementById("stopBtn").disabled = true;
			client.endMicAndContinuousRecognition();
		}

		function createAndSetupClient() {
			//document.getElementById("startBtn").disabled = false;

			if (client) {
				stop();
			}

			client = new BingSpeech.RecognitionClient(getKey(), getLanguage());

			client.onFinalResponseReceived = function (response) {
				//setText(response);
				alert(response);
				console.log(response);
			}

			client.onError = function (code, requestId) {
				console.log("<Error with request n°" +code+"-"+ requestId + ">");
			}

			client.onVoiceDetected = function () {
				console.log("Voice detect");
				//speechActivity.classList.remove("hidden");
			}

			client.onVoiceEnded = function () {
				console.log("Voice End");
				//speechActivity.classList.add("hidden");
			}

			client.onNetworkActivityStarted = function () {
				console.log("Nw detect");
				//networkActivity.classList.remove("hidden");
			}

			client.onNetworkActivityEnded = function () {
				console.log("NW end");
				//networkActivity.classList.add("hidden");
			}
		}
		$(document).on('touchstart mousedown ', '#startBtn', function () { 
			start();
			
		});
		$(document).on('touchend mouseup ', '#startBtn', function () { 
			stop();
			
		});
		createAndSetupClient();*/
    })

    .controller('ChatCtrl', function ($scope, $rootScope,TemplateService, NavigationService, $timeout,$http,apiService,$state,$uibModal,Menuservice,$sce,$interval,Idle,$window,$filter,$stateParams,rememberMeService,$cookies,myCache,$location) {
        $scope.orientation = "";
        $rootScope.autocompletelist = [];
        $rootScope.chatOpen = false;
        $rootScope.showTimeoutmsg = false;
        $rootScope.firstMsg=false;
        $rootScope.chatmsg = "";
        $rootScope.chatmsgid = "";
        $rootScope.msgSelected = false;
        $rootScope.faqviewbtn = "View More";
        $rootScope.gotsession=false;
        var mylist = $.jStorage.get("chatlist");
		console.log($location.search().uid);
        $scope.callsession = function() {
            apiService.get_session({user_id:$rootScope.userid}).then(function (response) {
                $rootScope.session_id = response.data.session_id;
                $rootScope.session_object = response.data;
                $rootScope.gotsession=true;
            }).catch(function(reason){
                console.log(reason);
                $scope.callsession();
            });
        };
        $scope.getsessiondata = function() {
            apiService.getsessiondata({data:$.jStorage.get('accesstoken')}).then(function (response){
                if(response.data.data) {
                    if(response.data.data.appname)
                        $rootScope.selectedapp = true;
                    $rootScope.appname = response.data.data.appname;
                    $rootScope.appid = response.data.data.appid;
                    $rootScope.app_id = response.data.data.app_id;
                    $rootScope.dashboardurl = response.data.data.dashboardurl;
                    $rootScope.backendurl = response.data.data.backendurl;
                    $rootScope.sessionid = response.data.data.sessionid;
                    $rootScope.userid = response.data.data.userid;
                    $scope.callsession();
                    if(response.data.data.qticket)
                        $rootScope.qticket=response.data.data.qticket;
					$rootScope.isLoggedin = true;
					if(!mylist || mylist == null)
						$rootScope.chatlist = [];
					else
					{
						$rootScope.chatlist = $.jStorage.get("chatlist");
						//$rootScope.chatlist = mylist;
					}
					if(!response.data.data.iscookie) {
						$rootScope.qticket='';
						var formData = { userid:$rootScope.userid,token:$.jStorage.get('accesstoken') };
						apiService.getnewticket(formData).then(function (callback){
							if(callback.data.value)
							{
								//$scope.logout();
								$.jStorage.set("chunk",callback.data.data.chunk);
								$.jStorage.set("Ticket",callback.data.data.chunk.Ticket);
								$rootScope.qticket = callback.data.data.chunk.Ticket;
								if(!mylist || mylist == null)
									$rootScope.chatlist = [];
								else
								{
									$rootScope.chatlist = $.jStorage.get("chatlist");
									//$rootScope.chatlist = mylist;
								}
								//location.reload();
								$timeout(function(){
									$scope.useticket();
								},5000);
								
							}
							$timeout(function(){
								if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
									$rootScope.showChatwindow();
							},1000);
						});
					}
                    
                }
                else {
                    $scope.logout();
                }
            }).catch(function (reason) {
                console.log(reason);
                if(reason.status==403) {
                    $scope.logout();
                }
                else
                    $scope.getsessiondata();
            });
        };
		$scope.at = $.jStorage.get('accesstoken');
        if($scope.at && !$rootScope.gotsession) {
            $scope.getsessiondata();
        }
        $scope.activatechattab = function() {
			$scope.chat_tab = 1;
		};
        
		var voiceenabled = $.jStorage.get("voiceenabled");
		if(!voiceenabled || voiceenabled == null)
		{
            $rootScope.voiceenabled = true;
			$.jStorage.set("voiceenabled",true);
        }
		else
        {
            $rootScope.voiceenabled = $.jStorage.get("voiceenabled");
            
        }
		$rootScope.changevoicestatus = function(){
			if($rootScope.voiceenabled)
			{
				$.jStorage.set("voiceenabled",false);
				$rootScope.voiceenabled=false;
			}
			else
			{
				$.jStorage.set("voiceenabled",true);
				$rootScope.voiceenabled=true;
			}
		};
        //var mylist = [];
        
        $rootScope.autolistid="";
        $rootScope.autolistvalue="";
        $rootScope.showMsgLoader=false;
        $rootScope.rate_count= 0;
        $scope.formSubmitted = false;
        $scope.loginerror=0;
        $rootScope.qticket="";
        $rootScope.isLoggedin = false;
        $rootScope.selectedapp = false;
        $rootScope.appname = "";
        $rootScope.appid = "";
        $rootScope.app_id = "";
        $rootScope.backendurl = "";
        $rootScope.lastloginobj= {};
        $rootScope.lastlogindate = "";
		$rootScope.dashboardurl = "";
		$scope.iscookie = "";
		$rootScope.chatlist = [];
        if($rootScope.qticket)
            $rootScope.qticket = $rootScope.qticket;
        angular.element(document).ready(function(){
			// console.log(rememberMeService('X-Qlik-Session'));
			/*if($.jStorage.get("isLoggedin"))
			{
				$rootScope.isLoggedin = true;
				if(!mylist || mylist == null)
					$rootScope.chatlist = [];
				else
				{
					$rootScope.chatlist = $.jStorage.get("chatlist");
					//$rootScope.chatlist = mylist;
				}
			}*/
			/*if($.jStorage.get("isLoggedin"))
			{
				$rootScope.isLoggedin = true;
				$timeout(function(){
					$scope.iscookie = $scope.getcookie('X-Qlik-Session');
					// console.log($scope.iscookie);
					if($scope.iscookie) {
						if(!mylist || mylist == null)
							$rootScope.chatlist = [];
						else
						{
							$rootScope.chatlist = $.jStorage.get("chatlist");
							//$rootScope.chatlist = mylist;
						}
						$timeout(function(){
							if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
								$rootScope.showChatwindow();
						},1000);
						
					}
						
					else
					{
						$rootScope.qticket='';
						console.log("qlk ses");
						var formData = { userid:$rootScope.userid,token:$.jStorage.get('accesstoken') };
						apiService.getnewticket(formData).then(function (callback){
							if(callback.data.value)
							{
								//$scope.logout();
								$.jStorage.set("chunk",callback.data.data.chunk);
								$.jStorage.set("Ticket",callback.data.data.chunk.Ticket);
								$rootScope.qticket = callback.data.data.chunk.Ticket;
								if(!mylist || mylist == null)
									$rootScope.chatlist = [];
								else
								{
									$rootScope.chatlist = $.jStorage.get("chatlist");
									//$rootScope.chatlist = mylist;
								}
								//location.reload();
								$timeout(function(){
									$scope.useticket();
								},5000);
								
							}
							$timeout(function(){
								if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
									$rootScope.showChatwindow();
							},1000);
						});
						
					}
					
					
				});
			}
			else {
				$timeout(function(){
					if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
						$rootScope.showChatwindow();
				},1000);
			}*/
			$timeout(function(){
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
					$rootScope.showChatwindow();
			},1000);
		});
        if($rootScope.selectedapp)
        {
            $rootScope.selectedapp = $rootScope.selectedapp;
            $rootScope.appname = $rootScope.appname;
            $rootScope.appid = $rootScope.appid;
            $rootScope.app_id = $rootScope.app_id;
            $rootScope.dashboardurl = $rootScope.dashboardurl;
            $rootScope.backendurl = $rootScope.backendurl;
            
            // $.jStorage.set("selectedapp",$rootScope.selectedapp);
            // $.jStorage.set("appname",$rootScope.appname);
            // $.jStorage.set("appid",$rootScope.appid);
            // $.jStorage.set("app_id",$rootScope.app_id);
            // $.jStorage.set("dashboardurl",$rootScope.dashboardurl);
        }
        
        $rootScope.getdatetime1=function(dtobj){
            var dt = new Date(dtobj.createdAt);
            var date = dt.getDate();
            var month = dt.getMonth();
            var year = dt.getFullYear();
            month= month+1;
            if (month.toString().length == 1) {
                month = "0" + month
            }
            if (date.toString().length == 1) {
                date = "0" + date
            }
            logindatetime= date.toString() + "-" + month.toString() + "-" +year.toString();
            h = dt.getHours();
            m = dt.getMinutes();
            s = dt.getSeconds();
            return(logindatetime+" "+h+":"+m+":"+s);
        };
        if($.jStorage.get("lastloginobj"))
        {
            $rootScope.lastlogindate = $rootScope.getdatetime1($.jStorage.get("lastloginobj"));
        }
		
		
		 var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
		$scope.uname = "";
		$scope.upwd = "";
		$scope.getcookie = function(c_name) {
			var abc=null;
			/*if (document.cookie.length > 0)
            {
                
                c_start = document.cookie.indexOf(c_name + "=");
                
                if (c_start != -1)
                {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1)
                        c_end = document.cookie.length;
                    //console.log(unescape(document.cookie.substring(c_start,c_end)),"coooooooo");
                    //resolve(unescape(document.cookie.substring(c_start,c_end)));
                    return unescape(document.cookie.substring(c_start,c_end));
                    //this.token= unescape(document.cookie.substring(c_start,c_end));
                }
                
            }
			else 
				return abc;*/
			var cookies = document.cookie.split(';');
			for(var i=0 ; i < cookies.length ; ++i) {
				var pair = cookies[i].trim().split('=');
				console.log(pair);
				console.log(cookies[i]);
				//if(pair[0] == c_name)
				for(var j = 0 ; j< pair.length;j++)
				{
					if(pair[j]=='qliksenseprod1.mahindra.com|utmccn')
						return pair[j];
				}
			}
			return null;
		};
        angular.element(document).ready(function(){
			var ucached=myCache.get('7ZXYZ_L');
            if(!angular.isUndefined(ucached)) {
				u=ucached;
				var pcached=myCache.get('UU_90');
				if(!angular.isUndefined(pcached)) {
					
				}
				p = Base64.decode(pcached);
				
				$timeout(function(){
					abc = u.replace(/\s*$/,"");
					//abc=u.trim();
					$scope.uname = abc;
					$scope.upwd = p;
					$("#username2").val("");
					$("#username2").val(abc);
					$("#userpassword2").val(p)
				},1000);
			}
			else {
				
			}
			/*
			if (rememberMeService('7ZXYZ@L') ) {
				//u = Base64.decode(rememberMeService('7ZXYZ@L'));
				u=rememberMeService('7ZXYZ@L');
				
				p = Base64.decode(rememberMeService('UU@#90'));
				
				$timeout(function(){
					abc = u.replace(/\s*$/,"");
					//abc=u.trim();
					$scope.uname = abc;
					$("#username2").val("");
					$("#username2").val(abc);
					$("#userpassword2").val(p)
				},1000);
				
				;
				
			}
			else
				console.log("none");*/
		});
		$scope.rememberMe = function (u,p) {
			if ($('.rememberme').prop('checked')) {
				myCache.putkey('7ZXYZ_L', u);
				myCache.putkey('UU_90', Base64.encode(p));
				//rememberMeService('7ZXYZ@L', u);
				//rememberMeService('UU@#90', Base64.encode(p));
			} else {
				myCache.putkey('7ZXYZ_L', '');
				myCache.putkey('UU_90', '');
				//rememberMeService('7ZXYZ@L', '');
				//rememberMeService('UU@#90', '');
			}
		};
		$scope.loginpress = false;
        $scope.login = function(username,password)
        {
			$scope.loginerror=0;
			$scope.loginpress = true;
            $scope.formData = {username:username,password:(password)};
            if(username == 'palaash')
			{
				$scope.loginerror = -1;
				$scope.loginpress = false;
			}
			else {
				
			
				apiService.login($scope.formData).then(function (callback){
					$.jStorage.flush();
					//if(username == "admin@exponentiadata.com" && password == "admin")
					if(callback.data.value)
					{
						$scope.loginpress = false;
						$rootScope.voiceenabled = true;
                        $.jStorage.set("voiceenabled",true);
                        $.jStorage.set("accesstoken", callback.data.data.token);
						// $.jStorage.set("id", callback.data.data._id);
						$.jStorage.set("fname", callback.data.data.fname);
						// $.jStorage.set("lname", callback.data.data.lname);
						// $.jStorage.set("email", callback.data.data.email);
						// $.jStorage.set("branch", callback.data.data.branch);
						// $.jStorage.set("access_role", callback.data.data.accessrole);
						// $.jStorage.set("userid", callback.data.data.userid);
						// $.jStorage.set("sessionid", callback.data.data._id);
						$.jStorage.set("isLoggedin", true);
						// $.jStorage.set("chunk",callback.data.data.chunk);
						// $.jStorage.set("Ticket",callback.data.data.chunk.Ticket);
						// $.jStorage.setTTL("isLoggedin", 1800000);
                        $.jStorage.set("lastloginobj",callback.data.data.last_login);
                        $rootScope.userid=callback.data.data.userid;
                        $rootScope.sessionid=callback.data.data._id;
						$rootScope.lastloginobj = callback.data.data.last_login;
						$rootScope.lastlogindate=$rootScope.getdatetime1($rootScope.lastloginobj);
						$rootScope.qticket = callback.data.data.chunk.Ticket;
						$scope.selectApp();
						$rootScope.chatlist=[];
						$rootScope.isLoggedin = true;
						$rootScope.firstMsg = true;  
                        $rootScope.gotsession=true;
                        $scope.callsession();
						/*$scope.$on('IdleStart', function() {
							// the user appears to have gone idle
							//Idle.setIdle(10);
							//Idle.watch();
							console.log("Idle started");
						});*/
						//setTimeout(function(){$('#userMsg').focus();}, 500);
						//location.reload();
						//if(!$rootScope.firstMsg)
						{
							msg = {Text:"Hi "+$.jStorage.get("fname")+", How may I help you ?",type:"SYS_FIRST"};
							$rootScope.pushSystemMsg(0,msg);  
						}
						
						$timeout(function(){
							$scope.useticket();
						},5000);
						// $.ajax({
						//     url: 'https://corp.mahindra.com/qrs/users/full?Xrfkey=123456789ABCDEFG',
						//     dataType: "json",
						//     //async: true,
						//     //cache: false,
						//     timeout: 3000,
						//     headers: { 
						//         'X-Qlik-Xrfkey':'123456789ABCDEFG',
						//         'X-Qlik-User':'UserDirectory= BONTONCHAT; UserId=sa_repository',
						//         'Content-Type':'application/json',
						//     },
						//     type: "GET",
						//     success: function (data) {
						//         console.log(data,"crm");
								
						//     },
						// });
					}
					else 
					{
						//callback.data.error.message == -1)
						$scope.loginerror = -1;
						$scope.loginpress = false;
					}
				}).catch(function (reason) {
					$scope.loginpress = false;
				});
			}
        };
        $scope.useticket = function() {
            $(".hide_extension").html("<div class='demo_ext'><object id='' data='https://qliksenseprod1.mahindra.com:443/extensions/Interaction_1/Interaction_1.html?qlikTicket="+$rootScope.qticket+"' class='framechart'></object></div>");
        };
        $rootScope.getmeasure = function(kpi,app_name) {
            var appname = $rootScope.appname;
            if($rootScope.appname=='')
                alert("Please select app to continue");
            else if (app_name !== appname) {
                alert("Please select app "+app_name);
            }
            else 
            {
                $rootScope.chatlist.push({id:"id",msg:kpi,position:"right",curTime: $rootScope.getDatetime()});
                
                formData = {"appname":appname,kpi:kpi};
                apiService.getmeasure(formData).then(function (response){
                    var msg = {type:"SYS_MEASURE",measuredata:response.data.data,appname:appname};
                    $rootScope.pushSystemMsg(0,msg);
                    $rootScope.scrollChatWindow();
                });
            }
        };
        $rootScope.getkpi = function() {
			$scope.activatechattab();
            var appname = $rootScope.appname;
            if($rootScope.appname=='')
                alert("Please select app to continue");
            else 
            {
                /*
                formData = {"appname":appname};
                apiService.getkpi(formData).then(function (response){
                    var msg = {type:"SYS_KPI",kpidata:response.data.data,appname:appname};
                    $rootScope.pushSystemMsg(0,msg);
                    $rootScope.scrollChatWindow();
                });*/
				$rootScope.pushMsg("","kpi",$rootScope.backendurl);
            }
        };
        $rootScope.getquery = function(measure,app_name){
            var appname = $rootScope.appname;
            if($rootScope.appname=='')
                alert("Please select app to continue");
            else if (app_name !== appname) {
                alert("Please select app "+app_name);
            }
            else 
            {
                
                formData = {"appname":appname,measure:measure};
                $rootScope.chatlist.push({id:"id",msg:measure,position:"right",curTime: $rootScope.getDatetime()});
                apiService.getquery(formData).then(function (response){
                    var msg = {type:"SYS_KPIQUERY",querydata:response.data.data,appname:appname};
                    $rootScope.pushSystemMsg(0,msg);
                    $rootScope.scrollChatWindow();
                });
            }
        };
        $rootScope.sendquery = function(query,app_name){
            var appname = $rootScope.appname;
            if($rootScope.appname=='')
                alert("Please select app to continue");
            else if (app_name !== appname) {
                alert("Please select app "+app_name);
            }
            else 
            {
                $rootScope.pushMsg(0,query.query,$rootScope.backendurl);
            }
        };
        $rootScope.$viewmodalInstance4 = {};
        $rootScope.selectapperror = 0;
        $rootScope.selectappSuccess = 0;
        $scope.selectApp = function () {
            formData = {"userid":$rootScope.sessionid};
            apiService.selectapp(formData).then(function (callback){
                if(callback.data.value)
                {
					if(callback.data.data.length == 1)
					{
						$rootScope.getApp(callback.data.data[0],1);
						
					}
					else {
						$rootScope.$viewmodalInstance4 = $uibModal.open({
							scope: $rootScope,
							animation: true,
							size: 'sm',
							templateUrl: 'views/modal/selectapp.html',
							resolve: {
								items: function () {
								return callback.data.data;
								}
							},
							controller: 'ViewappCtrl'
						});
					}
                }
            });
        };
        $rootScope.selectappCancel = function() {
            //console.log("dismissing");
            $rootScope.$viewmodalInstance4.dismiss('cancel');
        };
        $rootScope.getApp = function(appdata,direct) {
            //console.log(appdata);
            $rootScope.selectedapp = true;
            $rootScope.appname = appdata.appname;
            $rootScope.appid = appdata.appid;
            $rootScope.app_id = appdata._id;
            $rootScope.dashboardurl = appdata.dashboardurl;
            $rootScope.backendurl = appdata.backendurl;
            //$.jStorage.set("selectedapp",$rootScope.selectedapp);
            //$.jStorage.set("appname",$rootScope.appname);
            //$.jStorage.set("appid",$rootScope.appid);
            //$.jStorage.set("app_id",$rootScope.app_id);
            //$.jStorage.set("dashboardurl",$rootScope.dashboardurl);
            //$.jStorage.set("backendurl",$rootScope.backendurl);
            
            if(direct == 0)
				$rootScope.selectappCancel();
            apiService.getfullautocomplete({appname:$rootScope.appname,appid:$rootScope.appid,app_id:$rootScope.app_id,dashboardurl:$rootScope.dashboardurl,backendurl:$rootScope.backendurl}).then(function (response){
                $rootScope.fullautolist = response.data.data;
                $.jStorage.set("fullautolist",$rootScope.fullautolist);
                if(response.data.data.length > 0)
                    $scope.openQueries(response.data.data,$rootScope.appname);
            });
		/*	if(direct == 1)
			{
				$timeout(function(){
					$rootScope.getSystemMsg(0,"product filter",$rootScope.backendurl);
				},5000);
				
			}
			*/
        };
        $scope.loaded=function (){
            alert("Loaded");
        };
		$scope.promise = {};
        if($rootScope.isLoggedin) {
            $scope.promise=$interval(function(){
                var formData = { userid:$rootScope.userid,token:$.jStorage.get('accesstoken') };
                if($rootScope.isLoggedin) {
                    apiService.getnewticket(formData).then(function (callback){
                        if(callback.data.value)
                        {
							$scope.logout();
                            /*$.jStorage.set("chunk",callback.data.data.chunk);
                            $.jStorage.set("Ticket",callback.data.data.chunk.Ticket);
                            $rootScope.qticket = callback.data.data.chunk.Ticket;
                            //location.reload();
                            $timeout(function(){
                                $scope.useticket();
                            },5000);*/
                        }
                    });
                }
            },1500000);
        }
		$scope.$on('$destroy', function () {
		  $interval.cancel($scope.promise);
		});
        $scope.openQueries = function(fullautolist,app_name) {
			$scope.activatechattab();
            msg = {type:"SYS_QUES",fullautolist:fullautolist,appname:app_name};
            $rootScope.pushSystemMsg(0,msg);
            $rootScope.scrollChatWindow();
        };
        $scope.showtopqueries = function(top_q,app_name){
			$scope.activatechattab();
            msg = {top_q:top_q,type:"SYS_TOPQUES",appname:app_name};
            $rootScope.pushSystemMsg(0,msg);
            $rootScope.scrollChatWindow();
        };
        $scope.openTopQueries = function() {
			$scope.activatechattab();
            apiService.topqueries({appname:$rootScope.appname}).then(function (response){
                $rootScope.topqueries = response.data.data;
                $scope.showtopqueries(response.data.data,$rootScope.appname);
            });
        };
        $scope.getfaqans=function(ques,index,app_name){
            if(app_name == $rootScope.appname)
                $rootScope.pushMsg(index,ques,$rootScope.backendurl);
            else
                alert("Please select app "+app_name);
        };
        $scope.ttl = function() {
            ttl = $.jStorage.getTTL("isLoggedin");
            if(ttl <= 0)
                $scope.logout();
        };
		/*
        $interval(function(){
            $scope.ttl();
        }, 300000);*/
        // $interval(function(){
        //     $rootScope.scrollChatWindow();
        // },5000);
        angular.element(document).ready(function(){
			
			if($rootScope.isLoggedin)
			{
				//alert("Ticket:",$rootScope.qticket);
				
				
			}
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				
				
				/*if($rootScope.browser == 'android' )
				{
					$(document).on('click',"#username",function(){  
						//$("#login_form").css('zoom','2');
						$("#login_form").prompt();
						$("#login_form").trigger('click');
						//$("#login_form").css('transform', 'scale(2)' );
					});
					$(document).on('blur','#username', function() {
						$("#login_form").css('zoom','1');
						$("#login_form").css('transform', 'scale(1)' );
					});
					$(document).on('click',"#userpassword",function(){  $("#login_form").css('zoom','2');  });
					
					$(document).on('blur','#userpassword', function() {
						$("#login_form").css('zoom','1');
					});
					$(document).on('focus',"#userpassword",function(){
						document.body.scrollTop=$(this).offset().top;
					});
					window.addEventListener("resize", function() {
					  if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
						 window.setTimeout(function() {
							document.activeElement.scrollIntoViewIfNeeded();
						 },0);
					  }
				   });
				}*/
                $scope.panelheight = $(window).height()-10;
                //$scope.chatpanelheight = $(".chat_window_1").height()-45-100;
                
            }
            $scope.panelheight = $(window).height()-10;
        });
        
        /*
        function displayTranscript() {
            vm.transcript = $rootScope.transcript;
            console.log("transcript",$rootScope.transcript);
            $(".chatinput").val($rootScope.transcript);
            //This is just to refresh the content in the view.
            if (!$scope.$$phase) {
                $scope.$digest();
                console.log("transcript",$rootScope.transcript);
            }
        }*/
        // function displayTranscript() {
        //     vm.transcript = $rootScope.transcript;
        //     $(".chatinput").val($rootScope.transcript);
        //     console.log("Speech",$rootScope.transcript);
        //     //This is just to refresh the content in the view.
        //     if (!$scope.$$phase) {
        //         $scope.$digest();
        //     }
        // }
        
        $rootScope.saveBookmark = function(name) {
            chatlistarr = Array();
            $.each($("input[name='formailing[]']:checked"), function(k,v) {
                //values.push($(this).val());
                // var imgname = 'scr'+$(this).val()+'.png';
                var node = document.getElementById('scr'+$(this).val());
                // var div="#scr"+$(this).val();
                //var div="#chat_window_1";
                //console.log(div);
                var chatlist = $.jStorage.get("chatlist");
                var chatobj = chatlist[$(this).attr('data-index')];
                var chat_ind =_.findIndex(chatlist, function(o) { return (o.msg == chatobj.msg.prevmsg && o.position=='right'); });
                chatlistarr.push(chatlist[chat_ind]);
                $rootScope.bookmarkCancel();
                if($("input[name='formailing[]']:checked").length == (k+1))
                {
                    
                    $scope.formData = {name:name,chatlist:chatlistarr,userid:$rootScope.sessionid};
            
                    apiService.savebookmark($scope.formData).then(function (callback){
                        if(callback.data.value)
                        {
                            $(".savebookmarktext").val("");
                            
                            alert("Saved Successfully");
                        }
                    });
                }
            });
        };
        $rootScope.deleteBookmark = function(selected) {
			
             $scope.formData = {userid:$rootScope.sessionid,selected:selected._id};
            apiService.deletebookmark($scope.formData).then(function (callback){
                //console.log(callback.data.data.chatlist);
                if(callback.data.data)
                {
                    // _.forEach(callback.data.data.chatlist,function(value,key){
                        
                    //     if(value.position == "right")
                    //     {
                    //         $rootScope.appendMsg(value.msg.id,value.msg);
                    //     }
                    //     if(value.position == "left" && value.msg.type != "SYS_FIRST")
                    //         $rootScope.appendSysMsg(value.msg.id,value.msg);
                    // });
                    $rootScope.deletebookmarkCancel();
                }
            });
        };
        $rootScope.getBookmark = function(selected) {
            $scope.formData = {userid:$rootScope.sessionid,selected:selected._id};
			$rootScope.selectbookmarkCancel();
            apiService.getbookmark($scope.formData).then(function (callback){
                //console.log(callback.data.data.chatlist);
                if(callback.data.data)
                {
                    var firstload = true;
                    var chat_list = _.remove(callback.data.data.chatlist, function(n) {
                        return n.position  == 'right';
                    });
                    //console.log(chat_list);
                    _.forEach(chat_list,function(value,key){
                        if(firstload) {
                            if(value.position == "right")
                            {
                                $rootScope.appendMsg(value.id,value.msg,value.backend_url);
                                var b_d = chat_list;
                                b_d.shift();
                                if(b_d.length > 0)
                                    $.jStorage.set("bookmarkdata",b_d);
                                firstload = false;
                                // $rootScope.chatmsgid = value.msg.id;
                                // $rootScope.chatmsg = value.msg;
                                // $rootScope.autocompletelist = [];
                                // $rootScope.chatlist.push({id:"id",msg:value.msg,position:"right",curTime: $rootScope.getDatetime()});
                                // //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
                                // $.jStorage.set("chatlist",$rootScope.chatlist);
                                // ret=$rootScope.getSystemMsg(value.msg.id,value.msg);
                                // $rootScope.msgSelected = false;
                                // $rootScope.scrollChatWindow();
                                // console.log(ret);
                                // if(ret)
                                //     return true;
                            }
                        }
                        // if(value.position == "left" && value.msg.type != "SYS_FIRST")
                        //     $rootScope.appendSysMsg(value.msg.id,value.msg);
                    });
                    
                }
            });
        };
        $rootScope.sendMail = function(emails,texts,subjecttext) {
            //var values = new Array();
			
            var emailist = "pratik.shah429@gmail.com";
            var imgarr = new Array();
            var m_html = "";
            var isdone=false;
            
            $.each($("input[name='formailing[]']:checked"), function(k,v) {
                //values.push($(this).val());
                // var imgname = 'scr'+$(this).val()+'.png';
                var node = document.getElementById('scr'+$(this).val());
                // var div="#scr"+$(this).val();
                //var div="#chat_window_1";
                
                var urls = JSON.parse($(this).val());
				console.log(urls.length);
				for(var j = 0; j <= urls.length-1; j++) {
					imgarr.push(urls[j]);
				}
                //imgarr.push($(this).val());
                if($("input[name='formailing[]']:checked").length == (k+1))
                {
                    isdone = true;
                    //m_html += "</body></html>";
            
                    var formData = {Ticket:$rootScope.qticket,email:emails,text:texts,subject:subjecttext,bodytag:m_html,images:imgarr,userid:$rootScope.userid};
                    //console.log(formData);
                    apiService.sendmail(formData).then(function (callback){
                        
                    });
                    $rootScope.mailmodalCancel();
                }
                angular.element(document).ready(function(){
                    window.onbeforeunload = function () {
                        alert( "Do you really want to close?");
                    };
                });
                // angular.element(document).ready(function(){
                    
                //     domtoimage.toPng(node)
                //     .then(function (dataUrl) {
                //         imgarr.push(dataUrl);
                //         m_html += "<img src='"+(dataUrl)+"'>";
                //         console.log(m_html);
                //         if($("input[name='formailing[]']:checked").length == (k+1))
                //         {
                //             isdone = true;
                //             //m_html += "</body></html>";
                    
                //             var formData = {email:emails,text:texts,bodytag:m_html,images:imgarr};
                //             console.log(formData);
                //             apiService.sendmail(formData).then(function (callback){
                                
                //             });
                //             $rootScope.mailmodalCancel();
                //         }
                //     })
                //     .catch(function (error) {
                //         console.error('oops, something went wrong!', error);
                //     });
                // });
                // $(div).html2canvas({
                //     onrendered: function (canvas) {
                // angular.element(document).ready(function () {
                //     divid='#scr'+$(this).val();
                //     //var body = $(div+" object").contents().find('body');
                //     // $timeout(function(){
                //     //     var chatHeight = $("ul.chat").height();
                //     //     $('.panel-body').animate({scrollTop: $(divid).offset().top});
                //     // });
                //     domtoimage.toPng(node)
                //     .then(function (dataUrl) {
                //         imgarr.push(dataUrl);
                //         m_html += "<img src='"+(dataUrl)+"'>";
                //         //console.log(m_html);
                //         if($("input[name='formailing[]']:checked").length == (k+1))
                //         {
                //             isdone = true;
                //             //m_html += "</body></html>";
                    
                //             var formData = {email:emails,text:texts,bodytag:m_html,images:imgarr};
                //             console.log(formData);
                //             apiService.sendmail(formData).then(function (callback){
                                
                //             });
                //             $rootScope.mailmodalCancel();
                //         }
                //     })
                //     .catch(function (error) {
                //         console.error('oops, something went wrong!', error);
                //     });
                //     // $(body).html2canvas(   {
                //     //     onrendered: function( canvas ) {
                            
                //     //         imgarr.push(canvas.toDataURL("image/png"));
                //     //         m_html += "<img src='"+(canvas.toDataURL("image/png"))+"'>";
                //     //         //console.log(m_html);
                //     //         if($("input[name='formailing[]']:checked").length == (k+1))
                //     //         {
                //     //             isdone = true;
                //     //             //m_html += "</body></html>";
                        
                //     //             var formData = {email:emails,text:texts,bodytag:m_html,images:imgarr};
                //     //             console.log(formData);
                //     //             apiService.sendmail(formData).then(function (callback){
                                    
                //     //             });
                //     //             $rootScope.mailmodalCancel();
                //     //         }
                //     //     }
                //     // });
                // });
            });
            
        };
        $rootScope.scrollChatWindow = function() {
            $timeout(function(){
                var chatHeight = $("ul.chat").height();
                $('.panel-body').animate({scrollTop: chatHeight});
            });
        };
        $scope.iframeLoadedCallBack = function(event){
            // do stuff
            console.log("Done");
            $rootScope.scrollChatWindow();
            
        };
        window.uploadDone=function(){
            /* have access to $scope here*/
            console.log("Done");
            $rootScope.scrollChatWindow();
        }
        $rootScope.iframeHeight = window.innerHeight-53;
        
        $rootScope.getDatetime = function() {
            //return (new Date).toLocaleFormat("%A, %B %e, %Y");
            return currentTime = new Date();
        };
        $rootScope.chatText = "";
        $rootScope.getAutocomplete = function(chatText) {
            
            $rootScope.chatText = chatText;
            if($(".chatinput").val() == "" || $(".chatinput").val() == null) {
                    $rootScope.autocompletelist = [];
                console.log("null");
            }
            else {
                $rootScope.chatdata = { string:$rootScope.chatText,appname:$rootScope.appname};
                apiService.getautocomplete($rootScope.chatdata).then(function (response){
                       // console.log(response.data);
                    $rootScope.autocompletelist = response.data.data;
                });
            }
        };
        window.frameloaded = function() {
            console.log("Frame Loaded");
        };
        function frameloaded() {
            console.log("Frame Loaded");
        }
        $rootScope.pushSystemMsg = function(id,value) {
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.chatlist.push({id:"id",msg:value,position:"left",curTime: $rootScope.getDatetime(),backend_url:$rootScope.backendurl});
            $.jStorage.set("chatlist",$rootScope.chatlist);
            $timeout(function(){
                $rootScope.scrollChatWindow();
                // if(document.activeElement)
                // {
                //     document.activeElement.blur();
                // }
                // $('.panel-body').stop().animate({
                //     scrollTop: $('.panel-body')[0].scrollHeight
                // }, 800);
            },5000);
            $timeout(function(){
                $rootScope.autocompletelist = [];
            },500);
            // function focusit(){
            //     if(document.activeElement)
            //     {
            //         document.activeElement.blur();
            //     }
            // }
            // setInterval(focusit, 100);
            // $timeout(function(){
            //     if(document.activeElement)
            //     {
            //         document.activeElement.blur();
            //     }
            // }, 100);
        };
        $scope.logout = function()
        {
			$timeout(function(){
				$(".chatinput").val("");
				$rootScope.autocompletelist = [];
				$rootScope.chatText="";
			},1000);
			$scope.activatechattab();
            $scope.formData = {sessionid:$rootScope.sessionid,user:$rootScope.sessionid};
            apiService.logout($scope.formData).then(function (callback){
                $.jStorage.flush();
                $rootScope.isLoggedin = false;
                $rootScope.chatlist = [];
                $.jStorage.set("showchat",false);
                $rootScope.chatOpen = true;
				var ucached=myCache.get('7ZXYZ_L');
				if(!angular.isUndefined(ucached)) {
					u=ucached;
					var pcached=myCache.get('UU_90');
					if(!angular.isUndefined(pcached)) {
						
					}
					p = Base64.decode(pcached);
					
					$timeout(function(){
						abc = u.replace(/\s*$/,"");
						//abc=u.trim();
						$scope.uname = abc;
						$scope.upwd = p;
						$("#username2").val("");
						$("#username2").val(abc);
						$("#userpassword2").val(p)
					},1000);
				}
				else {
					
				}
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
					$timeout(function(){
						if($rootScope.browser == 'android' || $rootScope.browser == 'chrome')
						{
							// $(".container-fluid.notlogin.ng-scope").css({
							// 	'position':'absolute',
							// 	'bottom':'10%'
							// });
							//$(".notlogin").css('bottom','10%');
						}
					},0);
				}
            });
            
            
        };
   
        $scope.r_o = {};
        $scope.r_os = {};
        $scope.r_op = {};
        $scope.isresized = false;
        $scope.fullscreen = false;
        $rootScope.resizeWindow = function() {
            //$( ".chat_window_1" ).resizable({});
            // console.log("r_o",r_o);
            // console.log("r_os",r_os);
            // console.log("r_op",r_op);
            if($scope.isresized)
            {
                $scope.isresized=false;
                $scope.fullscreen=false;
                $( ".chat_window_1" ).animate({
                    // width:$scope.r_os.width,
                    // height:$scope.r_os.height,
                    // left:$scope.r_op.left,
                    // top:$scope.r_op.top,
                    width:"500px",
                    height:$(window).height()-10,
                    right:12,
                    top:10,
                    //left:"65%",
                },100);
                $timeout(function(){
                    var height = $(".chat_window_1").height();
                    console.log(height+"chat");
                    var new_height = height - 43 -90;
                    console.log(new_height+"panel");
                    //$(".panel-body").height(new_height);
                    $(".panel-body").css("height", new_height);
                    $("#chat_panel").css("height", height);
                    
                },200);
                
            }
        };
        $(document).on('click', '.chatinput[disabled]', function(){
            console.log("clicked");
            $scope.selectApp();
        });
        $scope.gridview = false;
        $(document).on('click', '#chatTabs li', function(){
			$timeout(function() {
				if($("#chattab").is(":visible") || $("#gridview").is(":visible"))
					$scope.chatpanelheight = $(".chat_window_1").height()-45-55-20;
				else
					$scope.chatpanelheight = $(".chat_window_1").height()-45;
				//if($(this).attr("data-view")=="gridview")
				if($scope.chat_tab==3)	
					$scope.gridview = true;
				else
					$scope.gridview = false;
			},1000);
            
        });
        $scope.getWindowOrientation = function () {
            //console.log($window.orientation);
            var orientation = window.screen.orientation.type; 
            orientation = orientation.replace('-primary','');
            return orientation;
        };
        
        $scope.$watch($scope.getWindowOrientation, function (newValue, oldValue) {
            $scope.orientation = newValue;
            
        }, true);

        angular.element($window).bind('orientationchange', function () {
            $scope.$apply();
			$timeout(function(){
				if($scope.orientation=='landscape') {   
					$scope.panelheight = window.innerHeight;
				}
				else
					$scope.panelheight = window.innerHeight;
				
			},1000);
			$timeout(function(){
				if($scope.orientation=='landscape') {
					$(".chat_window_1").css({
						"width":"95%",
					});
					if($("#chattab").is(":visible") || $("#gridview").is(":visible"))
						$scope.chatpanelheight = $(".chat_window_1").height()-45-55;//heading,input,top
					else
						$scope.chatpanelheight = $(".chat_window_1").height()-45-20;
				}
				else
				{
					$(".chat_window_1").css({
						"width":"95%",
					});
					if($("#chattab").is(":visible") || $("#gridview").is(":visible"))
						$scope.chatpanelheight = $(".chat_window_1").height()-45-55;//heading,input,top,tab
					else
						$scope.chatpanelheight = $(".chat_window_1").height()-45-20;
				}
				$timeout(function(){
					$rootScope.scrollChatWindow();
				},500);
				//console.log($scope.chatpanelheight,"Panelbody");    
			},1500);
			
			
        });
        angular.element($window).on('resize', function() {
            $scope.$apply(function() {
                /*
				$timeout(function(){
                    if($scope.orientation=='landscape') {   
                        $scope.panelheight = window.innerHeight;
                    }
                    else
                        $scope.panelheight = window.innerHeight;
                    
                },1000);
                $timeout(function(){
                    if($scope.orientation=='landscape') {
                        $(".chat_window_1").css({
                            "width":"95%",
                        });
                        if($("#chattab").is(":visible") || $("#gridview").is(":visible"))
                            $scope.chatpanelheight = $(".chat_window_1").height()-45-55-10;//heading,input,top
                        else
                            $scope.chatpanelheight = $(".chat_window_1").height()-45-10;
                    }
                    else
                    {
                        $(".chat_window_1").css({
                            "width":"35%",
                        });
                        if($("#chattab").is(":visible") || $("#gridview").is(":visible"))
                            $scope.chatpanelheight = $(".chat_window_1").height()-45-55-10;//heading,input,top,tab
                        else
                            $scope.chatpanelheight = $(".chat_window_1").height()-45-10;
                    }
                    
                    console.log($scope.chatpanelheight,"Panelbody");    
                },1500);*/
                
            });
        });
        $rootScope.fullWindow = function() {
            $scope.isresized=true;
            $scope.fullscreen = true;
            $( ".chat_window_1" ).animate({
                width:$(window).width()-20,
                height:window.innerHeight,
                right:12,
                top:10,
                left:10,
            },100);
            $timeout(function(){
                var height = $(".chat_window_1").height();
                console.log(height+"chat");
                var new_height = height - 43 -90;
                console.log(new_height+"panel");
                //$(".panel-body").height(new_height);
                $(".panel-body").css("height", new_height);
                $("#chat_panel").css("height", height);
                
            },200);
            // $( ".chat_window_1" ).resizable({
            //     //alsoResize: '.panel-body',
                
            //    start: function(event, ui) {
            //         $( ".chat_window_1" ).animate({
            //             width:$(window).width()-20,
            //             height:window.innerHeight,
            //             //left:$scope.r_op.left,
            //             top:0,
            //         },100);
            //         $timeout(function(){
            //             var that = $(this).resizable( "instance" );
            //             $scope.r_o = that.options;
            //             $scope.r_os = that.originalSize;
            //             $scope.r_op = that.originalPosition;
            //             var height = $(".chat_window_1").height();
            //             console.log(height+"chat");
            //             var new_height = height - 43 -90;
            //             console.log(new_height+"panel");
            //             //$(".panel-body").height(new_height);
            //             $(".panel-body").css("height", new_height);
            //             $("#chat_panel").css("height", height);
            //             $scope.isresized=true;
            //             $scope.fullscreen = true;
                        
            //         },200);
            //    }
            
            // });
        };
        $rootScope.showChatwindow = function () {
            
            $( ".chat_window_1" ).resizable({
                //alsoResize: '.panel-body',
                
                minHeight:590,
                maxHeight:window.innerHeight,
                maxWidth:$(window).width()-20,
                handles: 'n, w',
                resize: function( event, ui ) {
                    
                    if(!$scope.isresized)
                    {
                        var that = $(this).resizable( "instance" );
                        $scope.r_o = that.options;
                        $scope.r_os = that.originalSize;
                        $scope.r_op = that.originalPosition;
                        
                        $scope.isresized = true;
                    }
                    if(ui.position.top <= ui.originalPosition.top)
                    {
                        
                        var height = $(".chat_window_1").height();
                        //console.log(height+"chat");
                        var new_height = height - 43 -90;
                        //console.log(new_height+"panel");
                        //$(".panel-body").height(new_height);
                        $(".panel-body").css("height", new_height);
                        $("#chat_panel").css("height", height);
                    }
                    // else {
                        
                    //     console.log("down");
                    //     // $(".panel-body").css({
                    //     //     minHeight: 460
                    //     // });
                    //     // $(".chat_window_1").css({top:0});
                    // }
                }
            
            });
            newlist = $.jStorage.get("chatlist");
            
			if(!newlist || newlist == null)
			{
				$rootScope.firstMsg = false;
			}
			else
			{ 
				$rootScope.firstMsg = true;
			}
			
            $.jStorage.set("showchat",true);
            if(!$rootScope.firstMsg)
            {
                $rootScope.firstMsg = true;
                msg = {Text:"Hi "+$sce.trustAsHtml($.jStorage.get('fname'))+", How may I help you ?",type:"SYS_FIRST"};
                $rootScope.pushSystemMsg(0,msg);  
            }
            $(".clickImage").hide();
            $('#chat_panel').slideDown( "slow", function() {
                // Animation complete.
                $('.panel-heading span.icon_minim').removeClass('panel-collapsed');
                $('.panel-heading span.icon_minim').removeClass('glyphicon-plus').addClass('glyphicon-minus');
                
                $rootScope.chatOpen = true;
                $rootScope.scrollChatWindow();
                //$scope.chatpanelheight = $(".chat_window_1").height()-43;
                
            });
            //$('#chat_panel').find('.panel-body').slideDown("fast");
            //$('#chat_panel').find('.panel-footer').slideDown("slow");
            angular.element(document).ready(function(){
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    //$scope.panelheight = $(window).height()-10;
					$(".chat_window_1").css({
						"width":"95%",
					});
                    $timeout(function(){
                         $scope.panelheight = $(window).height();
                        /*if($("#chattab").is(":visible") || $("#gridview").is(":visible"))
                            $scope.chatpanelheight = $(".chat_window_1").height()-45-55-20;
							else
								$scope.chatpanelheight = $(".chat_window_1").height()-45-20;*/
							//var input = document.querySelector('input');
							//var textarea = document.querySelector('textarea');
							/*var reset = function() {
								this.value = this.value;
							};*/
							//setTimeout(function(){$('#userMsg').focus();}, 500);
							//input.addEventListener('focus', reset, false);
                    },1000);
					
                }
                $timeout(function(){
					if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
						$scope.chatpanelheight = $(".chat_window_1").height()-45-35;
					}
					else 
						$scope.chatpanelheight = $(".chat_window_1").height()-45-55;
                },1500);
							
            });
        };
        angular.element(document).ready(function(){
            
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                
				$timeout(function(){
					if($rootScope.browser == 'android' || $rootScope.browser == 'chrome')
					{
						// $(".container-fluid.notlogin.ng-scope").css({
						// 	'position':'absolute',
						// 	'bottom':'10%'
						// });
						//$(".notlogin").css('bottom','10%');
					}
				},0);
				
				
            }
        });
        $rootScope.minimizeChatwindow = function() {
            $.jStorage.set("showchat",false);
            $rootScope.showTimeoutmsg = false;
            $rootScope.autocompletelist = [];
            $('#chat_panel').slideUp();
            //$('#chat_panel').find('.panel-body').slideUp("fast");
            //$('#chat_panel').find('.panel-footer').slideUp("fast");
            $('.panel-heading span.icon_minim').addClass('panel-collapsed');
            $('.panel-heading span.icon_minim').addClass('glyphicon-plus').removeClass('glyphicon-minus');
            $(".clickImage").show( "fadeIn");
        };
        
        $rootScope.appendSysMsg = function(id,value) {
            //console.log(value);
            if(!value.flag)
                value.flag = 2;
            $rootScope.currentProjectUrl = value.url;
            
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.chatlist.push({id:"id",msg:value,position:"left",curTime: $rootScope.getDatetime()});
            $.jStorage.set("chatlist",$rootScope.chatlist);
            $timeout(function(){
                $rootScope.scrollChatWindow();
            });
        };
        $rootScope.appendMsg = function(id,value,backend_url) {
            //console.log(backend_url);
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:"id",msg:value,position:"right",curTime: $rootScope.getDatetime(),backend_url:backend_url});
            //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
            $.jStorage.set("chatlist",$rootScope.chatlist);
            $rootScope.getSystemMsg(id,value,backend_url);
            $rootScope.msgSelected = false;
            $rootScope.scrollChatWindow();
        };
		$rootScope.$viewmodaldateInstance={};
		$rootScope.opendatefilter = function(datefilterurl){
			$rootScope.$viewmodaldateInstance = $uibModal.open({
				scope: $rootScope,
				animation: true,
				size: 'lg',
				templateUrl: 'views/modal/datefilter.html',
				resolve: {
					items: function () {
						return datefilterurl;
					}
				},
				controller: 'DateCtrl'
			});
		};
		$rootScope.datefcancel=function(){
			 $rootScope.$viewmodaldateInstance.dismiss('cancel');
		};
        $rootScope.pushMsg = function(id,value,backendurl) {
            $rootScope.msgSelected = true;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:"id",msg:value,position:"right",curTime: $rootScope.getDatetime(),backend_url:backendurl});
            //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
            $rootScope.getSystemMsg(id,value,backendurl);
            $.jStorage.set("chatlist",$rootScope.chatlist);
            $rootScope.msgSelected = false;
            $rootScope.showMsgLoader=true;
            $rootScope.scrollChatWindow();
            $timeout(function(){
                $rootScope.autocompletelist = [];
            },1000);
        };
        // if($.jStorage.get("showchat"))
        //     $rootScope.showChatwindow();
        // else
        //     $rootScope.minimizeChatwindow();
        $scope.showcol4 = false;
        $scope.showcol3 = false;
        $scope.showcol2 = false;
        $scope.col4 = function() {
            $scope.showcol4 = true;
            $scope.showcol2 = false;
            $scope.showcol3 = false;
        };
        $scope.col3 = function() {
            $scope.showcol3 = true;
            $scope.showcol2 = false;
            $scope.showcol4 = false;
        };
        $scope.col2 = function() {
            $scope.showcol2 = true;
            $scope.showcol3 = false;
            $scope.showcol4 = false;
        };        
        $rootScope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
            //return $sce.getTrustedResourceUrl(src);
        };
        $rootScope.getcontent = function(content) {
            return $sce.trustAsHtml(content);
        };
        $rootScope.trustSrcwithticket = function(src) {
            return $sce.trustAsResourceUrl(src+"?qlikTicket="+$rootScope.qticket);
            //return $sce.getTrustedResourceUrl(src);
        };
		var imageAddr = "https://analyticsbot.mahindra.com/img/robot.gif"; 
		var downloadSize = 57000; //bytes

		$scope.ShowProgressMessage=function(msg) {
			if (console) {
				if (typeof msg == "string") {
					console.log(msg);
				} else {
					for (var i = 0; i < msg.length; i++) {
						console.log(msg[i]);
					}
				}
			}
			
			var oProgress = document.getElementById("progress");
			if (oProgress) {
				var actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
				//oProgress.innerHTML = actualHTML;
				console.log(actualHTML);
			}
		};

		$scope.InitiateSpeedDetection=function() {
			$scope.ShowProgressMessage("Loading the image, please wait...");
			window.setTimeout($scope.MeasureConnectionSpeed, 1);
		};    

		/*if (window.addEventListener) {
			window.addEventListener('load', InitiateSpeedDetection, false);
		} else if (window.attachEvent) {
			window.attachEvent('onload', InitiateSpeedDetection);
		}*/

		$scope.MeasureConnectionSpeed=function() {
			var startTime, endTime;
			var download = new Image();
			download.onload = function () {
				endTime = (new Date()).getTime();
				$scope.showResults();
			}
			
			download.onerror = function (err, msg) {
				$scope.ShowProgressMessage("Invalid image, or error downloading");
			}
			
			startTime = (new Date()).getTime();
			var cacheBuster = "?nnn=" + startTime;
			download.src = imageAddr + cacheBuster;
			
			$scope.showResults=function() {
				var duration = (endTime - startTime) / 1000;
				var bitsLoaded = downloadSize * 8;
				var speedBps = (bitsLoaded / duration).toFixed(2);
				var speedKbps = (speedBps / 1024).toFixed(2);
				var speedMbps = (speedKbps / 1024).toFixed(2);
				$scope.ShowProgressMessage([
					"Your connection speed is:", 
					speedBps + " bps", 
					speedKbps + " kbps", 
					speedMbps + " Mbps"
				]);
			};
		};
		 $scope.pushMsgbackend=function(id,value,backend_url) {
            if(backend_url == "" || !backend_url)
                backend_url = "ConsumerSales_chat";
            //console.log(backend_url);
            formData = {session_id:$rootScope.session_id,session_object:$rootScope.session_object,userid:$rootScope.user_id,input:value,csrfmiddlewaretoken:"DapgmpQ2uiWHYVhBZspLD0o9rjce2H3NJHJbc1FOhYYYZ6TuaGyNwVFxO4Sie0my",backendurl:backend_url};
            var prevmsg = value;
			framedata = {};
            apiService.getQlikChart(formData).then(function (data){
				for(var i = 0 ; i <= data.data.url.length-1; i++)
				{
					$(".hide_extension").append("<iframe src='"+data.data.url[i]+"?qlikTicket="+$rootScope.qticket+"'></iframe>");
				}
            });
        };  
        $rootScope.getSystemMsg = function(id,value,backend_url){
            if(backend_url == "" || !backend_url)
                backend_url = "ConsumerSales_chat";
            //console.log(backend_url);
            var prevmsg = value;
			value = value.toLowerCase();
			formData = {session_id:$rootScope.session_id,session_object:$rootScope.session_object,userid:$rootScope.userid,input:value,csrfmiddlewaretoken:"DapgmpQ2uiWHYVhBZspLD0o9rjce2H3NJHJbc1FOhYYYZ6TuaGyNwVFxO4Sie0my",backendurl:backend_url};
            
			framedata = {};
			$scope.InitiateSpeedDetection();
			$scope.gotres = false;
			$timeout(function() {
				//if(!$scope.gotres)
					//alert("Slow internet connection, Please wait");
			},4000);
            apiService.getQlikChart(formData).then(function (data){
                //console.log(data);
                
                // $rootScope.session_object = response.data.session_object;
                framedata = data.data;
                framedata.type = "iframe";
                // if(!framedata.flag)
                //     framedata.flag = 1;
                // if(!framedata.flag)
                //     framedata.flag = 3;
                $rootScope.currentProjectUrl = framedata.url;
                
                //$rootScope.currentProjectUrl += "?qlikTicket="+$rootScope.qticket;
                //framedata.url += "?qlikTicket="+$rootScope.qticket;
                if(!framedata.flag)
                    framedata.flag = 2;
                // if(framedata.flag == 2)
                // {
                //     framedata.newurl = [];
                //     framedata.newurl.push(framedata.url);
                //     framedata.newurl.push(framedata.url);
                //     //framedata.url=framedata.newurl;
                //     framedata.flag = 5;
                // }
                //framedata.url = $rootScope.trustSrc(data.data.url);
                framedata.prevmsg = prevmsg;
				if($rootScope.browser == 'chrome' || $rootScope.browser == 'android')
				{
					if($rootScope.voiceenabled)
						$rootScope.Speaktext(framedata.text);
                }
				
				//console.log(framedata,"Response");
                $rootScope.pushSystemMsg(0,framedata);
				//$('.chatinput').focus();
				$scope.gotres=true;
                $rootScope.showMsgLoader = false;
                if(framedata.flag == 5)
                {
                    $timeout(function(){
                        $('.carousel').carousel({
                            interval: false,
                            wrap: false
                        });
                        $('.carousel'+($rootScope.chatlist.length-1)).find('.item').first().addClass('active');
                    },2000);
                }
                $timeout(function(){
                    $(".chatinput").val("");
                    $rootScope.chatText="";
                });
                var b_d = $.jStorage.get("bookmarkdata");
                //console.log(b_d);
                var firstload = true;
                $timeout(function(){
                    _.forEach(b_d,function(value,key){
                        
                        if(firstload) {
                            if(value.position == "right")
                            {
                                
                                    $rootScope.appendMsg(value.id,value.msg,value.backend_url);
                                    b_d.shift();
                                    if(b_d.length > 0)
                                        $.jStorage.set("bookmarkdata",b_d);
                                    else
                                        $.jStorage.deleteKey("bookmarkdata");
                                    firstload = false;
                                
                                
                            }
                        }
                    });
                },5000);
            }).catch(function (reason) {
                console.log(reason);
                var msg = {Text:"Sorry I could not understand",type:"SYS_EMPTY_RES"};
                $rootScope.pushSystemMsg(0,msg); 
                $rootScope.showMsgLoader=false;
                $(".chatinput").val("");
            });
			
                
              
        };
        
        $rootScope.Speaktext = function(txt) {
            //console.log(text);
            var _iOS9voices = [
                { "data-name": "Maged", voiceURI: "com.apple.ttsbundle.Maged-compact", "data-lang": "ar-SA", localService: true, "default": true },
                { "data-name": "Zuzana", voiceURI: "com.apple.ttsbundle.Zuzana-compact", "data-lang": "cs-CZ", localService: true, "default": true },
                { "data-name": "Sara", voiceURI: "com.apple.ttsbundle.Sara-compact", "data-lang": "da-DK", localService: true, "default": true },
                { "data-name": "Anna", voiceURI: "com.apple.ttsbundle.Anna-compact", "data-lang": "de-DE", localService: true, "default": true },
                { "data-name": "Melina", voiceURI: "com.apple.ttsbundle.Melina-compact", "data-lang": "el-GR", localService: true, "default": true },
                { "data-name": "Karen", voiceURI: "com.apple.ttsbundle.Karen-compact", "data-lang": "en-AU", localService: true, "default": true },
                { "data-name": "Daniel", voiceURI: "com.apple.ttsbundle.Daniel-compact", "data-lang": "en-GB", localService: true, "default": true },
                { "data-name": "Moira", voiceURI: "com.apple.ttsbundle.Moira-compact", "data-lang": "en-IE", localService: true, "default": true },
                { "data-name": "Samantha (Enhanced)", voiceURI: "com.apple.ttsbundle.Samantha-premium", "data-lang": "en-US", localService: true, "default": true },
                { "data-name": "Samantha", voiceURI: "com.apple.ttsbundle.Samantha-compact", "data-lang": "en-US", localService: true, "default": true },
                { "data-name": "Tessa", voiceURI: "com.apple.ttsbundle.Tessa-compact", "data-lang": "en-ZA", localService: true, "default": true },
                { "data-name": "Monica", voiceURI: "com.apple.ttsbundle.Monica-compact", "data-lang": "es-ES", localService: true, "default": true },
                { "data-name": "Paulina", voiceURI: "com.apple.ttsbundle.Paulina-compact", "data-lang": "es-MX", localService: true, "default": true },
                { "data-name": "Satu", voiceURI: "com.apple.ttsbundle.Satu-compact", "data-lang": "fi-FI", localService: true, "default": true },
                { "data-name": "Amelie", voiceURI: "com.apple.ttsbundle.Amelie-compact", "data-lang": "fr-CA", localService: true, "default": true },
                { "data-name": "Thomas", voiceURI: "com.apple.ttsbundle.Thomas-compact", "data-lang": "fr-FR", localService: true, "default": true },
                { "data-name": "Carmit", voiceURI: "com.apple.ttsbundle.Carmit-compact", "data-lang": "he-IL", localService: true, "default": true },
                { "data-name": "Lekha", voiceURI: "com.apple.ttsbundle.Lekha-compact", "data-lang": "hi-IN", localService: true, "default": true },
                { "data-name": "Mariska", voiceURI: "com.apple.ttsbundle.Mariska-compact", "data-lang": "hu-HU", localService: true, "default": true },
                { "data-name": "Damayanti", voiceURI: "com.apple.ttsbundle.Damayanti-compact", "data-lang": "id-ID", localService: true, "default": true },
                { "data-name": "Alice", voiceURI: "com.apple.ttsbundle.Alice-compact", "data-lang": "it-IT", localService: true, "default": true },
                { "data-name": "Kyoko", voiceURI: "com.apple.ttsbundle.Kyoko-compact", "data-lang": "ja-JP", localService: true, "default": true },
                { "data-name": "Yuna", voiceURI: "com.apple.ttsbundle.Yuna-compact", "data-lang": "ko-KR", localService: true, "default": true },
                { "data-name": "Ellen", voiceURI: "com.apple.ttsbundle.Ellen-compact", "data-lang": "nl-BE", localService: true, "default": true },
                { "data-name": "Xander", voiceURI: "com.apple.ttsbundle.Xander-compact", "data-lang": "nl-NL", localService: true, "default": true },
                { "data-name": "Nora", voiceURI: "com.apple.ttsbundle.Nora-compact", "data-lang": "no-NO", localService: true, "default": true },
                { "data-name": "Zosia", voiceURI: "com.apple.ttsbundle.Zosia-compact", "data-lang": "pl-PL", localService: true, "default": true },
                { "data-name": "Luciana", voiceURI: "com.apple.ttsbundle.Luciana-compact", "data-lang": "pt-BR", localService: true, "default": true },
                { "data-name": "Joana", voiceURI: "com.apple.ttsbundle.Joana-compact", "data-lang": "pt-PT", localService: true, "default": true },
                { "data-name": "Ioana", voiceURI: "com.apple.ttsbundle.Ioana-compact", "data-lang": "ro-RO", localService: true, "default": true },
                { "data-name": "Milena", voiceURI: "com.apple.ttsbundle.Milena-compact", "data-lang": "ru-RU", localService: true, "default": true },
                { "data-name": "Laura", voiceURI: "com.apple.ttsbundle.Laura-compact", "data-lang": "sk-SK", localService: true, "default": true },
                { "data-name": "Alva", voiceURI: "com.apple.ttsbundle.Alva-compact", "data-lang": "sv-SE", localService: true, "default": true },
                { "data-name": "Kanya", voiceURI: "com.apple.ttsbundle.Kanya-compact", "data-lang": "th-TH", localService: true, "default": true },
                { "data-name": "Yelda", voiceURI: "com.apple.ttsbundle.Yelda-compact", "data-lang": "tr-TR", localService: true, "default": true },
                { "data-name": "Ting-Ting", voiceURI: "com.apple.ttsbundle.Ting-Ting-compact", "data-lang": "zh-CN", localService: true, "default": true },
                { "data-name": "Sin-Ji", voiceURI: "com.apple.ttsbundle.Sin-Ji-compact", "data-lang": "zh-HK", localService: true, "default": true },
                { "data-name": "Mei-Jia", voiceURI: "com.apple.ttsbundle.Mei-Jia-compact", "data-lang": "zh-TW", localService: true, "default": true }
                ];
            //var voices = window.speechSynthesis.getVoices();
            var speech = new SpeechSynthesisUtterance(txt);
            //speech.text = $.jStorage.get("texttospeak");
            //speech.text = "Hello";
            speech.volume = 1; // 0 to 1
            speech.rate = 1; // 0.1 to 9
            speech.pitch = 1; // 0 to 2, 1=normal
            speech.lang = "en-US";
            //speech.lang = {lang: 'en-US', desc: 'English (United States)'};
            //speech.voice = voices[8]; 
            speech.voiceURI = 'native';
            speechSynthesis.speak(speech);
            $.jStorage.set("texttospeak","");
        };
        

        $rootScope.tappedKeys = '';

        $rootScope.onKeyUp = function(e){
            //if(e.key == "ArrowDown" || e.key == "ArrowUp")
            if(e.which == 40 )
            {
                if($("ul#ui-id-1 li.active").length > 0) {
                    var storeTarget	= $('ul#ui-id-1').find("li.active").next();
                    $("ul#ui-id-1 li.active").removeClass("active");
                    storeTarget.focus().addClass("active");
                    $(".chatinput").val(storeTarget.text());
                    $rootScope.autolistid = $(storeTarget).attr("data-id");
                    $rootScope.autolistvalue = $(storeTarget).attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
                    $timeout(function(){
                        // var o_ele = "#suggestionList .ui-widget.ui-widget-content";
                        // console.log(o_ele.scrollHeight > o_ele.clientHeight);
                        // if(o_ele.scrollHeight > o_ele.clientHeight)
                        // {
                        //     var ulHeight = $("#suggestionList .ui-widget.ui-widget-content").height();
                        //     $('#suggestionList .ui-widget.ui-widget-content').animate({scrollTop: ulHeight});
                        // }
                        
                    });
                }
                else
                {
                    $('ul#ui-id-1').find("li:first").focus().addClass("active");
                    var storeTarget	= $('ul#ui-id-1').find("li.active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:first").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:first").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:first").attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
		    	}
                return;
            }
            if(e.which == 38 )
            {
                if($("ul#ui-id-1 li.active").length!=0) {
                    var storeTarget	= $('ul#ui-id-1').find("li.active").prev();
                    $("ul#ui-id-1 li.active").removeClass("active");
                    storeTarget.focus().addClass("active");
                    $(".chatinput").val(storeTarget.text());
                    $rootScope.autolistid = $(storeTarget).attr("data-id");
                    $rootScope.autolistvalue = $(storeTarget).attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
                }
                else
                {
                    $('ul#ui-id-1').find("li:last").focus().addClass("active");
                    var storeTarget	= $('ul#ui-id-1').find("li.active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:last").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:last").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:last").attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
		    	}
                
                return;
            }
            if(e.which == 13)
            {
                // if( $rootScope.answers )
                // {
                //     $rootScope.pushAutoMsg($rootScope.autolistid,$(".chatinput").val(),$rootScope.answers);
                //     $rootScope.autocompletelist = [];
                // }
                // else if(($rootScope.autolistid=="" || $rootScope.autolistid == null || $rootScope.autolistid == 0) )
                // {
                    
                     
                //      $rootScope.pushMsg("",$(".chatinput").val(),"");
                //      $(".chatinput").val("");
                // }
                if($(".chatinput").val() == "") {}
                else {
                    
                    $rootScope.pushMsg($rootScope.autolistid,$(".chatinput").val(),$rootScope.backendurl);
                }
                $rootScope.autocompletelist = [];
                $rootScope.chatText="";
            }
            if(e.which == 8)
            {
                
                if($(".chatinput").val()=="")
                {
                    $rootScope.autocompletelist = [];
                    $rootScope.chatText = "";
                }
                
            }
        };
        $scope.fmodalInstance = {};
        $scope.openForgotpassword = function() {
            $scope.$fmodalInstance = $uibModal.open({
                scope: $scope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/forgotpassword.html',
                //controller: 'CommonCtrl'
            });
        };
        $scope.forgotPwdcancel = function() {
            //console.log("dismissing");
            $scope.$fmodalInstance.dismiss('cancel');
            //$scope.$modalInstance.close();
        };
        $scope.forgotpasswordreq = function(email) {
            str = $filter('date')(new Date(), 'hh:mm:ss a')+email;
            $scope.formData = {email:email,resettoken:sha256_digest(str) };
            apiService.forgotpassword($scope.formData).then(function (callback){
                if(callback.data.value)
                {    
                    $scope.forgotpasswordSuccess=1;
                    $timeout(function () {
                        $scope.$fmodalInstance.dismiss('cancel');
                        $scope.forgotpasswordSuccess=0;
                    },1000);
                }
                else if (callback.data.error.message==-1)
                    $scope.forgotpassworderror =-1;
            })
        };
        $scope.$modalInstance = {};
        $scope.openChangePwd = function() {
            $scope.$modalInstance = $uibModal.open({
                scope: $scope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/changepassword.html',
                //controller: 'CommonCtrl'
            });
        };
        $scope.changePwdcancel = function() {
            //console.log("dismissing");
            $scope.$modalInstance.dismiss('cancel');
            //$scope.$modalInstance.close();
        };
        $scope.passworderror=0
        $scope.changepasswordSuccess=0;
        $scope.p_count = 0;
        $scope.changepassword = function(currentpassword,newpassword,newpassword2) {
             //console.log(newpassword);
            userid = $rootScope.sessionid;
            $scope.token="";
            var formData = {userid:userid,oldpassword:sha256_digest(currentpassword),newpassword:sha256_digest(newpassword) };
            //console.log($scope.formData);
            apiService.changepassword(formData).then(function (callback){
                if(callback.data.value)
                {    
                    $scope.p_count = 0;
                    $scope.changepasswordSuccess=1;
                    $timeout(function () {
                        $scope.$modalInstance.dismiss('cancel');
                        $scope.changepasswordSuccess=0;
                    },500);
                }
                else if (callback.data.error.message==-1)
                {
                    $scope.p_count++;
                    $scope.passworderror =-1;
                    if($scope.p_count >= 3)
                    {
                        $scope.changePwdcancel();
                        $scope.logout();
                    }
                }
            });     
        };

        $scope.isforgotlogin = false;
        $scope.ftoken=$stateParams.id;
        $scope.expired = false;
        if($stateParams.id)
        {
            $scope.isforgotlogin=true;
        
        
            $scope.floginerror=0;
            $scope.countdown = {};
            $scope.isvalidpasswordresetreq = function()
            {
                $scope.formData = { resettoken:$stateParams.id };
                apiService.isvalidpasswordresetreq($scope.formData).then(function (callback){
                    if(!callback.data.value)
                    {
                        $scope.floginerror = -1;
                        $timeout(function(){
                            $state.transitionTo($state.current, null, {'reload':true});
                        },1000);
                    }
                    else
                    {
                        $scope.refreshTimer(callback.data.data.expirydate);
                    }
                });   
            };
            

            $scope.isvalidpasswordresetreq();
            $scope.refreshTimer = function(expiryTime) 
            {
                
                expiryTime = new Date(expiryTime);
                t = expiryTime.getTime();
                var tempTime = moment.duration(t);
                var y = tempTime.hours() +":"+ tempTime.minutes();
                
                expiryDate = moment(expiryTime).format("YYYY-MM-DD");
                expiryTime = new Date(expiryDate+" "+y);
                $scope.rightNow = new Date();
                $scope.diffTime = expiryTime - $scope.rightNow;
                var duration = moment.duration($scope.diffTime, 'milliseconds');
                
                $interval(function() {

                    duration = moment.duration(duration - 1000, 'milliseconds');
                    
                    if (duration._milliseconds > 0) {

                        $scope.expired = false;
                    } else {

                        $scope.expired = true;
                    }
                    $scope.countdown.months = duration.months();
                    $scope.countdown.days = duration.days();
                    $scope.countdown.hours = duration.hours();
                    $scope.countdown.minutes = duration.minutes();
                    $scope.countdown.seconds = duration.seconds();
                    
                }, 1000);
            };
        }
        $scope.fchangepassword = function(password)
        {
            
            $scope.formData = {resettoken:$scope.ftoken,password:sha256_digest(password)};
            
            
            apiService.changepassword2($scope.formData).then(function (callback){
                if(!callback.data.value)
                    $scope.loginsuccesserror = -1;
                else
                {
                    $scope.fchangepasswordSuccess = 1;
                    $timeout(function(){
                        $.jStorage.flush();
                        //$state.go($state.current, {}, {reload: true});
                        // $state.transitionTo($state.current, $stateParams, {
                        //     reload: true,
                        //     inherit: false,
                        //     notify: true
                        // });
                        $state.transitionTo($state.current, null, {'reload':true});
                    },1000);
                }
            });
            
        };
        $rootScope.likeChatClick = function(){
            $timeout(function(){
                $('span.thumbsup').css("color", "#ed232b");
                $('.thumbsdown').css("color", "#444");
            },200);
        };
		$scope.deletegraph = function() {
			$scope.activatechattab();
            if($("input[name='formailing[]']:checked").length == 0)
            {
                alert("Please select graph  to delete");
            }
            else
            {
				var deletedg=false;
				$.each($("input[name='formailing[]']:checked"), function(k,v) {
					//console.log(k);
					//console.log(v);
					var pullarray = [];
					var index = $(v).attr('data-index');
					if(index > 1)
					{
						deletedg = true;
						pullarray.push(index);
						pullarray.push(index-1);
						/*var cl = $rootScope.chatlist;
						console.log(cl[index]);
						console.log(cl[index-1]);
						if(k==0)
						{
							_.pullAt(cl, [index, index-1]);
						}
						else
						{
							var nextindex=k+1;
							nextindex = index-2;
							_.pullAt(cl, [nextindex, nextindex-1]);
						}
						$(this).parents("li").remove();
						$rootScope.chatlist = cl;
						$.jStorage.set('chatlist',cl);
						$("input[name='formailing[]']").prop("checked",false);*/
					}
					else 
						alert("Sorry Its default query,can not be deleted");
					if(deletedg)
						alert("Query deleted");
					deletedg = false;
					var cl = $rootScope.chatlist;
					_.pullAt(cl, pullarray);
					//$(this).parents("li").remove();
					$rootScope.chatlist = cl;
					$.jStorage.set('chatlist',cl);
					
					
				});
				$timeout(function() {
					$("input[name='formailing[]']").prop("checked",false);
				},1000);
				
			}
		};
        $rootScope.attchcount = 0;
        $rootScope.mailmodalInstance = {};
        $rootScope.mailbookmarkerror = 0;
        $scope.openMailmodal = function() {
			$scope.activatechattab();
            if($("input[name='formailing[]']:checked").length == 0)
            {
                alert("Please select graph  to mail");
                $rootScope.mailmodalCancel();
            }
            else
            {
                $rootScope.$mailmodalInstance = $uibModal.open({
                    scope: $rootScope,
                    animation: true,
                    size: 'lg',
                    templateUrl: 'views/modal/mailmodal.html',
                    //controller: 'CommonCtrl'
                });
                $rootScope.attchcount = $("input[name='formailing[]']:checked").length;
            }
            //window.open('mailto:test@example.com?subject=subject&body=body');
        };
        $rootScope.mailmodalCancel = function() {
            //console.log("dismissing");
            $rootScope.$mailmodalInstance.dismiss('cancel');
            $rootScope.attchcount = 0;
        };

        $rootScope.$viewmodalInstance = {};
        $rootScope.selectbookmarkerror = 0;
        $rootScope.clearChat = function() {
			$scope.activatechattab();
			var deletedchat = false;
            if($rootScope.chatlist.length > 3)
			{
				for(j = $rootScope.chatlist.length ; j>1 ; j--)
				{
					deletedchat = true;
					_.pullAt($rootScope.chatlist, [j]);
					$.jStorage.set('chatlist',$rootScope.chatlist);
				}
				if(deletedchat)
					alert("Chat cleared");
				deletedchat = false;
			}
			//$rootScope.chatlist = [];
            //$.jStorage.set("chatlist",$rootScope.chatlist);
        };
        $rootScope.openviewBookmark = function() {
			$scope.activatechattab();
            $scope.formData = {userid:$rootScope.sessionid};
            
            
            apiService.viewbookmark($scope.formData).then(function (callback){
                $("#selectbookmark_list").html("");
                
                
                $rootScope.$viewmodalInstance = $uibModal.open({
                    scope: $rootScope,
                    animation: true,
                    size: 'sm',
                    templateUrl: 'views/modal/selectbookmark.html',
                    resolve: {
                        items: function () {
                        return callback.data.data;
                        }
                    },
                    controller: 'ViewCtrl'
                });
                
            });
        };
        $rootScope.selectbookmarkCancel = function() {
            //console.log("dismissing");
            $rootScope.$viewmodalInstance.dismiss('cancel');
        };

        $rootScope.$deletemodalInstance = {};
        $rootScope.deletebookmarkerror = 0;
        
        $rootScope.opendeleteBookmark = function() {
			$scope.activatechattab();
            $scope.formData = {userid:$rootScope.sessionid};
            
            
            apiService.viewbookmark($scope.formData).then(function (callback){
                $("#selectbookmark_list").html("");
                
                
                $rootScope.$deletemodalInstance = $uibModal.open({
                    scope: $rootScope,
                    animation: true,
                    size: 'sm',
                    templateUrl: 'views/modal/deletebookmark.html',
                    resolve: {
                        items: function () {
                        return callback.data.data;
                        }
                    },
                    controller: 'DeleteBookmarkCtrl'
                });
                
            });
        };
        $rootScope.deletebookmarkCancel = function() {
            //console.log("dismissing");
            $rootScope.$deletemodalInstance.dismiss('cancel');
        };
        
        $rootScope.$savemodalInstance = {};
        $rootScope.savebookmarkerror = 0;
        $scope.opensaveBookmark = function() {
			$scope.activatechattab();
            if($("input[name='formailing[]']:checked").length == 0)
            {
                alert("Please select graph  to save");
                //$rootScope.mailmodalCancel();
            }
            else {
                $rootScope.$savemodalInstance = $uibModal.open({
                    scope: $rootScope,
                    animation: true,
                    size: 'sm',
                    templateUrl: 'views/modal/savebookmark.html',
                    //controller: 'CommonCtrl'
                });
            }
        };
        $rootScope.bookmarkCancel = function() {
            //console.log("dismissing");
            $rootScope.$savemodalInstance.dismiss('cancel');
        };
        $rootScope.$dislikemodalInstance = {};
        $rootScope.dislikesuggestionerror = 0;
        $rootScope.dislikeChatClick = function(){
            $rootScope.$dislikemodalInstance = $uibModal.open({
                scope: $rootScope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/dislikechat.html',
                //controller: 'CommonCtrl'
            });
            $timeout(function(){ 
                $('span.thumbsdown').css("color", "#ed232b");
                $('.thumbsup').css("color", "#444");
            },200);
        };
        $rootScope.dislikeCancel = function() {
            //console.log("dismissing");
            $scope.$dislikemodalInstance.dismiss('cancel');
        };
        $rootScope.dislikesuggestionsubmit = function(suggestion){
            console.log("suggestion",suggestion);
            $rootScope.dislikesuggestionSuccess = 1;
            $timeout(function(){
                $rootScope.dislikesuggestionSuccess = 0;
                $rootScope.dislikeCancel();
            },500);
        };
        
       $timeout(function(){
            //$('#chatTabs a:last').tab('show');
       },200);
    })
    
    .controller('DeleteBookmarkCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        // $scope.selected = {
        //     item: $scope.items[0]
        // };
        var dt = "";
        _.each($scope.items,function(v,k){
            dt += "<option value='"+v._id+"'>"+v.name+"</option>";
            
        });
    })
    
    .controller('ViewappCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        // $scope.selected = {
        //     item: $scope.items[0]
        // };
        var dt = "";
        _.each($scope.items,function(v,k){
            //console.log(v);
            dt += "<option value='"+v._id+"'>"+v.name+"</option>";
            
        });
        //console.log(dt);
        //$("select#selectbookmark_list").html(dt);
    })
    .controller('ViewCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        // $scope.selected = {
        //     item: $scope.items[0]
        // };
        var dt = "";
        _.each($scope.items,function(v,k){
            //console.log(v);
            dt += "<option value='"+v._id+"'>"+v.name+"</option>";
            
        });
        //console.log(dt);
        //$("select#selectbookmark_list").html(dt);
    })
	.controller('DateCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        // $scope.selected = {
        //     item: $scope.items[0]
        // };
        
        //console.log(dt);
        //$("select#selectbookmark_list").html(dt);
    })
    // Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });

    