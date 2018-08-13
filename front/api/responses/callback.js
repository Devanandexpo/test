module.exports = function(err, data) {
    var req = this.req;
    var res = this.res;
    var sails = req._sails;
    //res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "*");
    
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,     Content-Type, Accept");
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //next();
    if (err) {
        res.json({
            error: err,
            value: false
        });
    } else if (data) {
        //myApp.use(function(req, res, next) {
            
            //next();
        //});
        res.json({
            data: data,
            value: true
        });
    } else {
        res.json({
            data: "No Data Found",
            value: false
        });
    }
};
