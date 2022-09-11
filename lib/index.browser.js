'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var WebSqlPouchCore = require('pouchdb-adapter-websql-core');
var WebSqlPouchCore__default = _interopDefault(WebSqlPouchCore);

var assign;
if (typeof Object.assign === 'function') {
    assign = Object.assign;
}
else {
    // lite Object.assign polyfill based on
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    assign = function (target) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        var to = Object(target);
        var params = [target ].concat( args);
        for (var index = 1; index < params.length; index++) {
            var nextSource = params[index];
            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}
// module.exports = assign;

/* global cordova, sqlitePlugin, openDatabase */
function createOpenDBFunction(opts) {
    return function (name, version, description, size) {
        if (typeof sqlitePlugin !== 'undefined') {
            // The SQLite Plugin started deviating pretty heavily from the
            // standard openDatabase() function, as they started adding more features.
            // It's better to just use their "new" format and pass in a big ol'
            // options object. Also there are many options here that may come from
            // the PouchDB constructor, so we have to grab those.
            var sqlitePluginOpts = assign({}, opts, {
                name: name,
                version: version,
                description: description,
                size: size,
            });
            return sqlitePlugin.openDatabase(sqlitePluginOpts);
        }
        // Traditional WebSQL API
        return openDatabase(name, version, description, size);
    };
}
function CordovaSQLitePouch(opts, callback) {
    var self = this;
    var websql = createOpenDBFunction(opts);
    var _opts = assign({
        websql: websql,
    }, opts);
    if ((typeof Capacitor === 'undefined' && typeof cordova === 'undefined') || (typeof sqlitePlugin === 'undefined' && typeof openDatabase === 'undefined')) {
        var errText = 'PouchDB error: you must install a SQLite plugin ' +
            'in order for PouchDB to work on this platform. Options:' +
            '\n - https://github.com/storesafe/cordova-plugin-sqlite-evplus-ext-common-free' +
            '\n - https://github.com/storesafe/cordova-sqlite-express-build-support' +
            '\n - https://github.com/nolanlawson/cordova-plugin-sqlite-2' +
            '\n - https://github.com/litehelpers/Cordova-sqlite-storage' +
            '\n - https://github.com/Microsoft/cordova-plugin-websql';
        console.error(errText);
    }
    // const webSqlPouchCoreKeys = Object.keys(WebSqlPouchCore);
    // if(webSqlPouchCoreKeys.indexOf('default') > -1 && typeof WebSqlPouchCore['default'].call === 'function') {
    if (WebSqlPouchCore && WebSqlPouchCore__default && WebSqlPouchCore__default.call && typeof WebSqlPouchCore__default.call === 'function') {
        WebSqlPouchCore__default.call(self, _opts, callback);
    }
    else {
        WebSqlPouchCore.call(self, _opts, callback);
    }
}
CordovaSQLitePouch.valid = function () {
    // if you're using Cordova, we assume you know what you're doing because you control the environment
    return true;
};
// no need for a prefix in cordova (i.e. no need for `_pouch_` prefix
CordovaSQLitePouch.use_prefix = false;
function cordovaSqlitePlugin(PouchDB) {
    PouchDB.adapter('cordova-sqlite', CordovaSQLitePouch, true);
}
if (typeof window !== 'undefined' && window.PouchDB) {
    window.PouchDB.plugin(cordovaSqlitePlugin);
}

exports.cordovaSqlitePlugin = cordovaSqlitePlugin;
exports.default = cordovaSqlitePlugin;
