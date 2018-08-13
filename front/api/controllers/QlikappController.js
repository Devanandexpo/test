module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    save:function (req, res) {
        //console.log(req);
        if (req.body) {
            Qlikapp.save(req.body, res.callback);
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
            Qlikapp.search(req.body, res.callback);
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
            Qlikapp.getOne(req.body, res.callback);
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
            Qlikapp.delete(req.body, res.callback);
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