import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetPlanningPlant(context) {
    let plant = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'MaintenacePlantLstPkr'));

    if (plant) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${plant}')`, ['PlanningPlant'], '').then(result => {
            return result.length ? result.getItem(0).PlanningPlant : '';
        });
    }

    return Promise.resolve('');
}
