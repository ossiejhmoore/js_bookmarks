
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
})();

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
});})();

// show me the dataid of the category displayed here
(function() { 
    const $field = $("[name=AttrSet]"); 
    const value = $field.val();
    const $span = $("<div>"); 
    $span.css("font-weight", "bold"); 
    $span.css("color", "green");
    $span.append(value); 
    $span.append("<br />"); 
    $span.css("border", "2px solid green");
    $span.css("padding", "3px");
    $field.after($span); 
})();


//unreserve this thing
(function() {
    const dataid = (window.location+"").toLowerCase().replace(/^.*(objid|nodeid|dataid)=/g, '').replace(/[^0-9].*$/g, '');
    const urlXMLExport = "?func=ll&objId=" + dataid + "&objAction=xmlexport&nodeinfo";
    $.ajax({
        url: urlXMLExport,
        success: function(data) {
            if ((typeof(data) !== "undefined") && (data !== null)) {
                const text = new XMLSerializer().serializeToString(data.documentElement);
                const reservedByMatch = text
                    .toLowerCase()
                    .match("reservedby=\"[0-9]{4,12}\"");
                if ( (typeof(reservedByMatch) !== "undefined") && (reservedByMatch !== null) && (reservedByMatch.length > 0) ) {
                    console.log("is reserve, unreserve now...");

                    const urlUnreserve = "?func=ll&objId=" + dataid + "&objAction=unreservedoc&nexturl=";
                    const win = window.open(urlUnreserve, "_blank");
                    const expire = (new Date()).getTime() + 5000;
                    const func = function(win, expire) {
                        console.log("Looking for submit button...");
                        const $submit = $(win.document).find("input[type=submit]");
                        if ($submit.length === 0) {
                            const now = (new Date()).getTime();
                            if (now <= expire) {
                                setTimeout(function() {func(win, expire);}, 500);
                            }
                        } else {
                            $submit.click();
                            setTimeout(function() {
                                win.close();
                            },500);
                        }
                    };
                    if (win === null) {
                        alert("New window didn't open. Maybe you are blocking popups?");
                    } else {
                        func(win, expire);
                    }
                } else {
                    alert("document not reserved.");
                }
            }
        }
    });
})();

//get text string that diffable of all input/textarea/select fields for constants or livereport edit page
(function() {
    const $first = $("#constantname_1,#databaseSelect");
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
(function(){
    $("input[value=Edit]").click();
})();

