export default async function InspectionCharacteristicsTargetSpecificationCaption(context) {
    let binding = context.binding;

    let caption = context.localizeText('target_specification');

    if (binding.LowerLimitFlag === '' && binding.UpperLimitFlag === '' && binding.MasterInspChar !== '') { //if both are empty and a linked measuring point exists then validate from measuring point's info
            
        let measuringPointArray = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasuringPoints', [], `$filter=CharName eq '${binding.MasterInspChar}'&$top=1`);
        if (measuringPointArray.length > 0) {
            let measuringPoint = measuringPointArray.getItem(0);
            caption += ` (measuring point: ${measuringPoint.CharName})`;
        }
    }

    return caption;
}
