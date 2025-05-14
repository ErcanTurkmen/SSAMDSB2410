
export default function GetItemLink(context) {
    const itemData = context.getActionResult('CreateResult');
    if (itemData) {
        return JSON.parse(itemData.data)['@odata.readLink'];
    }
    return context.binding ? context.binding['@odata.readLink'] : '';
}
