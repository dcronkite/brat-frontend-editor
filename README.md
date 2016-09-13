## About brat ##

https://github.com/nlplab/brat
http://brat.nlplab.org/

## About this version ##
This version is full frontend working version of brat editing tools


## Install and execute main app or provided examples
####Prerequisites :
- Node.js >= 4.5.x
- npm >= 3.0.x

#### Root app as well as all examples can be executed with
```bash
npm install
npm start #Then open browser on localhost:3000
```

## Import module in your current application##
```bash
npm install brat-frontend-editor --save
```

### Vanilla JavaScript
```html
<link rel="stylesheet" type="text/css" href="node_modules/brat-frontend-editor/dist/brat-frontend-editor.min.css"/>
<script type="text/javascript" src="node_modules/brat-frontend-editor/dist/brat-frontend-editor.js"></script>
<body onLoad="window_onload()">
    <div id="test"></div>
</body>
```

```javascript
function window_onload() {
    //Making sure DOM is ready
    var elem = document.getElementById("test");
    var collData = { /*...*/ };
    var docData = { /*...*/ };
    var yolo = new BratFrontendEditor(elem, collData, docData);
}
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

  constructor() {
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
```javascript
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
```
