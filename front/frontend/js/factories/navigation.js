myApp.factory('NavigationService', function ($http) {
   
    var navigation = [{
            name: "Home",
            classis: "active",
            anchor: "home",
            subnav: [{
                name: "Subnav1",
                classis: "active",
                anchor: "home"
            }]
        }, {
            name: "Form",
            classis: "active",
            anchor: "form",
            subnav: []
        },
        {
            name: "Grid",
            classis: "active",
            anchor: "grid",
            subnav: []
        }
    ];

    return {
        getNavigation: function () {
            return navigation;
        },
        
    };
});