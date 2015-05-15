# addenv-cli
Expands environment variables in command line parameters, then executes the command.

## Installation

```
npm install addenv-cli --save-dev
```

## Usage

Useful when using npm as a build tool.

### package.json
```
{
	"private": true,
	"devDependencies": {
		"addenv-cli": "^0.1.0"
	},
	"config": {
		"foo": "\"{{bar}}\"",
		"bar": "baz"
	},
	"scripts": {
		"build": "addenv \"echo Foo expands to: {{foo}}\""
	}
}
```
### Command line:
```
npm run build
```
### Output:
```
Foo expands to: "baz"
```
## History

- 0.1.0: Changed syntax to `{{var}}` to avoid native variable expansion;
  Added `"` escaping.
- 0.0.1: Initial version