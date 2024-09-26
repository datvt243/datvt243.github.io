export function convertNumberToDate(number: number) {
    if (typeof number !== 'number') return '--/--';
    const _date = new Date(number);
    const _y = _date.getFullYear();
    let _m: string | number = _date.getMonth() + 1;
    _m = _m < 10 ? `0${_m}` : _m;
    return `${_m}/${_y}`;
}
