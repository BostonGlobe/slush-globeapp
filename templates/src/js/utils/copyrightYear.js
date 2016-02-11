export default function copyrightYear() {
	var d = new Date();
	var year = d.getFullYear();
	var el = document.getElementsByClassName('g-footer--copyright-year');
	if (el.length) {
		el[0].innerHTML = year;
	}
};
