export default function WarehouseOrderSubTitleDetails(context) {

    let subTitle = [];

    if (context.binding.WOCreationRule) {
        subTitle.push(context.binding.WOCreationRule);
    }
    if (context.binding.WOProcessType) {
        subTitle.push(context.binding.WOProcessType);
    }
    if (context.binding.Queue) {
        subTitle.push(context.binding.Queue);
    }
    return subTitle.join(' , ');

}

