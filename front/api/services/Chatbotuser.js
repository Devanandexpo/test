var schema = new Schema({
    fname: {
        type: String,
        //required: true,
    },
    lname: {
        type: String,
        //required: true,
    },
    name:{
        type:String,
    },
    email: {
        type: String,
        //validate: validators.isEmail(),
        //unique: true
    },
    password: {
        type: String,
        required: true,
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    // accessToken: {
    //     type: [String],
    //     index: true
    // },
    accessrole: {
        type: String,
    },
    // branch: {
    //     type: String,
    //     //required: true,
    // },
    expirydate: {
        type: Date,
    },
    resetpasswordtoken: {
        type: String,
    },
    userid: {
        type: String,
    },
});


var userlogschema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    login_date: {
        type: Date,
    },
    logout_date: {
        type: Date,
    },
    ip_address: {
        type: String,
    }
});
var failedloginschema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    password: {
        type: Date,
    },
    ip_address: {
        type: String,
    },
    login_date: {
        type: Date,
        default: Date.now 
    },
});

schema.plugin(deepPopulate, {
    /*populate: {
        'user': {
            select: 'fname _id'
        }
    }*/
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
//userlogschema.plugin(uniqueValidator);
//userlogschema.plugin(timestamps);
//userlogschema = require('userlogschema');

//var pythonpath = "http://localhost:8096/script/";
function checkIfEmailInString(text) { 
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
}
module.exports = mongoose.model('chatbotuser', schema,'chatbotuser');
var chatbot_user_logs = mongoose.model('chatbot_user_logs', userlogschema,"chatbot_user_logs");
var failed_login= mongoose.model('failed_login', failedloginschema,"failed_login");
var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    searchqlikuser:function(data,callback){
        // Chatbotuser.find({accessrole:2},{_id:1,fname:1,lname:1}).lean().exec(function (err, found) {
        //     if (err) {
        //         callback(err, null);
        //     } else {
        //         if (_.isEmpty(found)) {
        //             callback(null, []);
        //         } else {
        //             callback(null, found);
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
                    fields: ['userid'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'userid'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        //data.filter.accessrole = 2;
        var Search = Model.find(data.filter)

            .order(options)
            // .deepPopulate(deepSearch)
            .keyword(options)
            .page(options, callback);
    },
    searchCall:function(data,callback){
        Chatbotuser.find({accessrole:2},{_id:1,fname:1,lname:1}).lean().exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, []);
                } else {
                    callback(null, found);
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
                    fields: ['fname', 'lname','email','userid'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'userid'
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
            sha256=require("sha256");
            Chatbotuser.saveData({
                userid: data.userid,
                fname: data.fname,
                lname:data.lname,
                password:sha256(data.password),
                email:data.email,
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
            Chatbotuser.findOneAndUpdate({
                _id: data._id,
            },{ $set: { fname: data.fname,lname:data.lname,email:data.email,userid:data.userid }}).exec(function (err, found) {
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
        Chatbotuser.findOne({
            _id: data._id
        }).deepPopulate(deepSearch).lean().exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },
    delete: function (data, callback) {
        Chatbotuser.remove({
            _id: mongoose.Types.ObjectId(data._id),
            userid:data.userid
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
    backendloginuser: function (data, callback) {
        Chatbotuser.findOne({
            accessrole:2,
            userid: data.username,
            password: data.password,
        }, { _id:1,userid:1,fname:1,lname:1 }).limit(1).exec(function (err, found) {
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
    loginuser: function (reqobj,data, callback) {
        //console.log("data", data)
        var ip = require('ip');
        var ip_address = ip.address("public","ipv4");
		var ActiveDirectory = require('activedirectory');
		var uname = "";
		if(uname == 'palaash')
			uname =='palaash';
		else
			uname="MAHINDRA\\"+data.username;
		var config = { url: 'ldap://10.2.156.35',
					   baseDN: 'dc=corp,dc=mahindra,dc=com,dc=MMDC-KND2,dc=MMDC-KND3,dc=MMDC-KND4',
					   username: uname,
					   password: data.password,
						
					   //attributes: {
                                 //user: [  'mail', 'userPrinicipalName' ],
                                 //group: [ 'cn','description', 'objectCategory' ]
                               //}
					};
		var ad = new ActiveDirectory(config);
		ad.authenticate(uname, data.password, function(err, found) {
		  
			if (found) {
				console.log('Authenticated!',found);
				found = {};
				found.userid = data.username;
				//found = found.toObject();
				var userLogs = require("./Chatbotuserlogs");
				var jwt = require('jsonwebtoken');
				var token = jwt.sign(found, env2.DB_TOKEN_KEY, {
					expiresIn: '8h'
				});
				var sessiondata = userLogs({token:token,userid:data.username,login_date:(new Date()),ip_address:ip_address,logout_date:new Date()});
				chatbot_user_logs.findOne().sort([['createdAt', -1]]).exec(function(err2, docs) { 
					sessiondata.save(function (err,result) {
						if (err) {
								return err;
						}
						else {

							
							var http = require('http');
							var options = {
								hostname: 'exponentiadata.co.in',
								path:'/qlikauth/qlikauth.php?userid='+data.username,
							};
							
							http.get('http://localhost/qlikauth/qlikauth.php?userid='+data.username, function(res) { 
								//console.log("Got response: " + res.statusCode);
								//console.log("res",res);
								res.on("data", function(chunk)
								{
									
									//found = found.toObject();
									//var r = result.toObject();
									/*var sAMAccountName = data.username;
									//console.log(sAMAccountName);
									//var config = { url: 'ldap://bluestarindia.com',
												   //baseDN: 'dc=bluestartindia,dc=com',
												   //username: uname,
												   //password: data.password }
									//var ad = new ActiveDirectory(config);
									userPrincipalName =data.username+"@bluestarindia.com";
									var dn = 'CN='+sAMAccountName+'\\, OU=Users,DC=bluestartindia,DC=com';
									ad.opts.bindDN = data.username;
									ad.opts.bindCredentials = data.password;
									var opts = {
									  username: data.username,
									  password: data.password
									};*/
									/*ad.findUser(opts,sAMAccountName, function(err, userdata) {
									  if (err) {
										console.log('ERROR: ' +JSON.stringify(err));
										//return;
									  }
									 
									  if (! userdata) console.log('User: ' + sAMAccountName + ' not found.');
									  else console.log(JSON.stringify(userdata));
									});
									var query = 'cn='+data.username+'*';
 
									ad.findUsers(query, true, function(err, users) {
									  if (err) {
										console.log('ERROR: ' +JSON.stringify(err));
										return;
									  }
									 
									  if ((! users) || (users.length == 0)) console.log('No users found.');
									  else {
										console.log('findUsers: '+JSON.stringify(users));
									  }
									});
									var query = 'cn=anshuman*';
 
									ad.findUsers(query, true, function(err, users) {
									  if (err) {
										console.log('ERROR: ' +JSON.stringify(err));
										return;
									  }
									 
									  if ((! users) || (users.length == 0)) console.log('No users found.');
									  else {
										console.log('findUsers: '+JSON.stringify(users));
									  }
									});*/
									if(docs)
										found['last_login'] = docs;
									found.token=token;
									found.fname=data.username;
									found['sessionid']= data.username;
									found['_id']=data.username;
									found['chunk']=JSON.parse(chunk);
									reqobj.session.userid=data.username;
									reqobj.session.qticket=found.chunk.Ticket;
									reqobj.session.sessionid=found.sessionid;
									var Chatbotuserlogs = require("./Chatbotuserlogs");
									Chatbotuserlogs.findOneAndUpdate({
										token: token,
									},{ $set: { qticket: found.chunk.Ticket,sessionid:found.sessionid }}).exec(function (err, found2) {
										if (err) {
											//callback(err, null);
										} 
										else {
											if (found2) {
												//callback(null, found);
											} else {
												
											}
										}

									});
									callback(null, found);
									/*if(data.username == 'palaash' || data.username == 'Palaash')
									{
										resobj = {userid:data.username,"_id":data.username,chunk:JSON.parse(chunk),last_login:docs,sessionid:data.username,fname:data.username};
										callback(null, resobj);
									}
									else
									{
										http.get('http://localhost/qlikauth/ldap.php?userid='+data.username, function(res2) {
											resobj = {userid:data.username,"_id":data.username,chunk:JSON.parse(chunk),last_login:docs,sessionid:data.username,fname:data.username};
											//console.log('chunk',JSON.parse(chunk));
											//console.log(res2);
											var resobj2="";
											res2.on("data", function(chunk2)
											{
												resobj2+=chunk2;
											});
											res2.on("end", function(chunk2)
											{
												function extend(target) {
													var sources = [].slice.call(arguments, 1);
													sources.forEach(function (source) {
														for (var prop in source) {
															target[prop] = source[prop];
														}
													});
													return target;
												}
												//console.log(resobj2,'AD');
												chunkdata = JSON.parse(resobj2);
												var object3 = extend({}, resobj, chunkdata);
												//console.log(object3,'got data');
												
												reqobj.session.userid=data.username;
												reqobj.session.qticket=chunkdata.chunk.Ticket;
												reqobj.session.sessionid=found.sessionid;
												callback(null, object3);
												
											});
										}).on('error', function(e) 
										{ 
											console.log("Got error: " + e.message);
											callback(null, resobj);
										});
									}*/
								}); 
							}).on('error', function(e) 
							{ 
								console.log("Got error: " + e.message); 
							});
							
							
							
							
						}
					});
				});
				
			}
			  else {
				console.log('Authentication failed!',err);
				callback(err, null);
			}
		});
		/*
        Chatbotuser.findOne({
            //email: data.username,
            userid: data.username,
            password: data.password,
        }, { _id:1,userid:1,fname:1 }).limit(1).exec(function (err, found) {
            if (err) {
                
                callback(err, null);
                
            } 
            else {
                if (found) {
                    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    // console.log("user name",data)
					found = found.toObject();
                    var userLogs = require("./Chatbotuserlogs");
					var jwt = require('jsonwebtoken');
					var token = jwt.sign(found, env2.DB_TOKEN_KEY, {
						expiresIn: '8h'
					});
                    var sessiondata = userLogs({token:token,userid:data.username,luser:found._id,login_date:(new Date()),ip_address:ip_address,logout_date:new Date()});
                    chatbot_user_logs.findOne().sort([['createdAt', -1]]).exec(function(err2, docs) { 
                        sessiondata.save(function (err,result) {
							// console.log("sessiondata.save console---",err,result,err2,docs);
                            if (err) {
                                    return err;
                            }
                            else {

                                
                                // console.log(result,"logsaved");
                                var http = require('http');
                                var options = {
                                    hostname: 'exponentiadata.co.in',
                                    path:'/qlikauth/qlikauth.php?userid='+data.username,
                                };
                                //console.log(env2.DB_TOKEN_KEY,"sess");
								
                                //console.log(token,"sess");
                                var q_id = data.username;
								if(q_id == 'samir.bhor')
									q_id='seema_vohra';
                                http.get('http://localhost/qlikauth/qlikauth.php?userid='+q_id, function(res) { 
                                    //console.log("Got response: " + res.statusCode);
                                    //console.log("res",res);
                                    res.on("data", function(chunk)
                                    {
										// console.log(chunk,"chunk");
                                        
										
										found.token=token;
                                        var r = result.toObject();
                                        if(docs)
                                            found.last_login = docs;
                                        found.sessionid = found._id;
                                        found.chunk=JSON.parse(chunk);
                                        reqobj.session.userid=data.username;
                                        reqobj.session.qticket=found.chunk.Ticket;
                                        reqobj.session.sessionid=found.sessionid;
                                        
                                        var jwt = require("jsonwebtoken");
										var Chatbotuserlogs = require("./Chatbotuserlogs");
                                        Chatbotuserlogs.findOneAndUpdate({
											token: token,
										},{ $set: { qticket: found.chunk.Ticket,sessionid:found.sessionid }}).exec(function (err, found) {
											if (err) {
												//callback(err, null);
											} 
											else {
												if (found) {
													//callback(null, found);
												} else {
													
												}
											}

										});
                                        callback(null, found);
										
                                    }); 
                                }).on('error', function(e) 
                                { 
                                    console.log("Got error: " + e.message); 
                                });

                                
                                
                                
                            }
                        });
                    });
                    
                } else {
                    var failedLogs = require("./Failedlogin");
                    
                    var fld = failedLogs({
                        userid: data.username,
                        password: data.password,
                        ip_address:ip_address,
                    });
                    fld.save({
                        userid: data.username,
                        password: data.password,
                        ip_address:ip_address,
                    },function (err2, faildlogin2) {
                        console.log(err2);
                        console.log(faildlogin2);
                    });
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });*/
    },
    changepassword: function (data, callback) {
        Chatbotuser.findOneAndUpdate({
            _id: data.userid,
            password: data.oldpassword,
        },{ $set: { password: data.newpassword }}).exec(function (err, found) {
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
    forgotpassword: function (data, callback) {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);
        var d = new Date(tomorrow),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        expiry= [year, month, day].join('-');
        expiry=new Date(expiry+"T23:59:59");
        Chatbotuser.findOneAndUpdate({
            email: data.email,
        },{ $set: { resetpasswordtoken: data.resettoken,expirydate:expiry }}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    const sendmail = require('sendmail')({
                        logger: {
                            debug: console.log,
                            info: console.info,
                            warn: console.warn,
                            error: console.error
                        },
                        silent: false,
                        // dkim: { // Default: False 
                        //     privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
                        //     keySelector: 'mydomainkey'
                        // },
                        // devPort: 1025 // Default: False 
                        // devHost: 'localhost' // Default: localhost 
                    });
                    var ptext = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < 9; i++)
                    {
                        ptext += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    
                    htmlcode="<p>Dear "+found.fname+"</p><p>You requested password change.</p><p>Your new password: "+ptext+" </p>  Thanks,";
                    sha256=require("sha256");
                    ptext = sha256(ptext);
                    
                    //htmlcode="<p>Dear "+found.fname+"</p><br>You can use the following link within the next day to reset your password: <a href='https://exponentiadata.co.in:8095/"+data.resettoken+"'>Click Here</a><br><br>If you don’t use this link within 24 hours, it will expire<br><br> Thanks,";
                    sendmail({
                        from: 'rohit.mathur@exponentiadata.com',
                        to: data.email,
                        subject: "Lost Password Request",
                        html: htmlcode,
                        //attachments:attachments1,
                    }, function(err, reply) {
                        console.log(err && err.stack);
                        console.dir(reply);
                        if(!err)
                        {
                            callback(null, found.email);      
                            //callback(null,{message:1});
                            Chatbotuser.findOneAndUpdate({
                                _id: found._id,
                            },{ $set: { password: ptext }}).exec(function (err, found2) {
                                // if (err) {
                                //     callback(err, null);
                                // } 
                                // else {
                                //     if (found) {
                                //         callback(null, found);
                                //     } else {
                                //         callback({
                                //             message: "-1"
                                //         }, null);
                                //     }
                                // }

                            });
                        }
                    });
                    //callback(null, found.email);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    isvalidpasswordresetreq: function (data, callback) {
        
        Chatbotuser.findOne({
            resetpasswordtoken: data.resettoken,
            
        },{ expirydate: 1, _id:0 }).limit(1).exec(function (err, found) {
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
    resetpassword:function (data, callback) {
        
        Chatbotuser.findOneAndUpdate({
            resetpasswordtoken: data.resettoken,
            
        },{$set : {resetpasswordtoken: "",password:data.password}}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found.email);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    sendmail:function (data, callback) {
        // var attachments1 = new Array();
        // var img = new Array();
        // //var m_html = "<html><body>";
		var senderid = "";
		if(checkIfEmailInString(data.userid))
			senderid=data.userid;
		else
			senderid=data.userid+'@mahindra.com';
        var m_html = "";
        // img = data.images;
        m_html +=data.text+"<br>";
        var subjecttext = "";
        if(data.subject != "")
            subjecttext = data.subject;
        else    
            subjecttext = "Detailed Analysis";
        // console.log(img.length);
        // _.each(img,function(v,k){
        //     //m_html += "<img src='"+v+"'>";
        //     obj = {"path":v};
        //     attachments1.push(obj);
        // });
        // //m_html += "</body></html>";
        m_html += "";
        // sendmail({
        //     from: 'rohit.mathur@exponentiadata.com',
        //     to: data.email,
        //     subject: 'Detailed Analysis',
        //     html: m_html,
        //     attachments:attachments1,
        // }, function(err, reply) {
        //     console.log(err && err.stack);
        //     console.dir(reply);
        //     if(!err)
        //         callback(null,{message:1});
        // });
        //var capture = require('phantomjs-capture');
        var async = require('async');
        var attachments1 = new Array();
        var img = new Array();
        var webshot = require('webshot');
        //var Screenshot = require('url-to-screenshot');
        var fs = require('fs');
        img = data.images;
        var Ticket = data.Ticket;
        var key = 0;    
        const streamToBuffer = require('stream-to-buffer');
        var http = require('http');
		var q_id = data.userid;
		if(q_id == 'samir.bhor')
			q_id='seema_vohra';
        var options = {
            hostname: 'exponentiadata.co.in',
            path:'/qlikauth/qlikauth.php?userid='+q_id,
        };
        
        async.each(data.images,
            // 2nd param is the function that each item is passed to
            function(item, eachCallback){
                    
                    ///setTimeout(function() {   
                        // url-toscreenshot
                        // new Screenshot(item)
                        // .width(420)
                        // .height(420)
                        // .clip()
                        // .capture()
                        // .then(imgData => {
                        //     if(!imgData){
                        //         console.log('Could not take screenshot for this url');
                        //         return false;
                        //     }
                        //     var file = __dirname+'/test'+key+'.png';
                        //     fs.writeFileSync(file, imgData);
                        //     attachments1.push(file);
                        //     key++;
                        //     eachCallback();
                        // });
                            //console.log(item+"?qlikTicket="+Ticket);
                        //console.log("res",res);
                        //console.log(chunk);
                        //url = item.slice( 0, item.indexOf('?') );
				var q_id = data.userid;
				if(q_id == 'samir.bhor')
					q_id='seema_vohra';
                http.get('http://localhost/qlikauth/qlikauth.php?userid='+q_id, function(res) { 
                    res.on("data", function(chunk)
                    {
                        //console.log(item);
                        url = item;
                        //var stringify = JSON.stringify(chunk);
                        newchunk=JSON.parse(chunk);
						console.log(newchunk);
                        url = url+"?qlikTicket="+newchunk.Ticket;
                        //url =url.replace(/(^\w+:|^)\/\//, '');
                        //webshot
                        var dt = new Date();
                        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()+key;
                        var filename1 = "";
                        var options = {
                            windowSize:{ width: 1024, height: 768 },
                            shotSize: {
                                width: 'window',height: 'window'
                            },
							phantomConfig: {'ignore-ssl-errors': 'true'},
							phantomPath: "C:\\ProgramData\\win32\\phantomjs-2.1.1-windows\\phantomjs-2.1.1-windows\\bin\\phantomjs.exe",
                            userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'+ ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g',
                            renderDelay:40000,
                            // onLoadFinished: function() {
                                
                            //     console.log(url,"new url"+time+"key-"+key);
                            //     //eachCallback();
                            // },
                            //takeShotOnCallback:true,
                            //timeout:60000
                        };
                        var filename1 = dt.getTime()+key+'.png';
						/*
                        webshot(url,filename1 , options, function(err) {
                        // screenshot now saved to hello_world.png
                            //console.log(url,"new url"+time+"key-"+key);
                            //eachCallback();
                            // setTimeout(function(){
                                
                            //     //document.write("getTime() : " + dt.getTime() ); 
								console.log(err);
                                console.log(url,"new url");
                                var filedata = {filename:filename1,content: fs.createReadStream(filename1)};
                                attachments1.push(filedata);
                                key++;
                                eachCallback();
                        //    / },60000);
                            
                        });*/
						//var jar = require('selenium-server-standalone-jar');
						//console.log(jar.path);
						//console.log(jar.version);
						require('chromedriver');
						var chrome = require('selenium-webdriver/chrome');
						var webdriver = require('selenium-webdriver'),
							SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;

						/*var server = new SeleniumServer(jar.path, {
						  port: 4444
						});*/

						//server.start();

						//const webdriver = require('selenium-webdriver');
						
						//var chrome = require('selenium-webdriver/chrome');
						//var firefox = require('selenium-webdriver/firefox');

						var driver = new webdriver.Builder().forBrowser('chrome').build();
						//var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
						var until = webdriver.until;
					var By = webdriver.By;
						/*driver.get(url).catch(function(error) {
						  console.error(error);
						  return 1;  // TODO: implement this
						});*/
						driver.get(url).then(function() {
							driver.sleep(20000);
							driver.takeScreenshot().then(function (base64Image) {
								var decodedImage = new Buffer(base64Image, 'base64');
								fs.writeFile(filename1, decodedImage, function(err) {
									var filedata = {filename:filename1,content: fs.createReadStream(filename1)};
									setTimeout(function () {
									attachments1.push(filedata);
									key++;
									driver.quit();
									eachCallback();
									//console.log('took screenshot');
									},20000);
								});
								
							});
						});
						/*
						function scr() {
							
							driver.takeScreenshot().then(function (base64Image) {
								var decodedImage = new Buffer(base64Image, 'base64');
								fs.writeFile(filename1, decodedImage, function(err) {});
								var filedata = {filename:filename1,content: fs.createReadStream(filename1)};
								attachments1.push(filedata);
								key++;
								driver.quit();
								eachCallback();
								console.log('took screenshot');
							});
						}*/
						//driver.sleep(10000);
						//driver.wait(until.elementLocated(by.id('QV01')), 10000, 'Could not locate the child element within the time specified');
						/*
						driver.wait(function() {
						 
						},10000,'CRITICAL ERROR: process image time out at' , 3000).scr().end();*/
						/*
						driver.wait(until.elementLocated(
							By.id("QV01")), 10 * 1000).then(function(element) {
							driver.sleep(1000);
							//var input = driver.findElement(By.id('QV01'));

							//input.sendKeys('engine');
							driver.takeScreenshot().then(function (base64Image) {
								var decodedImage = new Buffer(base64Image, 'base64');
								fs.writeFile(filename1, decodedImage, function(err) {});
								var filedata = {filename:filename1,content: fs.createReadStream(filename1)};
								attachments1.push(filedata);
								key++;
								driver.quit();
								eachCallback();
								console.log('took screenshot');
							});
							
								
							//element.click();
						});*/
						
					
						
						//});
						/*driver.wait(function () {
							return driver.document.getElementsByTagId("QV01");
						}, 10000);*/
						//setTimeout(function () {
						
						//},20000);
                        
                    }); 
                }).on('error', function(e) 
                { 
                    console.log("Got error: " + e.message); 
                });
                        // var renderStream = webshot(url,options);
                        // var file = fs.createWriteStream('scr'+key+'.png', {encoding: 'binary'});
                        
                        // renderStream.on('data', function(data) {
                        //     file.write(data.toString('binary'), 'binary');
                        //     var filedata = { filename:'scr'+key+'.png',contentType: 'image/png'};
                        //     attachments1.push(filedata);
                        //     key++;
                        //     eachCallback();
                        // });
                        // streamToBuffer(renderStream, (err, buffer) => {
                        //     if (err) {
                        //         console.error(err.stack);
                        //         throw err;
                        //     }

                        //     var base64String = buffer.toString('base64');
                        //     //Now you have base64 encoded screen shot. Use it however you want.
                        //     console.log(base64String);
                        //     var obj1 = { path:base64String  };
                        //     attachments1.push(obj1);
                        //     key++;
                        //     eachCallback();
                        // });
                        
                        
                        //},60000);
                        
                    },
                    // 3rd param is the function to call when everything's done
                    function(err){
                        // All tasks are done now
                        if(err) {}
                        else
                        {
                            //console.log("done",attachments1);
                            //callback(null,{message:1});
							
                            const sendmail = require('sendmail')({
                                logger: {
                                    debug: console.log,
                                    info: console.info,
                                    warn: console.warn,
                                    error: console.error
                                },
                                silent: false,
								//host:"mtazimbra.bluestarindia.com",
								//port: 25,
								secure: false,
                                // dkim: { // Default: False 
                                //     privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
                                //     keySelector: 'mydomainkey'
                                // },
                                 devPort: 25, // Default: False 
                                 devHost: '10.2.202.42' // Default: localhost 
                            });
							
							sendmail({
								from: senderid,
								to: data.email,
								subject: subjecttext,
								html: m_html,
								attachments:attachments1,
							}, function(err, reply) {
								console.log(err && err.stack,"mail err");
								console.dir(reply,"mail reply");
								if(!err)
									{
										attachments1.forEach(function(atch) {
											fs.unlink(atch.filename);
										});
										callback(null,{message:1});
									}
							});
							/*http.get('http://localhost/qlikauth/ldap.php?userid='+data.userid, function(res3) {
								resobj123 = "";
								res3.on("data", function(mailobj)
								{
									resobj123+=mailobj;
								});
								res3.on("end", function()
								{
									console.log(resobj123,'mailobh');
									var mail_obj=JSON.parse(resobj123);
									sendmail({
										from: mail_obj.email,
										to: data.email,
										subject: subjecttext,
										html: m_html,
										attachments:attachments1,
									}, function(err, reply) {
										console.log(err && err.stack,"mail err");
										console.dir(reply,"mail reply");
										if(!err)
											{
												attachments1.forEach(function(atch) {
													fs.unlink(atch.filename);
												});
												callback(null,{message:1});
											}
									});
								});
							}).on('error', function(e){ 
								sendmail({
									from: "pratik.shah@exponentiadata.com",
									to: data.email,
									subject: subjecttext,
									html: m_html,
									attachments:attachments1,
								}, function(err, reply) {
									console.log(err && err.stack,"mail err");
									console.dir(reply,"mail reply");
									if(!err)
										{
											attachments1.forEach(function(atch) {
												fs.unlink(atch.filename);
											});
											callback(null,{message:1});
										}
								});
							});*/
                                    //callback(null,{message:1});
                        }
                    
                    }
                );
           
        

        // _.each(img,function(v,k){
        //     console.log(item);    
        //     capture({
        //         dir: '.',
        //         output: 'xx'+key+'.png',
        //         url: item,
        //         size: '500x500',
        //         domHook: 'QV01',
        //         screenTimer: 6000
        //     }, function(err, result) {
        //         obj = {"path":v};
        //         attachments1.push(obj);
        //         console.log(result.fullPNGPath);        // PNG PATH
        //         // console.log(result.filePNGName);        // PNG File Name
        //         // console.log(result.fileHTMLPath);       // HTML PATH
        //         // console.log(result.fileHTMLName);       // HTML File Name
        //     });
            
        // });
        // var childProcess = require('child_process');

        // function newEmail(){
        //     childProcess.spawn(
        //         "powershell.exe",
        //         ['$mail = (New-Object -comObject Outlook.Application).CreateItem(0);' +
        //         '$mail.Attachments.Add("C:\Users\admin\desktop\myproject\temp\testing.pdf");' +
        //         '$mail.Subject = "Some text";' +
        //         '$mail.Display();']
        //     );
        // }
    },
    getnewticket:function (reqobj,data, callback) {
        var http = require('http');
        var options = {
            hostname: 'exponentiadata.co.in',
            path:'/qlikauth/qlikauth.php?userid='+data.userid,
        };
		var q_id = data.userid;
		if(q_id == 'samir.bhor')
			q_id='seema_vohra';
        http.get('http://localhost/qlikauth/qlikauth.php?userid='+q_id, function(res) { 
            res.on("data", function(chunk)
            {
                var found = {};
                found.chunk=JSON.parse(chunk);
				/*reqobj.session.userid= reqobj.session.userid;
				reqobj.session.sessionid=reqobj.session.sessionid;
				if(reqobj.session.appid) {
					reqobj.session.appname= reqobj.session.appname;
					reqobj.session.appid= reqobj.session.appid;
					reqobj.session.app_id= reqobj.session.app_id;
					reqobj.session.dashboardurl= reqobj.session.dashboardurl;
					reqobj.session.backendurl= reqobj.session.backendurl;
				}
                reqobj.session.qticket=found.chunk.Ticket;*/
				var Chatbotuserlogs = require("./Chatbotuserlogs");
				Chatbotuserlogs.findOneAndUpdate({
					token: data.token,
					
				},{ $set: { qticket: found.chunk.Ticket }}).exec(function (err, found) {
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
            }); 
        }).on('error', function(e) 
        { 
            console.log("Got error: " + e.message); 
        });
    },
    getsessiondata: function (reqobj,data, callback) {
        //console.log(reqobj.session,"session");
		if(!reqobj.session.userid) {
			callback({
				message: "-1"
			}, null);
		} else  {
			var Chatbotuserlogs = require("./Chatbotuserlogs");
			Chatbotuserlogs.findOne({
				token: data.data,
			}).limit(1).exec(function (err, found) {
				if (err) {
					callback(err, null);
				} 
				else {
					if (found) {
						found = found.toObject();
						if(reqobj.cookies['X-Qlik-Session'])
							found.iscookie=true;
						//console.log(reqobj.cookies['X-Qlik-Session']);
						//
						callback(null, found);
					} else {
						callback({
							message: "-1"
						}, null);
					}
				}

			});
		}
		/*
		if(reqobj.session.userid) {
            var found = {};
            found.userid= reqobj.session.userid;
            if(reqobj.session.appid) {
                found.appname= reqobj.session.appname;
                found.appid= reqobj.session.appid;
                found.app_id= reqobj.session.app_id;
                found.dashboardurl= reqobj.session.dashboardurl;
                found.backendurl= reqobj.session.backendurl;
            }
            if(reqobj.session.qticket) {
                found.qticket= reqobj.session.qticket;
            }
            callback(null, found);
        }
        else {
            callback({}, null);
        }*/
        
    },
};
module.exports = _.assign(module.exports, exports, model);