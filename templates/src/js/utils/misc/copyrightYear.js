export default function copyrightYear() {
	const d = new Date()
	const year = d.getFullYear()
	const el = document.getElementsByClassName('g-footer--copyright-year')
	if (el.length) {
		el[0].innerHTML = year
	}
}
