import Logger from '../Log/Logger';

export default function FormatPlanningPlant(context) {
    // Taking around 0.8 seconds
    return context.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${context.binding.MaintPlant}')`, [], '$select=PlantDescription').then(function(result) {
        if (result && result.getItem(0)) {
            return context.binding.MaintPlant + ' - ' + result.getItem(0).PlantDescription;
        } else {
            return '-';
        }
    }).catch((error) => {
        Logger.error('FormatPlanningPlant', error);
        return '-';
    });
}
