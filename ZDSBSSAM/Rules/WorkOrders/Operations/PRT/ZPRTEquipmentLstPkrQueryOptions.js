import libEval from '../../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../../../../SAPAssetManager/Rules/SideDrawer/EnableMultipleTechnician';

export default function ZPRTEquipmentLstPkrQueryOptions(context) {
    try {
        // let pageName = libCom.getPageName(context);
        //     if (searchString) {
        //         filters.push(`substringof('${searchString.toLowerCase()}', tolower(EquipId))`);
        //         filters.push(`substringof('${searchString.toLowerCase()}', tolower(Equipment/EquipDesc))`);

        //         filter = `'(' + filters.join(' or ') + ') and PRTFlag eq 'X'`;
        //     }
        //     let plantValue = libCom.getUserDefaultPlant();
        //     let storageLoc = libCom.getUserDefaultStorageLocation();
        //     return `$orderby=MaterialNum&$expand=Material,MaterialPlant&$filter=${filter}StorageLocation eq '${storageLoc}' and Plant eq '${plantValue}'`;
        // }

        let equipmentLstPkrQueryOptions = context.dataQueryBuilder();
        equipmentLstPkrQueryOptions.expand('SerialNumber');
        equipmentLstPkrQueryOptions.orderBy('EquipId');
        let newFilterOpts = [`PRTFlag eq 'X'`];
        equipmentLstPkrQueryOptions.filter(newFilterOpts);

        if (context.searchString) {
            let searchString = context.searchString;
            let filters = [
                `substringof('${searchString.toLowerCase()}', tolower(EquipDesc))`,
                `substringof('${searchString.toLowerCase()}', tolower(EquipId))`
            ];
            //filters = `'(' + filters.join(' or ') + ') and PRTFlag eq 'X'`;
            equipmentLstPkrQueryOptions.filter(`(${filters.join(' or ') })`);
            //`(${filters.join(' or ') }) and PRTFlag eq 'X'`)

        }
        return equipmentLstPkrQueryOptions;

    } catch (exc) {
        // If page is first loaded, attempts to get controls will fail
        return `$filter=PRTFlag eq 'X'&$orderby=EquipId&$expand=SerialNumber`;
    }
}

