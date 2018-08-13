var schema = new Schema({
    questions: {
        type: String,
    },
    category: {
        type: String,
    },
    link: {
        type: String,
    },
    answers: {
        type: String,
    },
    final: {
        type: String,
    },
    qlikapp: {
        type:Object,
        //type: Schema.Types.ObjectId,
        appid:{
            type: Schema.Types.ObjectId,
            ref: 'Qlikapp',
        },
        appname:{
            type:String
        }
        
        
    },
    searchcount: {
        type:Number,
        default: 0,
    }
});

schema.plugin(deepPopulate, {
    
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Chatbotautocomplete', schema,'chatbotautocomplete');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "chatbotautocomplete", "chatbotautocomplete"));
//new RegExp(searchstring)
//{ $regex: searchstring, $options: 'i' }
var model = {
    getautocomplete: function (data, callback) {
        //console.log("data", data)
        searchstring=data.string;
        searchstring = "/"+searchstring+"/";
        var obj = { 
            questions:{ $regex: '.*' + data.string + '.*',$options:"i" },
            'qlikapp.appname':data.appname
        };
        
        if(data.topic != '')
            obj = {
                questions:{ $regex: '.*' + data.string + '.*',$options:"i" },
                'qlikapp.appname':data.appname
            };
        Chatbotautocomplete.find(obj, {  questions:1,answers:1 }).limit(4).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    search:function(data,callback){
        
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['questions'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'questions'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        var Search = Model.find(data.filter)

            .order(options)
            // .deepPopulate(deepSearch)
            .keyword(options)
            .page(options, callback);
    },
    save:function(data,callback){
        if(!data._id)
        {
            var appobj = {appid:mongoose.Types.ObjectId(data.qlikapp._id),appname:data.qlikapp.appname};
            Chatbotautocomplete.saveData({
                questions: data.questions,
                qlikapp: appobj,
                searchcount:0,
            },function (err, found) {
                if (err) {
                    callback(err, null);
                } 
                else {
                    if (found) {
                        callback(null, found);
                    } else {
                        callback({
                            message: "-1"
                        }, null);
                    }
                }

            });
        }
        else
        {
            Chatbotautocomplete.findOneAndUpdate({
                _id: data._id,
            },{ $set: { questions: data.questions,
                qlikapp: appobj }}).exec(function (err, found) {
                if (err) {
                    callback(err, null);
                } 
                else {
                    if (found) {
                        callback(null, found);
                    } else {
                        callback({
                            message: "-1"
                        }, null);
                    }
                }

            });
        }
    },
    getOne: function (data, callback) {
        var deepSearch = "";
        Chatbotautocomplete.findOne({
            _id: data._id
        }).deepPopulate(deepSearch).lean().exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var qlikapp = require("./Qlikapp");
                qlikapp.find({
                    
                }).exec(function (err2, qlikappdata) {
                    if (err) {
                        callback(err, null);
                    }
                    else if (_.isEmpty(found)) {
                        
                        callback(null, []);
                    } else {
                        found.qlikapps = qlikappdata;
                        callback(null, found);
                    }
                });
            }
        });
    },
    delete: function (data, callback) {
        Chatbotautocomplete.remove({
            _id: mongoose.Types.ObjectId(data._id),
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    getfullautocomplete: function (reqobj,data, callback) {
		/*reqobj.session.userid= reqobj.session.userid;
		reqobj.session.sessionid=reqobj.session.sessionid;
		if(reqobj.session.qticket) {
			reqobj.session.qticket= reqobj.session.qticket;
		}
        reqobj.session.appname=data.appname;
        reqobj.session.appid=data.appid;
        reqobj.session.app_id=data.app_id;
        reqobj.session.dashboardurl=data.dashboardurl;
        reqobj.session.backendurl=data.backendurl;*/
		var token = reqobj.headers["authorization"];
        Chatbotautocomplete.find({'qlikapp.appname':data.appname}, {  questions:1,answers:1,qlikapp:1 }).limit(10).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
					var Chatbotuserlogs = require("./Chatbotuserlogs");
					Chatbotuserlogs.findOneAndUpdate({
						token: token,
					},{ $set: { appid: data.appid,appname:data.appname,app_id:mongoose.Types.ObjectId(data.app_id),dashboardurl:data.dashboardurl,backendurl:data.backendurl }}).exec(function (err, found2) {
						if (err) {
							//callback(err, null);
						} 
						else {
							if (found) {
								//callback(null, found);
							} else {
								/*callback({
									message: "-1"
								}, null);*/
							}
						}

					});
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    gettopqueries: function (data, callback) {
        Chatbotautocomplete.find({'qlikapp.appname':data.appname}, {  questions:1,answers:1,qlikapp:1 }).sort({searchcount: -1}).limit(20).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
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