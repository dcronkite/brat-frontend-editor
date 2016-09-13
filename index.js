window.$ = require("./client/lib/node-jquery-1.7.1"); //require("jquery-node-browserify"); // @1.7.2 ++

window.BratFrontendEditor = function(element, collData, docData) {
    if (!(element instanceof Element)) {
        throw new Error('element should be an instance of Element');
    }
    //TODO Both must be defined
    collData = collData||{};
    docData = docData||{};
    this.element = element;
    this.collData = collData;
    this.docData = docData;
    this.init();
};

BratFrontendEditor.prototype = {
    constructor: BratFrontendEditor,
    init: function() {
        var self = this;
        var html = require("./brat.html");
        self.element.innerHTML = html;
        window.jQuery = $;
        (function($){
            require("./client/lib/jquery-ui.min");
            require("./client/lib/jquery.svg.min");
            require("./client/lib/jquery.svgdom.min");
            require("jquery-bbq");
            require("./client/lib/jquery.sprintf");
            require("./client/lib/jquery.json.min");
            //TODO Fix this error
            window.WebFont = require("./client/lib/webfont.js").WebFont; //Uncaught TypeError: Cannot set property 'WebFont' of undefined

            //brat global helpers
            var Config= require("./client/src/configuration");
            window.Configuration = new Config();
            window.Util = require("./client/src/util");

            // brat modules
            window.Dispatcher = require("./client/src/dispatcher");
            window.URLHash = require("./client/src/url_hash"); //TODO Figure out
            window.LocalAjax = require("./client/src/local_ajax");
            window.Visualizer = require("./client/src/visualizer");
            window.VisualizerUI = require("./client/src/visualizer_ui");
            window.AnnotatorUI = require("./client/src/annotator_ui");
            window.Spinner = require("./client/src/spinner");

            $(document).ready(function(){
                var dispatcher = new Dispatcher();
                var ajax = new LocalAjax(dispatcher);
                var visualizer = new Visualizer(dispatcher, 'svg');
                var svg = visualizer.svg;
                var visualizerUI = new VisualizerUI(dispatcher, svg);
                var annotatorUI = new AnnotatorUI(dispatcher, svg);
                var spinner = new Spinner(dispatcher, '#spinner');
                dispatcher.post('init');

                self.docData.collection = null;
                dispatcher.post('collectionLoaded', [self.collData]);
                dispatcher.post('requestRenderData', [self.docData]);
                dispatcher.post('current', [self.collData, self.docData, {}]);
            });

        })($);
    }
};

