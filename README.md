OnSite fork
======
[pouchdb-adapter-cordova-sqlite](https://github.com/chorpler/onsite-pouchdb-adapter-cordova-sqlite) repo, fork of original [pouchdb-adapter-cordova-sqlite](https://github.com/pouchdb-community/pouchdb-adapter-cordova-sqlite) repo.

## **Rationale for this fork**

This fork is designed to work better with OnSite apps. This requires a being compatible back to Node.js 10.24.1, and has been shaped to match my own coding idiosynchrasies. (There's a reason this is a private repo.) I hope you have a good reason for using this fork! I don't anticipate anybody but me ever using it, really. But that begs the question[^1]: why am I writing out these notes at all? Mostly so I won't forget what changes I made if I have to come back to this code years from now. And also I'm a bit bored and tired, so I wrote out some notes, why not? *(Zoidberg gif)*

## **The changes I made**

- Source changed to TypeScript
- Build uses rollup and browserify to end up with versions that should work in Node, Electron, Cordova, or browser

## **The basic repo structure**

- `src` - Source code files
- `config` - Rollup configuration files
- `compiled` - transpiled TypeScript files
- `types` - TypeScript declaration/type files
- `lib` - raw Rollup output, suitable for modules
- `dist` - Browserify output

## **Updated list of Cordova SQLite plugins**

| Package                                                                                                                   | Repo Last Updated    | Description                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| [cordova-sqlite-storage](https://github.com/storesafe/cordova-sqlite-storage)                                             | 2021-07-12 | Core plugin version                                                                                                     |
| [cordova-sqlite-ext](https://github.com/brodybits/cordova-sqlite-ext)                                                     | 2021-10-14 | Includes extra features including BASE64 (SELECT BLOB in Base64 format), REGEXP, and pre-populated databases            |
| [cordova-sqlite-evcore-extbuild-free](https://github.com/storesafe/cordova-sqlite-evcore-extbuild-free)                   | 2022-01-16 | Plugin version with lighter resource usage in Android NDK                                                               |
| [cordova-plugin-sqlite-evplus-ext-common-free](https://github.com/storesafe/cordova-plugin-sqlite-evplus-ext-common-free) | 2022-06-07 | Includes workaround for extra-large result data on Android and lighter resource usage on iOS, macOS, and in Android NDK |
| [cordova-sqlcipher-adapter](https://github.com/storesafe/cordova-sqlcipher-adapter)                                       | 2021-03-31 | Includes encryption functionality using [SQLCipher](https://www.zetetic.net/sqlcipher/) for Android/iOS/macOS           |
| [cordova-sqlite-express-build-support](https://github.com/storesafe/cordova-sqlite-express-build-support)                 | 2020-03-12 | Using built-in SQLite libraries on Android, iOS, and macOS - may be missing some important SQLite updates               |
| [cordova-plugin-sqlite-2](https://github.com/nolanlawson/cordova-plugin-sqlite-2)                                         | 2021-05-23 | Nolan Lawson's PouchDB-focused fork                                                                                     |
| [cordova-plugin-websql](https://github.com/Microsoft/cordova-plugin-websql)                                               | 2015-09-18 | Microsoft version written on top of C# library                                                                          |

[^1]: Tee hee

***[original README starts below]***

------

pouchdb-adapter-cordova-sqlite
======

PouchDB adapter using native Cordova SQLite as its backing store. It works with any one of the following Cordova plugins:

- [Cordova-sqlite-storage](https://github.com/litehelpers/Cordova-sqlite-storage)
- [cordova-plugin-sqlite-2](https://github.com/nolanlawson/cordova-plugin-sqlite-2)
- [cordova-plugin-websql](https://github.com/Microsoft/cordova-plugin-websql)

This adapter looks for a global `cordova.sqlitePlugin`, falling back to `openDatabase` if available. Its adapter name is `'cordova-sqlite'`.

### Usage

#### Via npm/Browserify/Webpack/etc.

Install from npm:

```bash
npm install pouchdb-adapter-cordova-sqlite
```

Then `require()` it, notify PouchDB of the plugin, and initialize a database using the `cordova-sqlite` adapter name:

```js
PouchDB.plugin(require('pouchdb-adapter-cordova-sqlite'));
var db = new PouchDB('mydb.db', {adapter: 'cordova-sqlite'});
```

Note this requires a module bundler such as Browserify, Webpack, etc.

#### Via script tags

If you're not using npm/Browserify/Webpack/etc., just [download the JavaScript file from unpkg](https://unpkg.com/pouchdb-adapter-cordova-sqlite/dist/pouchdb.cordova-sqlite.js), then include it after PouchDB:

```html
<script src="path/to/pouchdb.js"></script>
<script src="path/to/pouchdb.cordova-sqlite.js"></script>
```

Then initialize it using the `cordova-sqlite` adapter name:

```js
var db = new PouchDB('mydb.db', {adapter: 'cordova-sqlite'});
```

This will create a SQLite database via native Cordova called `mydb.db`.

**Note that you will need to do this within the `deviceready` Cordova event**. If you are stuck trying to get this to work, then please refer to the [pouchdb-adapter-cordova-sqlite-demo](https://github.com/nolanlawson/pouchdb-adapter-cordova-sqlite-demo) project which contains a fully working demo that you can try out yourself to see how it should work. The code it adds is simply:

```html
<script src="js/pouchdb-6.1.2.js"></script>
<script src="js/pouchdb.cordova-sqlite-2.0.2.js"></script>
<script>
  document.addEventListener('deviceready', function () {
    var db = new PouchDB('database.db', {adapter: 'cordova-sqlite'});
    db.post({}).then(function (res) {
      return db.get(res.id);
    }).then(function (doc) {
      /* etc. */
    }).catch(console.log.bind(console));
  });
</script>
```

**Note also that if you don't install a "SQLite plugin," it will fall back to WebSQL**. If you are unsure whether or not a SQLite Plugin is successfully installed, try:

```js
alert('SQLite plugin is installed?: ' + (!!window.sqlitePlugin));
```

The reason it falls back to WebSQL is that `cordova-plugin-websql` adds a global `openDatabase` instead of a global `cordova.sqlitePlugin`. This adapter prefers `cordova.sqlitePlugin` but falls back to `openDatabase`.

### Configuration

You can also pass in any options that are valid for Cordova-sqlite-storage, such as `location`, 
`androidDatabaseImplementation`, etc.:

```js
var db = new PouchDB('mydb.db', {
  adapter: 'cordova-sqlite',
  iosDatabaseLocation: 'Library',
  androidDatabaseImplementation: 2
});
```

If you want to use the legacy `_pouch_mydb.db` format (with the `_pouch_` prefix), then do this:

```js
var PouchAdapterCordovaSqlite = require('pouchdb-adapter-cordova-sqlite');
cordovaSqlitePlugin.use_prefix = true; // use the legacy '_pouch' prefix
PouchDB.plugin(PouchAdapterCordovaSqlite);
var db = new PouchDB('mydb.db', {adapter: 'cordova-sqlite'});
```

## Historical note

Until PouchDB 6.0.0, PouchDB's regular `websql` adapter supported the Cordova SQLite Plugin automatically. However, the PouchDB team found this
to be confusing, error-prone, and difficult to configure, which is why it was extracted into a separate plugin. You can read details in [PouchDB's list of breaking changes](https://github.com/pouchdb/pouchdb/wiki/Breaking-changes).

## Changelog

- 2.0.0
  - Automatically registered the plugin if it detects `window.PouchDB`. This means for people using `<script>` tags, you no longer need to explicitly call `PouchDB.plugin()`.
- 1.0.0
  - Initial release
