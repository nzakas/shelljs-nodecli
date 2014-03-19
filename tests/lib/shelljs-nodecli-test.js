/**
 * @fileoverview Tests ShellJS Node CLI Extension
 * @author nicholas
 */

/*global describe, it*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
	sinon = require("sinon"),
	rewire = require("rewire");

//------------------------------------------------------------------------------
// Typedefs and Callbacks
//------------------------------------------------------------------------------

// Follow JSDoc conventions unless otherwise noted.

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

// constants

// then helper functions

//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

describe("nodeCLI", function() {

	var sandbox = sinon.sandbox.create(),
		nodeCLI;

	beforeEach(function() {
		nodeCLI = rewire("../../lib/shelljs-nodecli");
	});

	afterEach(function() {
		sandbox.verifyAndRestore();
	});

	describe("getPath()", function() {

		it("should return the path to a CLI when there's a local module installed", function() {
			var result = nodeCLI.getPath("testmodule", "tests/fixtures");
			assert.equal(result, "node tests/fixtures/node_modules/testmodule/test.js");
		});

		it("should return an empty string when there's no local module or global utility installed", function() {
			var result = nodeCLI.getPath("foo", "tests/fixtures");
			assert.equal(result, "");
		});

		it("should return the path to the CLI when there's a global module installed", function() {
			var result = nodeCLI.getPath("npm", "tests/fixtures");
			assert.equal(result, "npm");
		});

	});

	describe("exec()", function() {

		it("should call ShellJS exec() with string arguments concatenated with spaces when called with multiple string arguments", function() {
			var result = {};
			nodeCLI.__set__("exec", sandbox.mock().withArgs("npm a b").returns(result));

			var actualResult = nodeCLI.exec("npm", "a", "b");
			assert.equal(actualResult, result);
		});

		it("should call ShellJS exec() with all arguments when called with options and callback", function() {
			var result = {},
				options = {},
				callback = function() {};

			nodeCLI.__set__("exec", sandbox.mock().withArgs("npm", options, callback).returns(result));

			var actualResult = nodeCLI.exec("npm", options, callback);
			assert.equal(actualResult, result);
		});

		it("should throw an error when the Node module can't be found", function() {
			var result = {},
				options = {},
				callback = function() {};

			assert.throws(function() {
				nodeCLI.exec("ncz3234");
			}, /Couldn't find ncz3234\./);
		});


	});



});
