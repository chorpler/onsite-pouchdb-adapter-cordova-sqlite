import pouchdbAdapterWebsqlCore from 'pouchdb-adapter-websql-core';

var assign;

if (typeof Object.assign === 'function') {
  assign = Object.assign;
} else {
  // lite Object.assign polyfill based on
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  assign = function (target) {
    var arguments$1 = arguments;

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments$1[index];

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

var assign_1 = assign;

/* global cordova, sqlitePlugin, openDatabase */
function createOpenDBFunction (opts) {
  return function (name, version, description, size) {
    if (typeof sqlitePlugin !== 'undefined') {
      // The SQLite Plugin started deviating pretty heavily from the
      // standard openDatabase() function, as they started adding more features.
      // It's better to just use their "new" format and pass in a big ol'
      // options object. Also there are many options here that may come from
      // the PouchDB constructor, so we have to grab those.
      var sqlitePluginOpts = assign_1({}, opts, {
        name: name,
        version: version,
        description: description,
        size: size
      });
      return sqlitePlugin.openDatabase(sqlitePluginOpts);
    }

    // Traditional WebSQL API
    return openDatabase(name, version, description, size);
  };
}

function CordovaSQLitePouch (opts, callback) {
  var websql = createOpenDBFunction(opts);
  var _opts = assign_1({
    websql: websql
  }, opts);

  if ((typeof Capacitor === 'undefined' && typeof cordova === 'undefined') || (typeof sqlitePlugin === 'undefined' && typeof openDatabase === 'undefined')) {
    console.error(
      'PouchDB error: you must install a SQLite plugin ' +
      'in order for PouchDB to work on this platform. Options:' +
      '\n - https://github.com/nolanlawson/cordova-plugin-sqlite-2' +
      '\n - https://github.com/litehelpers/Cordova-sqlite-storage' +
      '\n - https://github.com/Microsoft/cordova-plugin-websql');
  }

  if ('default' in pouchdbAdapterWebsqlCore && typeof pouchdbAdapterWebsqlCore.default.call === 'function') {
    pouchdbAdapterWebsqlCore.default.call(this, _opts, callback);
  } else {
    pouchdbAdapterWebsqlCore.call(this, _opts, callback);
  }
}

CordovaSQLitePouch.valid = function () {
  // if you're using Cordova, we assume you know what you're doing because you control the environment
  return true;
};

// no need for a prefix in cordova (i.e. no need for `_pouch_` prefix
CordovaSQLitePouch.use_prefix = false;

function cordovaSqlitePlugin (PouchDB) {
  PouchDB.adapter('cordova-sqlite', CordovaSQLitePouch, true);
}

if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(cordovaSqlitePlugin);
}

var src = cordovaSqlitePlugin;

export default src;
