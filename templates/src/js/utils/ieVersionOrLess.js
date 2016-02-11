export default function ieVersionOrLess(x) {
	x = x || 0;
	var htmlClasses = document.getElementsByTagName('html')[0].className;
	var matches = htmlClasses.match(/ie(\d+)/);
	return matches && +matches[1] <= x;
};
