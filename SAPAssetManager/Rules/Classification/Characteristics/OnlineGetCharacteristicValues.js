import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

/**
 *
 * @param {*} context
 * @returns
 */
export default function OnlineGetCharacteristicValues(context) {
    let binding = context.binding;
    if (!binding.Characteristic) {
        binding = context.getPageProxy().getActionBinding();
    }
    const charValues = [];
    const dataType = libCom.getStateVariable(context, 'CurrentOnlineObjectDataType');
    const property = context.evaluateTargetPathForAPI(`#Page:${CharValuesQuerySchema[dataType]?.DetailsPageName}`).binding[CharValuesQuerySchema[dataType]?.FilterProperty];
    const charId = binding.Characteristic?.CharId;

    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', CharValuesQuerySchema[dataType]?.EntitySet, [], `$filter=${CharValuesQuerySchema[dataType]?.FilterProperty} eq '${property}'`).then(results => {
        for (let i = 0; i < results.length; i++) {
            let item = results.getItem(i);
            if (item.CharId === charId) {
                item.Characteristic = binding.Characteristic;
                charValues.push(item);
            }
        }
        return charValues;
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue(), error);
        return charValues;
    });
}

const CharValuesQuerySchema = Object.freeze({
    '#sap_mobile.Equipment': {
        EntitySet: 'EquipmentClassCharValues',
        FilterProperty: 'EquipId',
        DetailsPageName: 'OnlineEquipmentDetailsPage',
    },
    '#sap_mobile.FunctionalLocation': {
        EntitySet: 'FuncLocClassCharValues',
        FilterProperty: 'FuncLocIdIntern',
        DetailsPageName: 'OnlineFunctionalLocationDetails',
    },
});
