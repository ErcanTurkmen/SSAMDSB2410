export default function BOMMaterialUOMPicketItems(context) {
    let jsonResult = [];
    jsonResult.push(
    {
        'DisplayValue': `${context.binding.UoM}`,
        'ReturnValue': `${context.binding.UoM}`,
    });
    return jsonResult;
}
