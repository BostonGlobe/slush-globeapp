export default function copyrightYear() {
	const year = new Date().getFullYear()
	const el = document.querySelector('.g-footer--copyright-year')
	if (el.length) el[0].innerHTML = year
}
