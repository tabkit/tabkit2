
/* eslint-disable @typescript-eslint/no-explicit-any,strict */

// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Language_Bindings/Components_object
declare const Components: any
// https://developer.mozilla.org/en-US/docs/Archive/Add-ons/Tabbed_browser
declare const gBrowser: any
// https://searchfox.org/mozilla-esr45/source/browser/base/content/browser.js#3537
declare const BrowserSearch: any
// https://searchfox.org/mozilla-esr45/source/browser/components/places/content/placesOverlay.xul#31
declare const PlacesUIUtils: any
// https://dxr.mozilla.org/mozilla-central/source/browser/base/content/browser.js#134
declare let gPrefService: any

// Firefox 38 only...
// Missing since FF 45
declare const TabView: undefined | {
  toggle: () => any
}

// https://searchfox.org/mozilla-esr45/source/browser/base/content/utilityOverlay.js#26
declare const TAB_DROP_TYPE: string

declare function uneval(str: string): string

// https://searchfox.org/mozilla-esr45/source/browser/base/content/utilityOverlay.js#33
declare function isBlankPageURL(aURL: string): boolean

// https://searchfox.org/mozilla-esr45/source/browser/base/content/browser.js#1958
declare function BrowserOpenTab(...args: any[]): void


// https://searchfox.org/mozilla-esr45/source/security/manager/pki/nsNSSDialogHelper.h#23
declare function openDialog(
  window: string,
  url: string,
  params: string,
  modal?: boolean,
): void

declare type DOMString = string
declare interface mozURI {
  asciiSpec: string
  spec: string

  asciiHost: string
  host: string

  scheme: string
  path: string
}
declare class Browser {
  webNavigation: {
    currentURI: mozURI
  }
  currentURI: mozURI
}
declare class Tab extends HTMLElement {
  // Firefox
  localName: string
  hidden: boolean
  selected: boolean
  label: string

  previousSibling: Tab | null
  nextSibling: Tab | null

  linkedBrowser: Browser

  boxObject: {
    readonly height: number
    readonly width: number
    readonly screenX: number
    readonly screenY: number
  }

  minWidth: number
  maxWidth: number

  // Add by TabKit
  _tPos: number
  treeLevel?: number
  originalTreeLevel?: number
  groupNotChecked?: boolean
  key: string | number
}
// https://searchfox.org/mozilla-esr45/source/browser/components/search/content/search.xml#278
declare class StringBundle {
  getString(str: string): string | null
}

// Definition by:
// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XBL/XBL_1.0_Reference/DOM_Interfaces
declare class mozDocument extends Document {
  getAnonymousElementByAttribute(
    elt: Element | Tab,
    attrName: DOMString,
    attrValue: DOMString,
  ): HTMLElement

  // https://dxr.mozilla.org/comm-esr45/search?q=tooltipNode&redirect=false
  tooltipNode: Tab
}

declare const document: mozDocument

declare class mozEvent extends Event {
  originalTarget: Element
  target: Element
}
declare class mozMouseEvent extends MouseEvent {
  originalTarget: Element
  target: Element
}
declare class mozWheelEvent extends WheelEvent {
  originalTarget: Element
  target: Element
}

declare class nsContextMenu {
  openFrameInTab: () => any
}
declare interface Window {
  tabkit: any

  // region to be patched functions

  faviconize?: {
    quickFav?: {
      dblclick: (e: Event) => any
    }
  }

  gotoHistoryIndex?: (e: Event) => any

  BrowserBack?: (e: Event) => any
  BrowserForward?: (e: Event) => any
  BrowserReloadOrDuplicate?: (e: Event) => any

  loadSearch?: (searchText: string, useNewTab: boolean, purpose: any) => any

  middleMousePaste?: (e: Event) => any

  newTabButtonObserver?: {
    onDrop?: (searchText: string, useNewTab: boolean, purpose: any) => any
  }

  BrowserOpenTab?: (opts?: {[key: string]: any}) => any

  delayedOpenTab?: (aUrl: string, aReferrer: string, aCharset: string, aPostData: any, aAllowThirdPartyFixup: any) => any

  gURLBar?: {
    handleCommand?: (e: Event) => any
  }

  gBrowser?: {
    _endRemoveTab?: (tab: Tab) => any

    loadTabs?: (aURIs: string[], aLoadInBackground: boolean, aReplace: boolean) => any

    addTab: (_aURI: string, _aReferrerURI: string, _aCharset: string, _aPostData: any, _aOwner: any, _aAllowThirdPartyFixup: boolean) => any
    removeTab: (aTab: Tab, aParams?: any) => any
  }

  nsContextMenu?: nsContextMenu.prototype
  nsBrowserAccess?: (...args: any[]) => void

  openLinkIn?: (url: any, where: string, _params: any) => any

  PlacesUIUtils?: {
    _openNodeIn?: (aNode: any, aWhere: string, aWindow: Window, aPrivate= false) => any
    _openTabset?: (aItemsToOpen: any, aEvent: any, aWindow: Window) => any
  }

  // endregion to be patched functions

  content: window
  fullScreen: boolean
  quickprompt?: (...args: any[]) => void
}

declare interface Function {
  toSource: () => string
}
