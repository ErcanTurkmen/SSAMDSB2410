export default function CharacteristicSorter(a,b) {
    if (Number.isNaN(parseInt(a.ReturnValue.split('|')[1])) || Number.isNaN(parseInt(b.ReturnValue.split('|')[1]))) {
        return a.ReturnValue.localeCompare(b.ReturnValue);
    }
    return parseInt(a.ReturnValue.split('|')[1]) - parseInt(b.ReturnValue.split('|')[1]);
}
