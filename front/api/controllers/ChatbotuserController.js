module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getsessiondata: function (req, res) {
        //console.log(req.connection.remoteAddress);
        if (req.body) {
            Chatbotuser.getsessiondata(req,req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    loginuser: function (req, res) {
        //console.log(req.connection.remoteAddress);
        if (req.body) {
            Chatbotuser.loginuser(req,req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    backendloginuser: function (req, res) {
        if (req.body) {
            Chatbotuser.backendloginuser(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    changepassword: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.changepassword(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    forgotpassword: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.forgotpassword(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    isvalidpasswordresetreq: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.isvalidpasswordresetreq(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    resetpassword: function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.resetpassword(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    sendmail:function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.sendmail(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getnewticket:function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.getnewticket(req,req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    save:function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.save(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    search:function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.search(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getOne:function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.getOne(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    delete:function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.delete(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    searchqlikuser:function (req, res) {
        //console.log(req);
        if (req.body) {
            Chatbotuser.searchqlikuser(req.body, res.callback);
        }
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
};
module.exports = _.assign(module.exports, controller);