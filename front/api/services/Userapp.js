var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        //required: true,
        ref: 'Chatbotuser',
    },
	userid: {
        type: String,
        required: true,
        //ref: 'Chatbotuser',
    },
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Qlikapp',
    },
});


schema.plugin(deepPopulate, {
    populate: {
        'Chatbotuser': {
            select: 'userid'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('userapp', schema,'userapp');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getmyapp: function (data, callback) {
        var appids2 = Array();
		/*Userapp.find({
            user: mongoose.Types.ObjectId(data.userid),
        }).exec(function (err, appids) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (appids) {
                    console.log(appids,"Userapps");
                    var appids2 = Array();
                    var qlikapps = require("./Qlikapp");
                    var count = 0;
                    var async = require('async');
                    //_.each(appids,function(v,k){
                    async.each(appids,
                    // 2nd param is the function that each item is passed to
                    function(item, eachCallback){
                        //console.log(v.app,"appid");
                        qlikapps.findOne({
                            _id: mongoose.Types.ObjectId(item.app),
                        }).limit(1).exec(function (err, app_data) {
                            if (err) {
                                callback(err, null);
                            } 
                            else {
                                appids2.push(app_data);
                            }
                            eachCallback();
                        });
                        
                    },
                    // 3rd param is the function to call when everything's done
                    function(err){
                        // All tasks are done now
                        if(err) {}
                        else
                        {
                            console.log("done",appids2);
                            callback(null,appids2);
                        }
                        
                    });
                    
                    
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });*/
		
		var qlikapps = require("./Qlikapp");
		qlikapps.findOne({
			//_id: mongoose.Types.ObjectId(item.app),
			//user: mongoose.Types.ObjectId(data.userid),
		}).limit(1).exec(function (err, app_data) {
			if (err) {
				callback(err, null);
			} 
			else {
				appids2.push(app_data);
				callback(null,appids2);
			}
		});
    },
};
module.exports = _.assign(module.exports, exports, model);