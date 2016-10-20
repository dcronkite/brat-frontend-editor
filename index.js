window.$ = require('./client/lib/node-jquery-1.7.1'); //require('jquery-node-browserify'); // @1.7.2 ++

window.BratFrontendEditor = function(element, collData, docData, webFontURLs, options) {
    if (!(element instanceof Element)) {
        throw new Error('element should be an instance of Element');
    }

    collData = collData || {};
    docData = docData || {};
    webFontURLs = webFontURLs || [
        'static/fonts/Astloch-Bold.ttf',
        'static/fonts/PT_Sans-Caption-Web-Regular.ttf',
        'static/fonts/Liberation_Sans-Regular.ttf'
    ];
    options = options || {};

    this.element = element;
    this.options = options;
    this.collData = collData;
    this.docData = docData;
    this.webFontURLs = webFontURLs;
    this.options = options;
    this.init();
};

BratFrontendEditor.prototype = {
    constructor: BratFrontendEditor,
    init: function() {
        var self = this;
        var html = require('./brat.html');
        self.element.innerHTML = html;
        window.jQuery = $;
        (function($){
            // require('./index.css'); //TODO: If possible, include css in min.js (browserify-css)
            require('./client/lib/jquery-ui.min');
            require('./client/lib/jquery.svg.min');
            require('./client/lib/jquery.svgdom.min');
            require('jquery-bbq');
            require('./client/lib/jquery.sprintf');
            require('./client/lib/jquery.json.min');
            //TODO Fix this error
            window.WebFont = require('./client/lib/webfont.js').WebFont; //Uncaught TypeError: Cannot set property 'WebFont' of undefined

            //brat global helpers
            var Config= require('./client/src/configuration');
            window.Configuration = new Config();
            window.Util = require('./client/src/util');

            // brat modules
            window.Dispatcher = require('./client/src/dispatcher');
            window.URLHash = require('./client/src/url_hash'); //TODO Figure out
            window.LocalAjax = require('./client/src/local_ajax');
            window.Ajax = require('./client/src/ajax.js');
            window.Visualizer = require('./client/src/visualizer');
            window.VisualizerUI = require('./client/src/visualizer_ui');
            window.AnnotatorUI = require('./client/src/annotator_ui');
            window.Spinner = require('./client/src/spinner');

            $(document).ready(function(){
                self.dispatcher = new Dispatcher();
                switch(self.options.ajax) {
                    case 'local':
                        self.ajax = new LocalAjax(self.dispatcher);
                        break;
                    case 'normal':
                        self.ajax = new Ajax(self.dispatcher);
                        break;
                    case 'external':
                        break;
                    default:
                        self.ajax = new LocalAjax(self.dispatcher);
                        break;
                }
                self.visualizer = new Visualizer(self.dispatcher, 'svg', self.webFontURLs);
                self.svg = self.visualizer.svg;
                self.visualizerUI = new VisualizerUI(self.dispatcher, self.svg);
                self.annotatorUI = new AnnotatorUI(self.dispatcher, self.svg);
                self.spinner = new Spinner(self.dispatcher, '#spinner');
                self.dispatcher.post('init');

                self.docData.collection = null;
                self.dispatcher.post('collectionLoaded', [self.collData]);
                self.dispatcher.post('requestRenderData', [self.docData]);
                self.dispatcher.post('current', [self.collData, self.docData, {}]);
            });

        })($);
    }
};

