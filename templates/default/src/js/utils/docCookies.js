// from mozilla https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
// removed encodeURI from setItem

const docCookies = {

  getItem(sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')) || null;
  },

  setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    let sExpires = '';
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; max-age=${vEnd}`;
          break;
        case String:
          sExpires = `; expires=${vEnd}`;
          break;
        case Date:
          sExpires = `; expires=${vEnd.toUTCString()}`;
          break;
      }
    }
    document.cookie = `${sKey}=${sValue}${sExpires}${sDomain ? `; domain=${sDomain}` : ''}${sPath ? `; path=${sPath}` : ''}${bSecure ? '; secure' : ''}`;
    return true;
  },

  removeItem(sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = `${encodeURIComponent(sKey)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${sDomain ? `; domain=${sDomain}` : ''}${sPath ? `; path=${sPath}` : ''}`;
    return true;
  },

  hasItem(sKey) {
    if (!sKey) { return false; }
    return (new RegExp(`(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=`)).test(document.cookie);
  },

  keys() {
    const aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
    for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx += 1) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },

};

export default docCookies;
