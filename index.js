#! /usr/bin/env node

var exec = require('child_process').exec;

exec(getCommand(), onChildProcess);

function getCommand() {
	// Remove ‘node’ and ‘index.js’ from args & join
	var cmd = process.argv.slice(2).join(' '),
		newCmd = cmd;
	do {
		cmd = newCmd;
		newCmd = cmd.replace(/\$\{([-_a-z0-9]+)\}/gi, expandEnv);
	} while (cmd !== newCmd);
	return newCmd;
}

function expandEnv(match, name) {
	return process.env['npm_package_config_' + name] || process.env[name] || match;
}

function onChildProcess(error, stdout, stderr) {
	process.stdout.write(stdout);
	process.stderr.write(stderr);
	if (error) process.exit(1);
}
