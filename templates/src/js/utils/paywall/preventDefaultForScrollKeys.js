import preventDefault from './preventDefault'

export default function preventDefaultForScrollKeys(e) {
	const keys = {38: 1, 40: 1, 32: 1};
	if (keys[e.keyCode]) {
		preventDefault(e)
		return false
	}
}
