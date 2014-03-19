/**
 * @fileoverview ShellJS Node CLI Extension
 * @author Nicholas C. Zakas
 */
/*global exec, which, test, echo*/
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/global");

var path = require("path"),
    fs = require("fs");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

/**
 * Retrieves package information for the given Node module.
 * @param {string} name The name of the Node module to retrieve the package for.
 * @param {string} [root] The root directory to start looking in.
 * @returns {Object} The contents of the package.json file for the Node module or
 *      null if it can't be found.
 * @private
 */
function getPackage(name, root) {
    var packagePath = path.join(root || "", "node_modules", name, "package.json");
    return test("-f", packagePath) ? JSON.parse(fs.readFileSync(packagePath, "utf8")) : null;
}


//------------------------------------------------------------------------------
// Public
//------------------------------------------------------------------------------

/**
 * @module shelljs-nodecli
 */
module.exports = {

    /**
     * Gets the executable path for the Node CLI with the given name. This first
     * searches the node_modules directory for the CLI, and if not found, defaults
     * back to looking globally. If it's not found there, then the CLI likely
     * isn't installed.
     * @param {string} name The Node CLI executable name (i.e., "eslint")
     * @param {string} [root] The root directory to start looking in.
     * @returns {string} If a local CLI, then this will be the command, including "node",
     *      that will execute the CLI; if a global CLI, then the command itself; otherwise
     *      an empty string is returned.
     */
    getPath: function(name, root) {

        var pkg = getPackage(name, root || "");

        if (pkg) {
            if (pkg.bin && pkg.bin[name]) {
                return "node " + path.join(root || "", "node_modules", name, pkg.bin[name]).replace(/\\/g, "/");
            }
        } else if (which(name)) {
            return name;
        }

        return "";
    },

    /**
     * Executes the given node CLI command with the specified options. Works mostly
     * like the ShellJS exec() command, with the exception that you can pass in
     * any number of string arguments and they will be concatenated together with
     * a space between them to form the full command.
     * @param {string} name The name of the Node CLI command to execute.
     * @param {...string} [moreOptions] Additional options to append to the command.
     * @param {Object} [options] Same options as exec().
     * @param {Function} [callback] The function to call when executing async. Just
     *      including this function changes this method to be async automatically.
     * @returns {Object} An object containing "output" and "code" for the exit code.
     */
    exec: function(name) {
        var cliPath = this.getPath(name),
            cmd = [cliPath],
            args = [],
            i = 1,
            len = arguments.length;

        if (cliPath) {
            while (i < len && (typeof arguments[i] === "string")) {
                cmd.push(arguments[i]);
                i++;
            }

            args.push(cmd.join(" "));

            while (i < len) {
                args.push(arguments[i]);
                i++;
            }

            return exec.apply(null, args);
        } else {
            throw new Error("Couldn't find " + name + ".");
        }

    }

};
