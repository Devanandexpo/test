myApp.factory('apiService', function ($http, $q, $timeout) {
    
    //adminurl2 = "http://localhost:8000/";
    adminurl2 = "https://exponentiadata.co.in:8000/";
    adminUrl3 = "http://localhost/api/";
    adminUrl3 = "https://exponentiadata.co.in:9002/api/";
    return {

        // This is a demo Service for POST Method.
        getDemo: function (formData, callback) {
            $http({
                url: adminurl2 + 'demo/demoService',
                method: 'POST',
                data: formData
            }).success(callback);
        },
        login:function(formData, callback) {
            return $http({
                url:adminUrl3+ "Chatbotuser/backendloginuser",
                method: 'POST',
                data: formData,
            });
        },
    };
    //return responsedata;
});