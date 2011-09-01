// Called once when the dialog displays
function onLoad() {
    window.focus();
}

// Called once if and only if the user clicks OK
function onOK() {
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    
    const PREF_BRANCH = "extensions.tabkit.";
   
    var _prefs = Cc["@mozilla.org/preferences-service;1"]
                 .getService(Ci.nsIPrefService)
                 .getBranch(PREF_BRANCH);
    
    var treeTabs = document.getElementById("treeTabs").selected;
    var multiRowTabs = document.getElementById("multiRowTabs").selected;
    var normalTabs = document.getElementById("normalTabs").selected;
        
    _prefs.setIntPref("tabbarPosition", treeTabs ? 1 : 0);
    _prefs.setIntPref("sidebarPosition", treeTabs ? 2 : 1);
    if (!treeTabs)
        _prefs.setIntPref("tabRows", multiRowTabs ? 3 : 1);
    
    _prefs.setBoolPref("firstRunWizardDone", true);
    
   return true;
}