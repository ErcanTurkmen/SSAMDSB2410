import libCom from '../../Common/Library/CommonLibrary';
import libForm from '../../Common/Library/FormatLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export default function EquipmentOrFunclocDescriptionOrEmpty(context) {
    let binding = context.binding;
    if (binding.EquipId) {
        return GetEquipmentDescription(context, binding.EquipId);
    } else if (binding.FuncLocIdIntern) {
        return GetFuncLocDescription(context, binding.FuncLocIdIntern);
    }
    return Promise.resolve('');
}

export function GetEquipmentDescription(context, equipId) {
    return GetFormattedIdDescPairOrDash(context, 'MyEquipments', 'EquipDesc', equipId);
}

export function GetFuncLocDescription(context, FuncLocIdIntern) {
    return GetFormattedExternalIdDescPairOrDash(context, 'MyFunctionalLocations', 'FuncLocDesc', FuncLocIdIntern, 'FuncLocId');
}

function GetFormattedIdDescPairOrDash(context, entitySetName, descPropName, entityId) {
    return entityId ? libCom.getEntityProperty(context, `${entitySetName}('${entityId}')`, descPropName).then(description => description ? libForm.getFormattedKeyDescriptionPair(context, entityId, description) : '-') : Promise.resolve('-');
}

function GetFormattedExternalIdDescPairOrDash(context, entitySetName, descPropName, entityId, externalIdPropName) {
    if (!entityId) {
        return Promise.resolve('-');
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${entitySetName}('${entityId}')`, [], '').then(singleValue => {
        const element = ValidationLibrary.evalIsEmpty(singleValue) ? undefined : singleValue.getItem(0);
        return element && element[externalIdPropName] && element[descPropName] ? libForm.getFormattedKeyDescriptionPair(context, element[externalIdPropName], element[descPropName]) : '-';
    });
}
