import isDefenseEnabled from '../../../Defense/isDefenseEnabled';

export default function SerialNumsListTarget(context) {

    let jsonResult = context.binding?.SerialNumsArray ?? [];
    let searchString = context.searchString;

    if (searchString) {
        return jsonResult.filter(function(item) { //Handle searching for serial number or universal item id (for defense)
            if (isDefenseEnabled(context)) return item.ReturnValue.toLowerCase().includes(searchString.toLowerCase()) || item.UniversalItemId.toLowerCase().includes(searchString.toLowerCase());
            return item.ReturnValue.toLowerCase().includes(searchString.toLowerCase());
        });
    }

    return jsonResult;
}
