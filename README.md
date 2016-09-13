## About brat ##

https://github.com/nlplab/brat
http://brat.nlplab.org/

## About this version ##
This version is full frontend working version of brat editing tools


## Install and execute ##
Prerequisites : None

## Example with Node http-server module##
Prerequisites :
NodeJS (and NPM)

```bash
npm install -g http-server
cd DIRECTORY
http-server -p 8080
```
Then open browser on localhost:8080/index.html

## Import module in your current application##
```bash
npm install brat-frontend-editor
```

## Vanilla JavaScript
```javascript
//Make sure DOM is ready
require('brat-frontend-editor')
//Make sure you included 'brat-frontend-editor/dist/brat-frontend-editor.min.css'
var elem = document.getElementById("any");
var collData = {};
var docData = {};
var Brat = new BratFrontendEditor(elem, collData, docData);
```

## TODO Angular2

## TODO React

