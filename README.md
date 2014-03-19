# ShellJS Node CLI Extension

An extension for ShellJS that makes it easy to find and execute Node.js CLIs.

## The Problem

[ShellJS](http://shelljs.org) is a fantastic tool for interacting with the shell environment in a cross-platform way. It allows you to easily write scripts that would otherwise be written in bash without worrying about compatibility.

The only problem is that it's a real pain to execute Node binaries that are installed locally. Most end up manually looking into the `node_modules` directory to find the binary file to execute directly with Node, especially when working on Windows, where the files in `node_modules/.bin` tend not to work from scripting environments like make and ShellJS. Consequently, you end up seeing a lot of this:

```js
// before
var ESLINT = "node_modules/eslint/bin/eslint.js";

exec("node " + ESLINT + " myfile.js");
```

## The Solution

Since Node binaries are specified in their `package.json` files, it's actually pretty easy to look up the location of the runtime file and get the path. That's where the ShellJS Node CLI extension comes in:

```js
var nodeCLI = require("shelljs-nodecli");

nodeCLI.exec("eslint", "myfile.js");
```

The nodeCLI utility has its own `exec()` that is specifically for use when executing Node CLIs. It searches through the working directory's `node_modules` directory to find a locally installed utility. If it's not found there, then it searches globally. If it's still not found, then an error is thrown.

You can pass in as many string arguments as you'd like, and they will automatically be concatenated together with a space in between, such as:

```js
var nodeCLI = require("shelljs-nodecli");

nodeCLI.exec("eslint", "-f compact", "myfile.js");
```

This ends up creating the following string:

```
"eslint -f compact myfile.js"
```

This frees you from needing to do tedious string concatenation to execute the command.

The `exec()` method otherwise behaves exactly the same as the default ShellJS `exec()` method, meaning you can use the same options and callback arguments, such as:

```js
var nodeCLI = require("shelljs-nodecli");

var version = nodeCLI.exec('eslint', '-v', {silent:true}).output;

var child = nodeCLI.exec('some_long_running_process', {async:true});
child.stdout.on('data', function(data) {
    /* ... do something with data ... */
});

nodeCLI.exec('some_long_running_process', function(code, output) {
    console.log('Exit code:', code);
    console.log('Program output:', output);
});
```

## License and Copyright

Copyright 2014 Nicholas C. Zakas. All rights reserved.

MIT License

