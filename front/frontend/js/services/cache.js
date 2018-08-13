myApp.service('myCache', function (CacheFactory) {
    //var profileCache;
    if (angular.isUndefined(CacheFactory.get('profileCache'))) {
        //profileCache = CacheFactory('profileCache');
        var localStoragePolyfill = {
            getItem: function (key) {  },
            setItem: function (key, value) {  },
            removeItem: function (key) {  }
        };
        // var storeJsToStandard ={
        //     getItem: store.get,
        //     setItem: store.set,
        //     removeItem: store.remove
        // };
        CacheFactory.createCache('profileCache', {
            //recycleFreq: 60000,
            maxAge: 300*24*60*60*1000, // Items added to this cache expire after 15 minutes.
            //cacheFlushInterval: 30*24*60*60*1000, // This cache will clear itself every hour.
            deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage', // This cache will use `localStorage`.
            //storageImpl: localStoragePolyfill
            storagePrefix:'localStorage'
        });
        // CacheFactory('profileCache', {
        //     maxAge: 30*24*60*60*1000, // Items added to this cache expire after 15 minutes.
        //     cacheFlushInterval: 30*24*60*60*1000, // This cache will clear itself every hour.
        //     deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
        //     storageMode: 'localStorage' // This cache will use `localStorage`.
        // });
        
    }
    // else
    // {
    //     console.log("Exist");
    //     profileCache=CacheFactory('profileCache');
    // }
    var profileCache=CacheFactory.get('profileCache');
    
    this.get = function(key) {
        //console.log(localStorage.getItem(key));
        //return localStorage.getItem(key);
        //console.log(profileCache.keys());
        var info = profileCache.info();
         //localStorage.setItem(key,value);
         
        return profileCache.get(key); 
        //return profileCache.getItem(key); 
        
    };
    this.putkey = function(key,value){
        
        var info = profileCache.info();
         //localStorage.setItem(key,value);
         
        if(key !='')
            profileCache.put(key,value,{ maxAge: 30*24*60*60*1000, deleteOnExpire: 'aggressive' });
        //console.log(profileCache.keys());
        //profileCache.setItem(key,value,{ maxAge: 30*24*60*60*1000, deleteOnExpire: 'aggressive' });
    };
});