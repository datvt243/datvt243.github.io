export function formatDate(date: string): string {
	const _date = new Date(date)
	let _d: string | number = _date.getDate(),
		_m: string | number = _date.getMonth() + 1
	_d = _d < 10 ? `0${_d}` : _d
	_m = _m < 10 ? `0${_m}` : _m
	return `${_d}/${_m}/${_date.getFullYear()}`

}