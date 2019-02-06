export default function ieVersionOrLess(x) {
  const v = x || 0;
  const htmlClasses = document.getElementsByTagName('html')[0].className;
  const matches = htmlClasses.match(/ie(\d+)/);
  return matches && +matches[1] <= v;
}
