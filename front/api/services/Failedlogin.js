var schema = new Schema({
    userid: {
        type: String,
        required: true,
    },
    password: {
        type: String,
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
module.exports = mongoose.model('Failedlogin', schema,'failed_login');
var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
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
                    fields: ['userid', 'ip_address'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'login_date'
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
};
module.exports = _.assign(module.exports, exports, model);