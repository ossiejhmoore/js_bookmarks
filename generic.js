

//inject a text area at the top of the page
(function() {

    const div = document.createElement("div");
    div.style.padding = "10px";
    document.body.insertBefore(div,document.body.children[0]);

    const ta = document.createElement("textarea");
    ta.rows = 5;
    ta.style.width = "100%";
    div.append(ta);

})();

//flatten first textarea contents to single line
(function() {
    const taAll = document.getElementsByTagName("textarea");
    if (taAll.length > 0) {
        const taFirst = taAll[0];
        const contents = taFirst.value;
        const flat = contents
            .replace(/^ */g, '')
            .replace(/\n */g, '');
        taFirst.value = 'javascript:' + flat;
    }
})();

//get textualy diffable string of all input/textarea/select fields for any web page
(function () {
    let data = "";
    const names = ["input", "textarea", "select"];
    names.forEach(function (name) {
        const fields = document.getElementsByTagName(name);
        if ((typeof(fields) !== "undefined") && (fields != null)) {
            for (let i = 0 ; i < fields.length ; i++) {
                const field = fields[i];
                data = data
                    + "id:" + ((typeof (field.id) === "undefined") ? "" : field.id)
                    + "|name:" + ((typeof (field.name) === "undefined") ? "" : field.name)
                    + "|value:" + field.value
                    + "\n\n";
            }
        }
    });

    const div = document.createElement("div");
    {
        div.style.padding = "10px";
        document.body.insertBefore(div, document.body.children[0]);
        const ta = document.createElement("textarea");
        {
            ta.style.height = "100px";
            ta.style.width = "100%";
            ta.value = data;
        }
        div.append(ta);
    }
})();