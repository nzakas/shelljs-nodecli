/**
 * @fileoverview Build file
 * @author nzakas
 */
/*global target, exec, echo, find, which, test, mkdir*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/make");
var nodeCLI = require("./lib/shelljs-nodecli");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Generates a function that matches files with a particular extension.
 * @param {string} extension The file extension (i.e. "js")
 * @returns {Function} The function to pass into a filter method.
 * @private
 */
function fileType(extension) {
	return function(filename) {
		return filename.substring(filename.lastIndexOf(".") + 1) === extension;
	};
}

/**
 * Determines which directories are present that might have JavaScript files.
 * @returns {string[]} An array of directories that exist.
 * @private
 */
function getSourceDirectories() {
	var dirs = [ "lib", "src", "app" ],
		result = [];

	dirs.forEach(function(dir) {
		if (test("-d", dir)) {
			result.push(dir);
		}
	});

	return result;
}

/**
 * Creates a release version tag and pushes to origin.
 * @param {string} type The type of release to do (patch, minor, major)
 * @returns {void}
 */
function release(type) {
	target.test();
	exec("npm version " + type);
	exec("git push origin master --tags");
	exec("npm publish");
}

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

var NODE = "node ",	// intentional extra space
	NODE_MODULES = "./node_modules/",
	DIST_DIR = "./dist",

	// Utilities - intentional extra space at the end of each string
	MOCHA = NODE_MODULES + "mocha/bin/_mocha ",

	// Directories
	JS_DIRS = getSourceDirectories(),

	// Files
	JS_FILES = find(JS_DIRS).filter(fileType("js")).join(" "),
	TEST_FILES = find("tests/").filter(fileType("js")).join(" ");

//------------------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------------------

target.all = function() {
	target.test();
};

target.lint = function() {
	echo("Validating JavaScript files");
	nodeCLI.exec("eslint", JS_FILES);
};

target.test = function() {
	target.lint();
	nodeCLI.exec("istanbul", "cover", MOCHA, "-- -c", TEST_FILES);
};

target.patch = function() {
	release("patch");
};

target.minor = function() {
	release("minor");
};

target.major = function() {
	release("major");
};
