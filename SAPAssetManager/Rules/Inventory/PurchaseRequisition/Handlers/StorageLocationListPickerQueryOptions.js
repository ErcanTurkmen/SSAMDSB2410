import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function StorageLocationListPickerQueryOptions(context) {
    let options = '$orderby=StorageLocation';

    // if it is the first time in - CREATE, then use default Plant
    // else check if context.binding.plant
    if (CommonLibrary.IsOnCreate(context)) {
        options += `&$filter=Plant eq '${CommonLibrary.getUserDefaultPlant()}'`;
    } else if (context.binding && context.binding.Plant) {
        options += `&$filter=Plant eq '${context.binding.Plant}'`;
    }

    return options;
}
