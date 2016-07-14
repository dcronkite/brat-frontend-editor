var $ = require("jquery");

window.jQuery = $;
(function($){
    var bbq = require("jquery-bbq");
    var Dispatcher = require("./client/src/dispatcher");

    $(document).ready(function(){
        var dispatcher = new Dispatcher();
        console.log("yolo");
    });

})($);

/*headjs.js(
    'node_modules/jquery1-7-1/index.js',// 'client/lib/_jquery.min.js',
    'client/lib/jquery-ui.min.js',
    'client/lib/jquery.svg.min.js',
    'client/lib/jquery.svgdom.min.js',
    'node_modules/jquery-bbq/jquery.ba-bbq.min.js', //'client/lib/_jquery.ba-bbq.min.js',
    'client/lib/jquery.sprintf.js',
    'client/lib/jquery.json.min.js',
    'client/lib/webfont.js',
    // brat helpers
    'client/src/configuration.js',
    'client/src/util.js',
    //'client/src/annotation_log.js', //BRAT STANDALONE LIBRARY as nothing to do with user log management
    // brat modules
    'client/src/dispatcher.js',
    //'client/src/url_monitor.js', //BRAT STANDALONE LIBRARY needs to be URL independant
    'client/src/url_hash.js', //Created by BRAT STANDALONE LIBRARY and removed from trl_monitor since it's used intensively by visualizer and annotator
    'client/src/local_ajax.js',
    'client/src/ajax.js',
    'client/src/visualizer.js',
    'client/src/visualizer_ui.js',
    'client/src/annotator_ui.js',
    'client/src/spinner.js'
);*/