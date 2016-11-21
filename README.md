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
cd <targetted_app>
npm install
npm start #Then open browser on localhost:3000
```

#### Build dist repo
```bash
npm run prepublish
```

## Import module in your current application##
```bash
npm install brat-frontend-editor --save
```

## Configuration
| Options | Values | Default |
| --- | --- | --- |
| activateEdition | true of false | true |
| ajax | 'local', 'external' or 'normal' | local |
| assetsPath | path to public asset folder | static/ |
| maxFragmentLength | 0=no_max 1+=max characters by fragment (applied on Entity type only for now) | 30 |
| webFontURLs | array of 3 paths | ['fonts/Astloch-Bold.ttf','fonts/PT_Sans-Caption-Web-Regular.ttf','fonts/Liberation_Sans-Regular.ttf'] |

#### Integration in vanilla JavaScript
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

#### Integration in Angular2
```javascript
var BratFrontendEditor: any; //TypeScript compiler
require('brat-frontend-editor');

@Component({
  // ...
  template: '<div id="test"></div>':
})
export class ComponentX {
    private brat: any;

  constructor() {
  }let

  ngOnInit() {
    let elem = document.getElementById("test");
    let collData = { /* ... */ };
    let docData = { /* ... */ };
    let options = {
      'ajax': 'external', //local(default), normal, external(Handle all 'ajax' actions by yourself)
    };
    this.brat = new BratFrontendEditor(elem, collData, docData, options);
    this.brat.dispatcher.on('ajax', (data, callback, merge) => this.onExternalAjaxActions(data, callback, merge));
    this.brat.dispatcher.on('local-ajax-begin', this.onBeforeLocalAjaxActions);
    this.brat.dispatcher.on('local-ajax-done', this.onAfterLocalAjaxActions);
  }


  private onExternalAjaxActions(data, callback, merge) {
    // You could manage all data transformations externally (from Ng2 App)
    // Set option.ajax: 'external' first
    // Following will "work"(no span will actually be created) for createSpan action
    // All actions must be implemented externally if option.ajax=external
    this.brat.dispatcher.post('spin');
    let response = {};

    switch(data.action){
      case "createSpan":
        response = {
          action: data.action,
          annotations: {
            "source_files": data.document.source_files,
            "modifications": data.document.modifications,
            "normalizations": data.document.normalizations,
            "text": data.document.text,
            "entities" : data.document.entities,
            "attributes": data.document.attributes,
            "relations": data.document.relations,
            "triggers": data.document.triggers,
            "events": data.document.events
          },
          edited: [[data.origin], [data.target]],
          messages: [],
          protocol: 1
        };
        break;
      case "getDocument":
      case "loadConf":
      case "getCollectionInformation":
      case "createArc":
      case "deleteArc":
      case "reverseArc":
      case "deleteSpan":
      case "deleteFragmentxyz?":
      case "splitSpan":
      case "tag":
      case "login":
      case "logout":
      case "whoami":
      case "normGetName":
      case "normSearch":
      case "suggestSpanTypes":
      case "importDocument":
      case "deleteDocument":
      case "deleteCollection":
      case "undo":
      case "normData":
      case "InDocument":
      case "InCollection":
      case "storeSVG":
      case "getDocumentTimestamp":
      case "saveConf":
      default:
        console.log("Not yet supported externally");
        break;
    }

    this.brat.dispatcher.post(0, callback, [response]);
    this.brat.dispatcher.post('unspin');
  }

  onBeforeLocalAjaxActions(data, callback, merge){
    // Right before any local_ajax.js actions
  }

  onAfterLocalAjaxActions(response, callback, merge){
    // Right after any local_ajax.js actions
  }
}
```

#### Integration in React
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
