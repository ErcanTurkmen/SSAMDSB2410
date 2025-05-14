export default function StockTypePickerItems() {

    let jsonResult = [];

    jsonResult.push(
        {
            'DisplayValue': '$(L,stock_type_options_blocked)',
            'ReturnValue': 'S',
        });

    jsonResult.push(
        {
            'DisplayValue': '$(L,stock_type_options_inspection)',
            'ReturnValue': 'X',
        });

    jsonResult.push(
        {
            'DisplayValue': '$(L,stock_type_options_unrestricted)',
            'ReturnValue': 'UNRESTRICTED',
        });

    return jsonResult;

}
