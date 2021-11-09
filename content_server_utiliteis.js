
// stretch _Path fields to 800px
(function(){
    const $inputs = $("input[type=text]");
    $inputs.each(function(idx,inp) {
        const $inp = $(inp);
        const name = $inp.attr("name");
        if (typeof(name) !== "undefined") {
            if (name.replace(/_Path$/g, "") !== name) {
                $inp.css("width", "800px");
            } else {
            }
        }
    });
})()

// show field ids and names and the maximum length for the field
(function() {$("input,textarea,select").each(function(idx,inp) {
    const $inp = $(inp);
    if ($inp.is(":visible")) {
        const nam = $inp.attr("name");
        const id = $inp.attr("id");
        let max = $inp.attr("maxlength");
        if (typeof(max) === "undefined") {
            max = "(not set)";
        }
        const lbl = '[name: ' + nam + " id:" + id + " max:" + max + "]";
        const $span = $("<div>");
        $span.css("font-weight", "bold");
        $span.css("color", "green");
        $span.append(lbl);
        $span.append("<br />");
        $inp.after($span);
        $inp.closest("td,div,span").css("border","2px solid green");
        $inp.closest("td,div,span").css("padding","3px");
    }
});})()

// show me the dataid of the category displayed here
(function() { 
    const $field = $("[name=AttrSet]"); 
    const value = $field.val(); 
    const $selectedCategory = $(".selectedCategory"); 
    const $span = $("<div>"); 
    $span.css("font-weight", "bold"); 
    $span.css("color", "green");
    $span.append(value); 
    $span.append("<br />"); 
    $span.css("border", "2px solid green");
    $span.css("padding", "3px");
    $field.after($span); 
})();


//unreserv this thing by opening a new window for the unreserve function
(function() {
    const dataid = (window.location+"").toLowerCase().replace(/^.*(objid|nodeid|dataid)=/g, '').replace(/[^0-9].*$/g, '');
    const url = "?func=ll&objId=" + dataid + "&objAction=unreservedoc&nexturl=";
    window.open(url, "_blank");
})();


//get textualy diffable string of all input/textarea/select fields for constants or livereport edit page
(function() {
    const $first = $("#constantname_1,databaseSelect");
    const $table = $first.closest("table");
    const $fields = $table.find("input,textarea,select");
    let data = "";
    $fields.each(function(idx,field) {
        const $field = $(field);
        let id = $field.attr("id");
        let name = $field.attr("name");
        const val = $field.val();
        data = data + id + "|" + name + "|" + val + "\n";
    });
    const $pt = $(".pageTitleText");
    $pt.append("<br />");
    const $ta = $("<textarea>");
    $ta.val(data);
    $ta.css("width","50%");
    $ta.css("height","100px");
    $pt.append($ta);
    console.log(data);
})();


//get textualy diffable string of all input/textarea/select fields for any page 
//(would include things like the search fields)
(function() {
    const $fields = $("input,textarea,select");
    let data = "";
    $fields.each(function(idx,field) {
        const $field = $(field);
        let id = $field.attr("id");
        id = ((typeof(id) === "undefined") ? "" : id);
        let name = $field.attr("name");
        name = (typeof(name) === "undefined") ? "" : name;
        const val = $field.val();
        data = data + "id:" + id + "|name:" + name + "|value:" + val + "\n\n";
    });

    const $ta = $("<textarea>");
    $ta.css("height","100px");
    $ta.css("width","100%");
    $ta.val(data);
    $ta.insertBefore($("body").children().first());
    console.log(data);
})();

//For the current page, find any field that looks like it *might* be a dataid and try
//to get the full path for that dataid. Display the id/name/dataid/path in a green box
//at the bottom of the td or div that wraps the input (hidden or not) field.
(function() {
    const $allFields = $("input,textarea,select");
    const $iframe = $("<iframe>");
    $iframe.attr("name", "ifrmat-" + (new Date()).getTime());
    const iframename = $iframe.attr("name");
    $allFields.each(function(idx, field) {
        const $field = $(field);
        const value = $field.val();
        if ((typeof(value) !== "undefined") && (value !== null)) {
            const match = value.match("^[0-9]{4,12}$");
            if ((typeof(match) !== "undefined") && (match !== null) && (match.length > 0)) {
                debugger;
                const url = "?func=ll&objaction=properties&objid=" + value;
                const win = window.open(url, iframename);
                const func = function() {
                    let $div = $(win.document).find("div");
                    if ($div.length === 0) {
                        setTimeout(function() {func();}, 250);
                    } else {
                        const path = $(win.document).find(".breadcrumbs-trail").text().replace(/[\n]/g,':').replace(/^[:]/g,'').replace(/ [:]/g, ':') + $(win.document).find("title").text().replace(/^.*[:] */g, '');
                        $div = $("<div>");
                        $div.attr("border", "2px solid green");
                        $div.attr("border", "2px solid green");
                        $div.attr("color", "green");
                        $div.text(path);
                        $field.closest("td,div").append($div);
                    }
                };
                func();
            }
        }
    });
})();

// For each input (hidden or not) on the page where the value looks like a possible dataid (4+ digit number), 
// try to get the path. If there was a node with that dataid, display a green box with the field id/name/value
// and the full path to the node found with that dataid. 
//
// NOTE: Yes, we should use REST, will udpate to do that later. This works with any version, because it puts
//       the property page in an iframe and then exracts the data from that HTML page.
//
(function() {
    const $allFields = $("input,textarea,select");
    let counter = (new Date()).getTime();
    const $h1 = $("<div>");
    $h1.text("getting id values...");
    $h1.insertBefore($("body").children().first());
    $allFields.each(function(idx, field) {
        const $field = $(field);
        const value = $field.val();
        if ((typeof(value) !== "undefined") && (value !== null)) {
            const match = value.match("^[0-9]{4,12}$");
            if ((typeof(match) !== "undefined") && (match !== null) && (match.length > 0)) {
                counter++;
                const $iframe = $("<iframe name='tempframe" + counter + "'>");
                $iframe.css("width","50px");
                $iframe.css("height","50px");
                $h1.append($iframe);
                {
                    const url = "?func=ll&objaction=properties&objid=" + value;
                    const iframewin = window.open(url, $iframe.attr("name"));
                    const func = function() {
                        try {
                            let $div = $(iframewin.document).find("div");
                            if ($div.length < 8) {
                                setTimeout(function() {func();}, 500);
                            } else {
                                setTimeout(function() {
                                    let path = $(iframewin.document).find(".breadcrumbs-trail").text().replace(/[\n]/g,':').replace(/^[:]/g,'').replace(/ [:]/g, ':');
                                    path += $(iframewin.document).find("title").text().replace(/^.*[:] */g, '');
                                    if (path.indexOf('Content Server - Error') === -1) {
                                        $div = $("<div>");
                                        $div.css("border", "3px solid green");
                                        $div.css("color", "green");
                                        
                                        const label = "[ id: " + $field.attr("id") + ", name: " + $field.attr("name") + ", val: " + value + " ]";
                                        $div.append(label);
                                        $div.append("<br />");
                                        $div.append(path);
                                        $div.css("padding","3px");
                                        $field.closest("td,div").append($div);
                                    }
                                    $iframe.detach();
                                    if ($h1.find("iframe").length === 0) {
                                        $h1.detach();
                                    }
                                }, 500);
                            }
                        } catch (err) {}
                    };
                    func();
                }
            }
        }
    });
})();


//transport warehouse - click all edits
javascript:(function(){$("input[value=Edit]").click();})()

