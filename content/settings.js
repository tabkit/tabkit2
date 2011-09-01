var dependencies = [
    //<depended upon>, <value for enabled>, <dependency1>, [<dependency2>,] ...
    ["indentedtree", "true", "maxtreelevel", "indentamount"],
    ["openselectedlinks", "true", "openselectedlinks-showall"],
    ["shiftdraggroups", "true", "shiftdragsubtrees"],
    ["autogroupnewtabs", "true", "lastactivegrouping"],
    ["newtabposition", "2", "lastactivesort"]
];

function Listener(dep) {
    this.handleEvent = function handleEvent(event) {
        var el = document.getElementById(dep[0]);
        var disabled = (("value" in el ? el.value : String(el.checked)) != dep[1]);
        for (var i = 2; i < dep.length; i++) {
            setDisabled(dep[i], disabled);
        }
    };
}

function onLoad() {
    for each (var dep in dependencies) {
        var listener = new Listener(dep);
        listener.handleEvent(null);
        document.getElementById(dep[0] + "-pref").addEventListener("change", listener, false);
    }
    
    var multipleRows = document.getElementById("multiplerows");
    if (document.getElementById("tabrows").value == "1")
        setDisabled("tabrows", true);
    else
        multipleRows.checked = true;
    multipleRows.addEventListener("command", toggleMultipleRows, false);
    
    switchTabbarOrient();
    document.getElementById("tabbarposition-pref").addEventListener("change", switchTabbarOrient, false);
}

function toggleMultipleRows() {
    var pref = document.getElementById("tabrows-pref");
    if (document.getElementById("multiplerows").checked) {
        setDisabled("tabrows", false);
        if (pref.value == 1) // N.B. Assumes multiple rows is default
            pref.value = (pref.valueFromPreferences == 1 ? pref.defaultValue : pref.valueFromPreferences);
    }
    else {
        setDisabled("tabrows", true);
        pref.value = 1;
    }
}

function switchTabbarOrient() {
    var pos = document.getElementById("tabbarposition-pref").value;
    var horiz = (pos == 0 || pos == 3);
    
    //document.getElementById("horizontaltabbar").collapsed = !horiz;
    var notMultipleRows = !document.getElementById("multiplerows").checked;
    setDisabled("multiplerows", !horiz);
    setDisabled("tabrows", !horiz || notMultipleRows);
    
    //document.getElementById("verticaltabbar").collapsed = horiz;
    var notIndentedTree = !document.getElementById("indentedtree").checked;
    setDisabled("indentedtree", horiz);
    setDisabled("maxtreelevel", horiz || notIndentedTree);
    setDisabled("indentamount", horiz || notIndentedTree);
}

function setDisabled(elid, disabled) {
    document.getElementById(elid).disabled = disabled;
    var labels = document.getElementsByAttribute("control", elid);
    for (var i = 0; i < labels.length; i++)
        labels[i].disabled = disabled;
}

function resetAll() {
    var prefs = document.getElementsByTagName("preference");
    for (var i = 0; i < prefs.length; i++) {
        var pref = prefs[i];
        // Bug 390616 - <preference>'s defaultValue is wrong for string or unichar prefs - https://bugzilla.mozilla.org/show_bug.cgi?id=390616
        var def = pref.type == "string" ? pref.preferences.defaultBranch.getCharPref(pref.name) : pref.defaultValue;
        if (pref.value != def)
            pref.value = def;
    }
    document.getElementById("multiplerows").checked = true; // N.B. Assumes multiple rows is default
    toggleMultipleRows();
}

function disableAll() {
    resetAll();
    document.getElementById("multiplerows").checked = false;
    toggleMultipleRows();

    document.getElementById("tabbarposition-pref").value = 0;
    document.getElementById("sidebarposition-pref").value = 1;
	
    document.getElementById("highlightunreadtabs-pref").value = false;
    document.getElementById("emphasizeprotectedtabs-pref").value = false;
    document.getElementById("forcethemecompatibility-pref").value = 0;

    document.getElementById("tabwheeltabswitch-pref").value = false;
    document.getElementById("lmbrmbbackforward-pref").value = false;
    document.getElementById("doubleclickcollapseexpand-pref").value = false;
    document.getElementById("acceldragcopy-pref").value = false;
    document.getElementById("shiftdraggroups-pref").value = false;
    document.getElementById("scrollbarsnotarrows-pref").value = false;
    document.getElementById("scrolloneextra-pref").value = false;
    document.getElementById("openselectedlinks-pref").value = false;

    document.getElementById("autogroupnewtabs-pref").value = false;
    document.getElementById("newtabposition-pref").value = 0;
    document.getElementById("lastactivesort-pref").value = "creation";
    document.getElementById("customcloseorder-pref").value = 4;

    document.getElementById("closebeforeafternotother-pref").value = false;
}
