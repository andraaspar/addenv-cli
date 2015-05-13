# addenv-cli
Expands environment variables in command line parameters, then executes the command.

## Usage

Useful when using npm as a build tool.

### package.json
```
{
	"private": true,
	"devDependencies": {
		"addenv-cli": "^0.0.1"
	},
	"config": {
		"foo": "${bar}",
		"bar": "baz"
	},
	"scripts": {
		"build": "addenv echo Foo expands to: ${foo}"
	}
}
```
### Command line:
```
npm run build
```
### Output:
```
Foo expands to: baz
```