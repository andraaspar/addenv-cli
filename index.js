#! /usr/bin/env node

'use strict';
var exec = require('child_process').exec;

var ESCAPE_CHAR = process.platform.indexOf('win') == 0 ? '"' : '\\';
var ESCAPE_CHAR_RE = process.platform.indexOf('win') == 0 ? ESCAPE_CHAR : '\\' + ESCAPE_CHAR;

// console.log('addenv executing:\n' + getCommand());
exec(getCommand(), onChildProcess);

function getCommand() {
	// Remove ‘node’ and ‘index.js’ from args & join
	var cmd = process.argv.slice(2).join(' '),
		newCmd = cmd;
	do {
		cmd = newCmd;
		newCmd = cmd.replace(/\{\{([-_a-z0-9]+)\}\}/gi, expandEnv);
	} while (cmd !== newCmd);
	return newCmd;
}

function expandEnv(match, name, offset, src) {
	var r = process.env['npm_package_config_' + name] || process.env[name];
	if (r) {
		var level = 0;
		var escapesCount = getEscapesCountForLevel(level);
		src.slice(0, offset).replace(new RegExp('(' + ESCAPE_CHAR_RE + '*)"', 'g'), function(matchedQuote, escapes) {
			if (escapes.length == escapesCount) {
				escapesCount = getEscapesCountForLevel(++level);
			} else if (escapes.length < escapesCount) {
				escapesCount = getEscapesCountForLevel(--level);
			}
			return matchedQuote;
		});
		for (var i = 0; i < level; i++) {
			r = r.replace(new RegExp('[' + ESCAPE_CHAR_RE + '"]', 'g'), ESCAPE_CHAR + '$&');
		}
	} else {
		r = match;
	}
	return r;
}

function getEscapesCountForLevel(n) {
	return Math.pow(2, n) - 1;
}

function onChildProcess(error, stdout, stderr) {
	process.stdout.write(stdout);
	process.stderr.write(stderr);
	if (error) process.exit(1);
}
