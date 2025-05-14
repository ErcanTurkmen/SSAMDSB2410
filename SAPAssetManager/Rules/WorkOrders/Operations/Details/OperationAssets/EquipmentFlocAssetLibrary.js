import ValidationLibrary from '../../../../Common/Library/ValidationLibrary';
import { GetEquipmentIconImages, GetFlocIconImages } from '../../../../Common/TechnicalObjectListViewIconImages';
import EquipmentDetailsNav from '../../../../Equipment/EquipmentDetailsNav';
import FunctionalLocationDetailsNav from '../../../../FunctionalLocation/FunctionalLocationDetailsNav';
import NavToFunctionalLocationDetails from '../../../../FunctionalLocation/NavToFunctionalLocationDetails';
import OnlineSearchEquipmentDetailsNav from '../../../../OnlineSearch/Equipment/OnlineSearchEquipmentDetailsNav';
import OperationDetailsEquipmentEntitySets from '../../OperationDetailsEquipmentEntitySet';
import OperationDetailsFLOCEntitySet from '../../OperationDetailsFLOCEntitySet';


const EQUIPMENT_DEFAULT_EXPAND = 'ObjectStatus_Nav/SystemStatus_Nav';

/**
 * @typedef AssetType
 * @prop {string} title
 * @prop {string} subhead
 * @prop {string} onPress
 * @prop {string} footnote
 * @prop {string[]} icons
 */

export class EquipmentFlocAssetLibrary {
    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetDetailImage(context) {
        return context.binding.detailImage;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetTitle(context) {
        return context.binding.title;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetSubhead(context) {
        return context.binding.subhead;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetIcons(context) {
        return context.binding.icons;
    }

    /** @param {IPageProxy}} context  */
    static AssetOnPress(context) {
        return context.getPageProxy().getActionBinding().onPress(context);
    }

    /** @param {IPageProxy}} context  */
    static AssetFootnote(context) {
        return context.binding.footnote;
    }

    /** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
    static WorkOrderOperationAssets(context) {
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', OperationDetailsEquipmentEntitySets(context), [], `$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', OperationDetailsFLOCEntitySet(context), [], '$expand=FuncLocDocuments/Document'),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static WorkOrderAssets(context) {
        const binding = context.binding;
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${binding.HeaderEquipment}'&$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], `$filter=FuncLocIdIntern eq '${binding.HeaderFunctionLocation}'`),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static OnlineWorkOrderAssets(context) {
        const binding = context.binding;
        return Promise.all([
            context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'Equipments', [], `$filter=EquipId eq '${binding.HeaderEquipment}'`),
            context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'FunctionalLocations', [], `$filter=FuncLocIdIntern eq '${binding.HeaderFunctionLocation}'`),
        ])
            .then((response) => prepareAssetsItems(context, response, true));
    }

    static WCMObjectsAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/MyEquipments`, []),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/MyFunctionalLocations`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static WorkOrderSubOperationAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/EquipmentSubOperation`, [], `$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/FunctionalLocationSubOperation`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static OnlineWorkOrderSubOperationAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/EquipmentSubOperation`, [], `$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/FunctionalLocationSubOperation`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static NotificationAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/Equipment`, [], `$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/FunctionalLocation`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static ServiceQuotationAssets(context) {
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObjects_Nav`, [], `$filter=sap.entityexists(Equipment_Nav)&$expand=Equipment_Nav/${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObjects_Nav`, [], '$filter=sap.entityexists(FuncLoc_Nav)&$expand=FuncLoc_Nav/FuncLocDocuments/Document'),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static OnlineNotificationAssets(context) {
        return Promise.all([
            context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'Equipments', [], `$filter=EquipId eq '${context.binding.HeaderEquipment}'`),
            context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'FunctionalLocations', [], `$filter=FuncLocIdIntern eq '${context.binding.HeaderFunctionLocation}'`),
        ])
            .then((response) => prepareAssetsItems(context, response, true));
    }
}

/**
 * @param {MyFunctionalLocation} floc
 * @returns {Promise<AssetType>} */
function flocToAsset(context, floc, isOnline) {
    if (floc.FuncLoc_Nav) {
        floc = floc.FuncLoc_Nav;
    }

    return {
        ...floc,
        title: floc.FuncLocDesc,
        onPress: isOnline ? NavToFunctionalLocationDetails : FunctionalLocationDetailsNav,
        preserveIconStackSpacing: false,
        subhead: floc.FuncLocId,
        detailImage: '$(PLT, /SAPAssetManager/Images/DetailImages/Floc.png, /SAPAssetManager/Images/DetailImages/Floc.android.png)',
        footnote: context.localizeText('functional_location'),
        icons: GetFlocIconImages(context, floc),
    };
}

/**
 * @param {IClientAPI} context
 * @param {MyEquipment} equipment
 * @returns {Promise<AssetType>} */
function equipmentToAsset(context, equipment, isOnline) {
    if (equipment.Equipment_Nav) {
        equipment = equipment.Equipment_Nav;
    }

    return {
        ...equipment,
        title: equipment.EquipDesc,
        onPress: isOnline ? OnlineSearchEquipmentDetailsNav : EquipmentDetailsNav,
        preserveIconStackSpacing: true,
        subhead: equipment.EquipId,
        detailImage: '$(PLT, /SAPAssetManager/Images/DetailImages/Equipment.png, /SAPAssetManager/Images/DetailImages/Equipment.android.png)',
        footnote: context.localizeText('equipment'),
        icons: GetEquipmentIconImages(context, equipment),
        statusText: equipment.ObjectStatus_Nav?.SystemStatus_Nav?.StatusText || equipment?.SysStatus,
    };
}

function prepareAssetsItems(context, [equipment, floc], isOnline) {
    return [[equipment, equipmentToAsset], [floc, flocToAsset]]
        .map(([x, mapping]) => !ValidationLibrary.evalIsEmpty(x) && mapping(context, x.getItem(0), isOnline))
        .filter(x => !!x);
}
