/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */

export default function loadJS(src, cb) {
  const ref = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);

  if (cb && typeof cb === 'function') {
    script.onload = cb;
  }

  return script;
}
