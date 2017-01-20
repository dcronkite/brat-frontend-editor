window.$ = require('./client/lib/node-jquery-1.7.1'); //require('jquery-node-browserify'); // @1.7.2 ++
LONG_ANNOTATION_CONST = "LongAnnotation";

window.BratFrontendEditor = function(element, collData, docData, options) {
    if (!(element instanceof Element)) {
        throw new Error('element should be an instance of Element');
    }

    collData = collData || {};
    docData = docData || {};
    options = options || {};

    //DEFAULT OPTIONS
    newOptions = {
        activateEdition: true,
        assetsPath: "static/",
        maxFragmentLength: 30,
        webFontURLs: [
            'fonts/Astloch-Bold.ttf',
            'fonts/PT_Sans-Caption-Web-Regular.ttf',
            'fonts/Liberation_Sans-Regular.ttf'
        ],
        ajax: 'local' // 'local', 'external' or 'normal'
    };

    // If option defined, over-write newOptions
    for(var opt in options){
        if(options.hasOwnProperty(opt)){
            newOptions[opt] = options[opt];
        }
    }

    this.element = element;
    this.collData = collData;
    this.docData = docData;
    this.options = newOptions;
    this.init();
};

BratFrontendEditor.prototype = {
    constructor: BratFrontendEditor,
    init: function() {
        var self = this;
        var html = require('./brat.html');
        self.element.innerHTML = html;
        self.setHtmlImgSrc();

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
                        self.ajax = new LocalAjax(self.dispatcher, self.options.maxFragmentLength);
                        break;
                    case 'normal':
                        self.ajax = new Ajax(self.dispatcher);
                        break;
                    case 'external':
                        break;
                    default:
                        self.ajax = new LocalAjax(self.dispatcher, self.options.maxFragmentLength);
                        break;
                }
                var absoluteWebFontsURLS = [
                    self.options.assetsPath + self.options.webFontURLs[0],
                    self.options.assetsPath + self.options.webFontURLs[1],
                    self.options.assetsPath + self.options.webFontURLs[2],
                ];
                self.visualizer = new Visualizer(self.dispatcher, 'svg', absoluteWebFontsURLS);
                self.svg = self.visualizer.svg;
                if(self.options.activateEdition === true){
<<<<<<< Updated upstream
                    self.visualizerUI = new VisualizerUI(self.dispatcher, self.svg);
                    self.annotatorUI = new AnnotatorUI(self.dispatcher, self.svg);
                    self.spinner = new Spinner(self.dispatcher, '#spinner');
=======
                    self.visualizerUI = new VisualizerUI(self.dispatcher, self.svg, self.options.showTooltip, self.options.overWriteModals);
                    self.annotatorUI = new AnnotatorUI(self.dispatcher, self.svg);
                    // self.spinner = new Spinner(self.dispatcher, '#spinner');
>>>>>>> Stashed changes
                }
                self.dispatcher.post('init');

                if(self.options.maxFragmentLength > 0){
                    self.addLongAnnotationEntityAttribute();
                }

                self.docData.collection = null;
                self.dispatcher.post('collectionLoaded', [self.collData]);
                self.dispatcher.post('requestRenderData', [self.docData]);
                self.dispatcher.post('current', [self.collData, self.docData, {}]);
            });

        })($);
    },
    addLongAnnotationEntityAttribute: function(){
        // Special symbol for splitted long annotations
        this.collData.entity_attribute_types.push( {
            "name": LONG_ANNOTATION_CONST,
            "type"  : LONG_ANNOTATION_CONST,
            "values": { LONG_ANNOTATION_CONST: { "glyph": "↹" } }
        });
        this.collData.entity_types.forEach(function(type){
            type.attributes.push(LONG_ANNOTATION_CONST);
        });
    },
    setHtmlImgSrc: function(){
        var spinners = this.element.getElementsByClassName("brat-spinner");
        var magnifiers = this.element.getElementsByClassName("brat-fugue-shadowless-magnifier");
        var externals = this.element.getElementsByClassName("brat-fugue-shadowless-external");

        if(spinners && spinners.length){
            spinners[0].src = this.options.assetsPath + 'img/spinner.gif';
        }
        if(magnifiers && magnifiers.length){
            magnifiers[0].src = this.options.assetsPath + 'img/Fugue-shadowless-magnifier.png';
        }
        if(externals && externals.length){
            externals[0].src = this.options.assetsPath + 'img/Fugue-shadowless-external.png';
        }
    }
};
