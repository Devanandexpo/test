var schema = new Schema({
    kpi: {
        type: String,
    },
    app: {
        type: String,
    },
    measure: {
        type: String,
    },
    query: {
        type: String,
    },
});


schema.plugin(deepPopulate, {
    populate: {
        // 'Chatbotuser': {
        //     select: 'userid'
        // }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Kpi', schema,'kpi');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getkpi: function (data, callback) {
        Kpi.find({
            app:data.appname
        }).distinct('kpi',function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    //console.log(appids,"Userapps");
                   callback(null,found);
                    
                    
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    getmeasure:function (data, callback) {
        Kpi.find({
            app:data.appname,
            kpi:data.kpi
        }).distinct('measure',function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    //console.log(appids,"Userapps");
                   callback(null,found);
                    
                    
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    getquery:function (data, callback) {
        Kpi.find({
            app:data.appname,
            measure:data.measure
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    //console.log(appids,"Userapps");
                   callback(null,found);
                    
                    
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
};
module.exports = _.assign(module.exports, exports, model);