
export default function IsPlantStandardModel(context, plantId) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMModelTypes', [], `$filter=PlanningPlant eq '${plantId}'`)
        .then(data => data && data.length ? data.getItem(0).WCMModel === context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMModel/StandardModel.global').getValue() : undefined);
}
