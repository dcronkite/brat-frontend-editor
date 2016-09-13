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

### Vanilla JavaScript
```javascript
//Make sure DOM is ready
require('brat-frontend-editor')
//Make sure you included 'brat-frontend-editor/dist/brat-frontend-editor.min.css'
var elem = document.getElementById("any");
var collData = {};
var docData = {};
var Brat = new BratFrontendEditor(elem, collData, docData);
```

### Angular2
```javascript
var BratFrontendEditor: any; //TypeScript compiler
require('brat-frontend-editor');

@Component({
  // ...
  template: '<div id="test"></div>':
})
export class ComponentX {

  constructor(public appState: AppState, public title: Title) {
  }

  ngOnInit() {
    var elem = document.getElementById("test");
    var collData = { /* ... */ };
    var docData = { /* ... */ };
    var brat = new BratFrontendEditor(elem, collData, docData);
  }
}
```

### React
require('brat-frontend-editor/dist/brat-frontend-editor');

class ComponentX extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    var elem = document.getElementById("test");
    var collData = { /* ... */ };
    var docData = { /* ... */ };
    var brat = new BratFrontendEditor(elem, collData, docData);
  }

  render () {
    return(
      <div id="test" />
    );
  }
}
