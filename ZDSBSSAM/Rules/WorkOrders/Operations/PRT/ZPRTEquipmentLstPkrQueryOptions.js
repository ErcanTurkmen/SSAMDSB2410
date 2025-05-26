import libEval from '../../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../../../../SAPAssetManager/Rules/SideDrawer/EnableMultipleTechnician';

export default function ZPRTEquipmentLstPkrQueryOptions(context) {
    try {
        let equipmentLstPkrQueryOptions = context.dataQueryBuilder();
        equipmentLstPkrQueryOptions.expand('SerialNumber');
        equipmentLstPkrQueryOptions.orderBy('EquipId');
        if (!context.searchString) {
            equipmentLstPkrQueryOptions.filter("(PRTFlag eq 'X')");
            return equipmentLstPkrQueryOptions
        }
        else {
            let baseQuery = "(PRTFlag eq 'X')";
            if (context.searchString) {
                let searchString = context.searchString.toLowerCase();
                let filters = [
                    `substringof('${searchString}', EquipId)`,
                    //`substringof('${searchString}', tolower(EquipDesc))`,
                ];
                filters = baseQuery + ' and (' + filters.join(' or ') + ')';
                equipmentLstPkrQueryOptions.filter(filters);
                //`(${filters.join(' or ') }) and PRTFlag eq 'X'`)

            }
            return equipmentLstPkrQueryOptions;
        }

    } catch (exc) {
        // If page is first loaded, attempts to get controls will fail
        return `$filter=PRTFlag eq 'X'&$orderby=EquipId&$expand=SerialNumber`;
    }
}

