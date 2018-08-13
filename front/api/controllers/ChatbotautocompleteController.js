module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getautocomplete: function (req, res) {
        if (req.body) {
            Chatbotautocomplete.getautocomplete(req.body, res.callback);
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
    searchqlikapp: function (req, res) {
        if (req.body) {
            Chatbotautocomplete.searchqlikapp(req.body, res.callback);
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
            Chatbotautocomplete.save(req.body, res.callback);
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
            Chatbotautocomplete.search(req.body, res.callback);
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
            Chatbotautocomplete.getOne(req.body, res.callback);
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
            Chatbotautocomplete.delete(req.body, res.callback);
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
    getfullautocomplete: function (req, res) {
        if (req.body) {
            Chatbotautocomplete.getfullautocomplete(req,req.body, res.callback);
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
    gettopqueries: function (req, res) {
        if (req.body) {
            Chatbotautocomplete.gettopqueries(req.body, res.callback);
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