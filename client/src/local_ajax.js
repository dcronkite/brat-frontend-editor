var LocalAjax = (function($, window, undefined) {
    var LocalAjax = function(dispatcher) {
        var that = this;

        var createAnnotation = function(data){
            var attrs = JSON.parse(data.attributes),
                offsets = JSON.parse(data.offsets),
                e_type = data.collection.entity_types.find( x => x.type === data.type ), //Entity or Trigger //TODO: We must navigate in children n sub-children to support hierarchical entities
                e_id = "";//Entity or Trigger
            if(!e_type){
                //Trigger
                e_type = data.collection.event_types.find( x => x.type === data.type );
                if(e_type){
                    var trigger_id = "T" + (that.document.triggers.length + 1); //TODO: must absolutely be unique
                    e_id = "E" + (that.document.triggers.length + 1); //TODO: must absolutely be unique
                    data.document.triggers.push([
                        trigger_id,
                        data.type,
                        offsets
                    ]);
                    data.document.events.push([
                        e_id,
                        trigger_id,
                        []
                    ]);
                }
            }else{
                //Validate max fragment length (doesn't work much with overlaps)
                //Use discontinguity to fix long annotations glitches before calling BRAT rendering engine.
                //TODO: Break fragments at line jumps if possible
                //TODO: Make MAX_LENGTH dynamic depending on svg total width and zoom level
                //TODO: Recalculate (fake) fragment offsets when resizing window
                //TODO: Flag (fake) annotation fragments
                //TODO: Reevaluate (fake) flagged fragments before sending annotation to backend service
                var MAX_LENGTH = 80;
                var new_offsets = [];

                //if(offsets.find( x => (x[1] - x[0]) > MAX_LENGTH)){
                //    offsets.forEach(function(fragment){
                //        var from = fragment[0],
                //            lastFrom = from,
                //            to = fragment[1],
                //            lastTo = from;
                //        var i = 0;
                //        while((to - lastFrom) > MAX_LENGTH){
                //            lastFrom = lastTo;
                //            lastTo = lastTo + MAX_LENGTH;
                //            var subtext = "";
                //            if(lastTo <= data.document.text.length){
                //                subtext = data.document.text.substring(lastFrom, lastTo);
                //            }
                //            if(lastTo >= to ){
                //                lastTo = to;
                //            }else{
                //                lastTo = lastFrom + subtext.lastIndexOf(' ');
                //            }
                //            new_offsets.push([lastFrom, lastTo]);
                //            i++;
                //        }
                //    });
                //}else{
                    new_offsets = offsets;
                //}


                //Split by word based on space, supports overlaps but wrong results...
                //Must discard spaces from annotations, so it is not contigius anymore...
                /*var new_offsets = [];
                offsets.forEach(function(fragment){
                    var from = fragment[0],
                        lastFrom = from,
                        to = fragment[1],
                        lastTo = from - 1,
                        fragmentText = data.document.text.substring(from, to),
                        array = fragmentText.split(" ");
                    array.forEach(function(word){
                        lastFrom = lastTo + 1;
                        lastTo = lastFrom + word.length;
                        new_offsets.push([lastFrom, lastTo]);
                    });
                });*/

                //Entity
                e_id = "N" + (that.document.entities.length + 1); //TODO: must absolutely be unique
                data.document.entities.push([
                    e_id,
                    data.type,
                    new_offsets
                ]);
            }

            for (var key in attrs) {
                data.document.attributes.push([
                    "A" + (that.document.attributes.length + 1), //TODO: must absolutely be unique,
                    key,
                    e_id,
                    attrs[key]
                ]);
            }
            if(data.comment.length){
                data.document.comments.push([
                    e_id,
                    "AnnotatorNotes",
                    data.comment
                ]);
            }
            return {
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
                    "events": data.document.events,
                    "comments": data.document.comments
                },
                edited: [[e_id]],
                messages: [],
                protocol: 1
            };
        };

        var editAnnotation = function(data){
            var e_type = {}, //Entity or Trigger
                attrs = JSON.parse(data.attributes),
                offsets = JSON.parse(data.offsets);

            //Edit annotation TODO: Validation is based on id, fix this
            if(data.id.substring(0, 1) == "E"){
                //Event annotation
                //data.normalisations ??
                var annotation = data.document.events.find( x => x[0] === data.id );
                var trigger_id = annotation[1];
                var trigger = data.document.triggers.find( x => x[0] === trigger_id );
                trigger[1] = data.type;
                trigger[2] = offsets;
                e_type = data.collection.event_types.find( x => x.type === data.type );
            }else if(data.id.substring(0, 1) == "N"){
                //Entity annotation
                var entity = data.document.entities.find( x => x[0] === data.id );
                entity[1] = data.type;
                entity[2] = offsets;
                e_type = data.collection.entity_types.find( x => x.type === data.type ); //TODO: We must navigate in children to support hierarchical entities
            }else{
                //TODO: Error
            }
            if(e_type){
                //Removed all attributes for this particular annotation id
                var existing_attrs = data.document.attributes.filter( x => x[2] === data.id);
                existing_attrs.forEach(function(attr){
                    var index = data.document.attributes.indexOf( x => x[0] === attr[0]);
                    data.document.attributes.splice(1, index);
                });

                //Re-add all attributes
                for (var key in attrs) {
                    existing_attrs.find(x => x[1] === key);

                    data.document.attributes.push([
                        "A" + (that.document.attributes.length + 1), //TODO: must absolutely be unique,
                        key,
                        data.id,
                        attrs[key]
                    ]);
                }

                //Add/Edit comment content
                if(data.comment.length){
                    var comment = data.document.comments.find( x => x[0] === data.id);
                    if(comment){
                        //Edit
                        comment[2] = data.comment;
                    }else{
                        //Add
                        data.document.comments.push([
                            data.id,
                            "AnnotatorNotes",
                            data.comment
                        ]);
                    }
                }
                //Comments && Attributes are deactivated for relations at this point

                return {
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
                        "events": data.document.events,
                        "comments": data.document.comments
                    },
                    edited: [[data.id]],
                    messages: [],
                    protocol: 1
                };
            }else{
                return {}; //TODO: Error handling
            }

        };

        createRelation = function(data){
            var e_type = data.collection.relation_types.find( x => x.type === data.type ); //Entity or Event

            if(!e_type){
                //Event relation
                /*data.collection.event_types.forEach(function(event){
                    event.arcs.forEach(function(eRelation){
                        if(eRelation.type === data.type){
                            e_type = event;
                            //TODO: Exit loop
                        }
                    })
                });*/
                e_type = data.document.events.find( x => x[0] === data.origin );
                if(e_type){
                    e_type[2].push([
                        data.type,
                        data.target
                    ]);
                }
            }else{
                //Entity relation
                var obj =
                [
                    "R" + (that.document.relations.length + 1), //TODO: must absolutely me unique
                    data.type,
                    [
                        [e_type.args[0].role, data.origin],
                        [e_type.args[1].role, data.target]]
                ];
                data.document.relations.push(obj);
            }
            return {
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
                    //"ctime": 1.0,
                    //"collection": "",
                    //"document": "",
                    //"equivs": [],
                    //"mtime": 1.0,
                    //"sentences_offsets": [],
                    //"token_offsets": [],
                },
                edited: [[data.origin], [data.target]],
                messages: [],
                protocol: 1
            };
        };

        var editRelation = function(data){
            var e_type = data.collection.relation_types.find( x => x.type === data.type ); //Entity or Event

            if(!e_type){
                //Event relation
                e_type = data.document.events.find( x => x[0] === data.origin );
                if(e_type){

                }
            }else{
                //Entity relation
                var relation = data.document.relations.find( x => x[1] === data.old_type && x[2][0][1] === data.origin && x[2][1][1] === data.old_target );
                relation[1] = data.type;
                relation[2] = [
                    [e_type.args[0].role, data.origin],
                    [e_type.args[1].role, data.target]
                ];
            }

            return {
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
                    "events": data.document.events,
                    "comments": data.document.comments
                },
                edited: [[data.origin], [data.target]],
                messages: [],
                protocol: 1
            };

        };

        var localExecution = function(data, callback, merge) {
            dispatcher.post('spin');
            that.collection = data.collection;
            that.document = data.document;
            var response = {};

            switch(data.action){
                case "getDocument":
                    //TODO
                    break;
                case "loadConf":
                    //TODO
                    break;
                case "getCollectionInformation":
                    //TODO
                    break;
                case "createArc":
                    //TODO: Validate model with inputs
                    if(data.old_target || data.old_type){
                        response = editRelation(data);
                    }else{
                        response = createRelation(data);
                    }
                    break;
                case "deleteArc":
                    //TODO
                case "reverseArc":
                    //TODO
                    break;
                case "createSpan":
                    //Edit and Created actions on Entities as well as Triggers(Events)
                    //TODO: Validate model with inputs
                    if(data.id){
                        response = editAnnotation(data);
                    }else{
                        response = createAnnotation(data);
                    }
                    break;
                case "deleteSpan":
                    //TODO
                    break;
                case "deleteFragmentxyz?":
                    //TODO
                    break;
                case "splitSpan":
                    //TODO
                    break;
                case "tag":
                    //TODO ??
                    var obj = {
                        collection: data.collection,
                        document: data.document,
                        tagger: data.tagger
                    };
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
                    break;
                default:
                    //TODO
                    break;
            }

            dispatcher.post(0, callback, [response]);
            dispatcher.post('unspin');
        };

        dispatcher.
        on('ajax', localExecution);
    };

    return LocalAjax;
})(jQuery, window);
