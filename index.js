#! /usr/bin/env node

'use strict';
var spawn = require('child_process').spawn;
var fixArgsOnWindows = require('node_issue_25339_workaround');

var sh, shFlag, escapeChar, escapeCharRe, args;
 
args = fixArgsOnWindows(process.argv);

if (process.platform.indexOf('win') == 0) {
	sh = 'cmd';
	shFlag = '/c';
	escapeChar = '"';
	escapeCharRe = escapeChar;
} else {
	sh = 'sh';
	shFlag = '-c';
	escapeChar = '\\';
	escapeCharRe = '\\' + escapeChar;
}

// console.log('addenv executing:\n' + getCommand());
spawn(sh, [shFlag, getCommand()], {
	stdio: 'inherit'
});

function getCommand() {
	// Remove ‘node’ and ‘index.js’ from args & join
	var cmd = args.slice(2).join(' '),
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
		src.slice(0, offset).replace(new RegExp('(' + escapeCharRe + '*)"', 'g'), function(matchedQuote, escapes) {
			if (escapes.length == escapesCount) {
				escapesCount = getEscapesCountForLevel(++level);
			} else if (escapes.length < escapesCount) {
				escapesCount = getEscapesCountForLevel(--level);
			}
			return matchedQuote;
		});
		for (var i = 0; i < level; i++) {
			r = r.replace(new RegExp('[' + escapeCharRe + '"]', 'g'), escapeChar + '$&');
		}
	} else {
		r = match;
	}
	return r;
}

function getEscapesCountForLevel(n) {
	return Math.pow(2, n) - 1;
}
