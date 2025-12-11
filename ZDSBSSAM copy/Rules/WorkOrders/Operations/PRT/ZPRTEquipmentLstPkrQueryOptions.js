import libEval from '../../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../../../../SAPAssetManager/Rules/SideDrawer/EnableMultipleTechnician';
import ModifyListViewSearchCriteria from '../../../../../SAPAssetManager/Rules/LCNC/ModifyListViewSearchCriteria';


export default function ZPRTEquipmentLstPkrQueryOptions(context) {
    try {
        let newFilterOpts = [];
        let userMainternancePlant = libCom.getUserDefaultMainternancePlant();
        let equipID = context.getPageProxy().evaluateTargetPath('#Control:EquipmentNumber').getValue();
        let equipDesc = context.getPageProxy().evaluateTargetPath('#Control:EquipmentDescription').getValue();
        let equipmentLstPkrQueryOptions = context.dataQueryBuilder();
        equipmentLstPkrQueryOptions.expand('SerialNumber');
        equipmentLstPkrQueryOptions.orderBy('EquipId');
        newFilterOpts.push(`PRTFlag eq 'X'`);
        newFilterOpts.push(`EquipCategory eq 'P'`);
        newFilterOpts.push(`MaintPlant eq '${userMainternancePlant}'`);
        if (!context.searchString) {
            if (equipID) {
                newFilterOpts.push(`EquipId eq '${equipID}'`);
            }

            if (equipDesc) {
                newFilterOpts.push(`substringof('${equipDesc.toLowerCase()}',EquipDesc)`);
            }
            equipmentLstPkrQueryOptions.filter(newFilterOpts.join(' and '));
            return equipmentLstPkrQueryOptions
        }
        else {
            let searchString = context.searchString.toLowerCase();
            newFilterOpts.push(getSearchQuery(context, searchString.toLowerCase()));
            equipmentLstPkrQueryOptions.filter(newFilterOpts.join(' and '));
            return equipmentLstPkrQueryOptions;
            //return `'$expand=SerialNumber&$orderby=EquipId&$top=50&$filter=PRTFlag eq 'X' and (EquipId eq 'multimeter' or substringof('${searchString}',EquipDesc))`;
            //'$expand=SerialNumber&$orderby=EquipId&$top=50&$filter=PRTFlag%20eq%20'X'%20and%20substringof('multimeter',EquipDesc)'
        }
    }
    catch (exc) {
    // If page is first loaded, attempts to get controls will fail
    let userMainternancePlant = libCom.getUserDefaultMainternancePlant();
    return `$filter=PRTFlag eq 'X' and EquipCategory eq 'P' and MaintPlant eq` + `'${userMainternancePlant}'&$orderby=EquipId&$expand=SerialNumber`;
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';
    var regex = /[A-Za-z]/;

    if (regex.test(searchString)) {
        // let searchByProperties = ['EquipId', 'EquipDesc'];
        // ModifyListViewSearchCriteria(context, 'Equipments', searchByProperties);

        // searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
        return `substringof('${searchString}',EquipDesc)`;
    }
    else {
        return `EquipId eq '${searchString}'`;
    }
}