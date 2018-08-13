var schema = new Schema({
    appid: {
        type:String,
        required: true,
    },
    dashboardurl: {
        type: Object,
        required: true,
    },
    appname: {
        type: String,
    },
    backendurl: {
        type: String,
    },
    selectionurl: {
        type: String,
    },
});


schema.plugin(deepPopulate, {
    /*populate: {
        'user': {
            select: 'fname _id'
        }
    }*/
    // populate: {
    //     'drawFormat': {
    //         select: '_id name'
    //     },
    //     'sportsListSubCategory': {
    //         select: '_id name isTeam sportsListCategory'
    //     },
    //     "sportsListSubCategory.sportsListCategory": {
    //         select: ''
    //     }
    // }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Qlikapp', schema,'qlikapp');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    logoutuser:function (data, callback) {
        
        Qlikapp.find({
            _id: mongoose.Types.ObjectId(data.userid),
            //user:data.user
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
    search:function(data,callback){
        // Chatbotuser.find({
        //     accessrole:2,
            
        // }, { _id:1,userid:1,fname:1,lname:1,email:1 }).exec(function (err, found) {
        //     if (err) {
        //         callback(err, null);
        //     } 
        //     else {
        //         if (found) {
        //             callback(null, found);
        //         } else {
        //             callback({
        //                 message: "-1"
        //             }, null);
        //         }
        //     }

        // });
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
                    fields: ['appid', 'appname','backendurl'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'appname'
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
            Qlikapp.saveData({
                appid: data.appid,
                appname: data.appname,
                dashboardurl:data.dashboardurl,
                backendurl:data.backendurl,
                selectionurl:data.selectionurl,
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
            Qlikapp.findOneAndUpdate({
                _id: data._id,
            },{ $set: { appid: data.appid,
                appname: data.appname,
                dashboardurl:data.dashboardurl,
                backendurl:data.backendurl,
                selectionurl:data.selectionurl }}).exec(function (err, found) {
                if (err) {
                    callback(err, null);
                } 
                else {
                    if (found) {
                        var userapps = require("./Userapp");
                        userapps.remove({
                            app: mongoose.Types.ObjectId(data._id),
                        }).exec(function (err, found2) {
                            if (err) {
                                callback(err, null);
                            } 
                            else {
                                if (found2) {
                                    var async = require('async');
                                    //found.userapp = userappdata;
                                    async.each(data.userapp,
                                    // 2nd param is the function that each item is passed to
                                    function(item, eachCallback){
                                        //console.log(v.app,"appid");
                                        var chatbotuser = require("./Chatbotuser");
                                        userapps.saveData({
                                            user: mongoose.Types.ObjectId(item._id),
                                            app: mongoose.Types.ObjectId(data._id),
                                        },function (err, found3) {
                                            if (err) {
                                                callback(err, null);
                                            } 
                                            else {
                                                //userid2.push(user_data);
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
                                            callback(null,found);
                                        }
                                        
                                    });
                                } else {
                                    callback({
                                        message: "-1"
                                    }, null);
                                }
                            }

                        });
                        //callback(null, found);
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
        Qlikapp.findOne({
            _id: data._id
        }).deepPopulate(deepSearch).lean().exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var userapps = require("./Userapp");
                userapps.find({
                    app: mongoose.Types.ObjectId(data._id)
                }).populate({path:'Chatbotuser', select:'userid'}).exec(function (err2, userappdata) {
                    if (err) {
                        callback(err, null);
                    }
                    else if (_.isEmpty(found)) {
                        
                        callback(null, []);
                    } else {
                        userid2 = Array();
                        var async = require('async');
                        //found.userapp = userappdata;
                        async.each(userappdata,
                        // 2nd param is the function that each item is passed to
                        function(item, eachCallback){
                            //console.log(v.app,"appid");
                            var chatbotuser = require("./Chatbotuser");
                            chatbotuser.findOne({
                                _id: mongoose.Types.ObjectId(item.user),
                            },{_id:1,userid:1}).limit(1).exec(function (err, user_data) {
                                if (err) {
                                    callback(err, null);
                                } 
                                else {
                                    userid2.push(user_data);
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
                                console.log("done",userid2);
                                found.userapp = userid2;
                                callback(null,found);
                            }
                            
                        });
                        //callback(null, found);
                    }
                });
            }
        });
    },
    delete: function (data, callback) {
        Qlikapp.remove({
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
};
module.exports = _.assign(module.exports, exports, model);