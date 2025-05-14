
export default function InspectionCharacteristicsFDCFilterPickerItems() {
    let jsonResult = [];

    jsonResult.push(
        {
            'DisplayValue': '$(L,out_of_range)',
            'ReturnValue': 'Error',
        },
    );

    jsonResult.push(
        {
            'DisplayValue': '$(L,empty)',
            'ReturnValue': 'Empty',
        },
    );

    return jsonResult;
}
