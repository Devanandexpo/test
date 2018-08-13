module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getkpi: function (req, res) {
        if (req.body) {
            Kpi.getkpi(req.body, res.callback);
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
    getmeasure: function (req, res) {
        if (req.body) {
            Kpi.getmeasure(req.body, res.callback);
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
    getquery: function (req, res) {
        if (req.body) {
            Kpi.getquery(req.body, res.callback);
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