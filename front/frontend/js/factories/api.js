myApp.factory('apiService', function ($http, $q, $timeout,$httpParamSerializer) {
    
    adminurl2 = "https://analyticsbot.mahindra.com/hrbot/";
    //adminurl2 = "https://corp.mahindra.com:8000/";
    adminUrl3 = "https://analyticsbot.mahindra.com/api/";
    //adminUrl3 = "http://corp.mahindra.com:8095/api/";
    return {

        // This is a demo Service for POST Method.
        getDemo: function (formData, callback) {
            $http({
                url: adminurl2 + 'demo/demoService',
                method: 'POST',
                data: formData
            }).success(callback);
        },
        // This is a demo Service for POST Method.
        get_session: function (formData, callback) {
            return $http({
                url:adminurl2+'MahindraBot_chat_session/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                method: 'POST',
                data: $httpParamSerializer(formData),
                dataType:"json"
            });
        },

        getusers: function (formData, callback) {
            $http({
                url: 'https://exponentiadata.co.in/qrs/users/full?Xrfkey=123456789ABCDEFG',
                headers:{
                    'X-Qlik-Xrfkey':'123456789ABCDEFG',
                    'X-Qlik-User':'UserDirectory= BONTONCHAT; UserId=sa_repository',
                    'Content-Type':'application/json',
                },
                method: 'POST',
                data: formData
            }).success(callback);
        },
        getautocomplete: function(formData, callback) {
            
            return $http({
                url:adminUrl3+ "Chatbotautocomplete/getautocomplete",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            })
        },
        getkpi: function(formData, callback) {
            
            return $http({
                url:adminUrl3+ "Kpi/getkpi",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            })
        },
        getquery: function(formData, callback) {
            
            return $http({
                url:adminUrl3+ "Kpi/getquery",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            })
        },
        getmeasure: function(formData, callback) {
            
            return $http({
                url:adminUrl3+ "Kpi/getmeasure",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            })
        },
        topqueries:function(formData, callback) {
            return $http({
                url:adminUrl3+ "Chatbotautocomplete/gettopqueries",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            })
        },
        getfullautocomplete: function(formData, callback) {
            return $http({
                url:adminUrl3+ "Chatbotautocomplete/getfullautocomplete",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            })
        },
        login:function(formData, callback) {
            
            // $http.post(adminurl + "api.php?func=getautocomplete&string=" + request).then(function (response) {
            //     console.log("Hello",response);
            //     return response;
            // });
            
            return $http({
                url:adminUrl3+ "Chatbotuser/loginuser",
                //headers: {'X-CSRFToken': "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"},
                method: 'POST',
                data: formData,
            });
           
        },
        getsessiondata:function(formData, callback) {
            
            return $http({
                url:adminUrl3+ "Chatbotuser/getsessiondata",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData,
            });
           
        },
        getnewticket:function(formData, callback) {
            return $http({
                url:adminUrl3+ "Chatbotuser/getnewticket",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData,
            });
           
        },
        checkloginstatus:function(formData, callback) {
            
           
            return $http({
                //url: "http://wohlig.co.in/chatbotapi/index.php/json/" + 'login/',
                url:adminUrl3+ "Chatbotuserlogs/checkloginstatus",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                //headers: {'X-CSRFToken': "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"},
                method: 'POST',
                data: formData,
                //withCredentials: false,
                //dataType:"json",
            });
            
        },
        logout:function(formData, callback) {
            
           
            return $http({
                //url: "http://wohlig.co.in/chatbotapi/index.php/json/" + 'login/',
                url:adminUrl3+ "Chatbotuserlogs/logoutuser",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                //headers: {'X-CSRFToken': "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"},
                method: 'POST',
                data: formData,
                //withCredentials: false,
                //dataType:"json",
            });
            
        },
        savebookmark:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotbookmark/savebookmark",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData,
            });
            
        },
        deletebookmark:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotbookmark/deletebookmark",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData,
            });
            
        },
        viewbookmark:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotbookmark/viewbookmark",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData,
            });
            
        },
        getbookmark:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotbookmark/getbookmark",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData,
            });
            
        },
        sendmail:function(formData, callback) {
            
           
            return $http({
                url:adminUrl3+ "Chatbotuser/sendmail",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData,
                // headers : {
                //     'Content-Type' : 'application/json'
                // },
                // transformRequest :  [function (data, headers) {
                //     //just send data without modifying
                //     return data;
                // }],
                contentType: "application/x-www-form-urlencoded",
            });
            
        },
        selectapp:function(formData,callback){
            return $http({
                url:adminUrl3+ "Userapp/getmyapp",
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData,
                contentType: "application/x-www-form-urlencoded",
            });
        },
        getQlikChart:function(formData,callback){
            
            return    $http({
                //url:adminurl2+'chat/',
                url:adminurl2+formData.backendurl+"/",
                method: 'POST',
                // data:$.param(formData),
                data:$httpParamSerializer(formData),
                headers: {'X-CSRFToken': formData.csrfmiddlewaretoken,'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            });
        },
        changepassword:function(formData, callback) {
            
            return $http({
                url: adminUrl3 + 'Chatbotuser/changepassword',
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            });
        },
        forgotpassword:function(formData, callback) {
            
            return $http({
                url: adminUrl3 + 'Chatbotuser/forgotpassword',
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            });
        },
        isvalidpasswordresetreq:function(formData, callback) {
            
            return $http({
                url: adminUrl3 + 'Chatbotuser/isvalidpasswordresetreq',
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            });
        },
        changepassword2:function(formData, callback) {
            
            return $http({
                url: adminUrl3 + 'Chatbotuser/resetpassword',
                headers:{'authorization':$.jStorage.get('accesstoken')},
                method: 'POST',
                data: formData
            });
        },
        
    };
    //return responsedata;
});