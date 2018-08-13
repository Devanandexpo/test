/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */
var helmet = require('helmet');
var frameguard = require('frameguard');
var referrerPolicy = require('referrer-policy');
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 150, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});
module.exports.http = {

    /****************************************************************************
     *                                                                           *
     * Express middleware to use for every Sails request. To add custom          *
     * middleware to the mix, add a function to the middleware config object and *
     * add its key to the "order" array. The $custom key is reserved for         *
     * backwards-compatibility with Sails v0.9.x apps that use the               *
     * `customMiddleware` config option.                                         *
     *                                                                           *
     ****************************************************************************/

    middleware: {

        /***************************************************************************
         *                                                                          *
         * The order in which middleware should be run for HTTP request. (the Sails *
         * router is invoked by the "router" middleware below.)                     *
         *                                                                          *
         ***************************************************************************/
		//xframe: require('lusca').xframe('ALLOW-FROM https://sailsjs.com/'),
		/*xframe:helmet({
		  frameguard: {
			action: 'allow-from',
			domain: 'https://sailsjs.com'
		  }
		}),*/
		/*xframe:require('helmet').frameguard({ 
			action: 'allow-from',
			domain: 'https://sailsjs.com'
		}),*/
		
		/*xframe:frameguard({ 
			action: 'allow-from',
			domain: 'https://sailsjs.com'
		}),*/
		limiter2:limiter,
		xframe2: require('lusca').xframe('SAMEORIGIN'),
		xframe3:helmet.frameguard('allow-from', 'https://qliksenseprod1.mahindra.com'),
		xframe:helmet({
		  contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				fontSrc: ["'self'", 'fonts.com'],
				imgSrc: ["'self'",'data:'],
				sandbox: ['allow-forms', 'allow-scripts','allow-same-origin','allow-modals'],
				frameSrc: ['10.192.77.52','https://qliksenseprod1.mahindra.com'],
				'object-src': ['*','data:'],
				'connect-src':["'self'",'https://analyticsbot.mahindra.com','https://analyticsbot.mahindra.com/hrbot/','https://api.cognitive.microsoft.com/sts/v1.0/issueToken','https://speech.platform.bing.com/recognize','wss://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1'],
				frameAncestors: [
					'http://mahindra.com'
				]
			}
		  },
		  frameguard: false
		}),
		poweredBy: false,
		/*xframe:helmet({
		  contentSecurityPolicy: {
			directives: {
			  defaultSrc: ["'https://sailsjs.com'"],
			},
		  },
		  frameguard: false,
		}),*/
		xssProtection: require('lusca').xssProtection(true),
		//referrerPolicy:require('lusca').referrerPolicy('origin'),
		referrerPolicy1:referrerPolicy({ policy: 'origin' }),
        order: [
            'startRequestTimer',
            'cookieParser',
            'session',
			//'limiter2',
			//'referrerPolicy1',
			'xframe3',
			//'xframe2',
			'xframe',
			'xssProtection',
            'bodyParser',
            'handleBodyParserError',
            'myRequestLogger',
            'compress',
            'methodOverride',
            'poweredBy',
            '$custom',
            'router',
            'www',
            'favicon',
            '404',
            '500'
        ],

        /****************************************************************************
         *                                                                           *
         * Example custom middleware; logs each request to the console.              *
         *                                                                           *
         ****************************************************************************/

        myRequestLogger: function (req, res, next) {
            req.models = req.path.split("/");
            // console.log(req.models);
            req.model = mongoose.models[_.upperFirst(req.models[2])];
            req.modelName = _.upperFirst(req.models[2]);


            if (req.body && req.body._accessToken) {
                User.findOne({
                    accessToken: req.body._accessToken
                }, function (err, data) {
                    if (err) {
                        res.json({
                            error: err,
                            value: false
                        });
                    } else if (data) {
                        req.user = data;
                        next();
                    } else {
                        res.json({
                            error: "Invalid AccessToken",
                            value: false
                        });
                    }
                }, "Get Google");
            } else {
                next();
            }
        }


        /***************************************************************************
         *                                                                          *
         * The body parser that will handle incoming multipart HTTP requests. By    *
         * default as of v0.10, Sails uses                                          *
         * [skipper](http://github.com/balderdashy/skipper). See                    *
         * http://www.senchalabs.org/connect/multipart.html for other options.      *
         *                                                                          *
         ***************************************************************************/

        // bodyParser: require('skipper')

    },

    /***************************************************************************
     *                                                                          *
     * The number of seconds to cache flat files on disk being served by        *
     * Express static middleware (by default, these files are in `.tmp/public`) *
     *                                                                          *
     * The HTTP static cache is only active in a 'production' environment,      *
     * since that's the only time Express will cache flat-files.                *
     *                                                                          *
     ***************************************************************************/

    //cache: 31557600000
	cache : 0
};