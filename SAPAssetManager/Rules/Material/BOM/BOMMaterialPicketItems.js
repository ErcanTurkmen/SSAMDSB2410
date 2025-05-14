export default function BOMMaterialPicketItems(context) {
    let jsonResult = [];
    let desc = '';
    if (context.binding.MaterialDesc) {
        desc = context.binding.MaterialDesc + ' (' + context.binding.MaterialNum + ')';
    }
    jsonResult.push(
    {
        'DisplayValue': `${desc}`,
        'ReturnValue': `${context.binding.MaterialNum}`,
    });
    return jsonResult;
}
