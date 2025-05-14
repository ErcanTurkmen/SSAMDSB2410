import libCom from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import Logger from '../../../Log/Logger';
import NotificationActivityGroupQuery from '../../Activity/NotificationActivityGroupQuery';
import NotificationTaskGroupQuery from '../../Task/NotificationTaskGroupQuery';
import NotificationItemActivityGroupQuery from '../Activity/Details/NotificationItemActivityGroupQuery';
import NotificationItemCauseGroupQuery from '../Cause/NotificationItemCauseGroupQuery';
import NotificationItemDamageGroupQuery from '../NotificationItemDamageGroupQuery';
import NotificationItemPartGroupQuery from '../NotificationItemPartGroupQuery';
import NotificationItemTaskGroupQuery from '../Task/NotificationItemTaskGroupQuery';

/**
* Describe this function...
* @param {IControlProxy} controlProxy
*/
export default function NotificationItemPartGroupPickerItems(controlProxy) {
    const pageProxy = controlProxy.getPageProxy();
    const { queryOptionsRule, catType } = getOptionsForControl(controlProxy);

    return queryOptionsRule(pageProxy).then(queryOptions => {
        const isAssignedToCatalogProfile = pageProxy.getClientData()[`IsAssignedToCatalogProfile[${catType}]`];
        const usePMCatalogCodes = libCom.isDefined(isAssignedToCatalogProfile) ? !isAssignedToCatalogProfile : false;
        let entitySet = 'PMCatalogProfiles';
        let displayValue = 'Description';
        const returnValue = 'CodeGroup';

        if (usePMCatalogCodes) {
            entitySet = 'PMCatalogCodes';
            displayValue = 'CodeGroupDesc';
        }

        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(catalogs => {
            if (ValidationLibrary.evalIsEmpty(catalogs)) {
                return [];
            }
            if (usePMCatalogCodes) {
                catalogs = [...new Map(catalogs.map(item => [item[returnValue], item])).values()];
            }
            
            //Using Array.map is faster than Array.from. This will have the noticeable performance improvement when the array is large in loading the NotificationCreateUpdate page.
            return  catalogs._array.map(item => ({
                ReturnValue: item[returnValue],
                DisplayValue: `${item[returnValue]} - ${item[displayValue]}` || '-',
            }));
        });
    }).catch(error => {
        Logger.error('NotificationItemPartGroupPickerItems', error);
        return [];
    });
}

function getOptionsForControl(controlProxy) {
    const controlName = controlProxy.getName();
    const pageName = libCom.getPageName(controlProxy);
    let queryOptionsRule = Promise.resolve();
    let catType;

    switch (pageName) {
        case 'NotificationActivityAddPage':
            queryOptionsRule = NotificationActivityGroupQuery;
            catType = 'CatTypeActivities';
            break;
        case 'NotificationItemActivityAddPage':
            queryOptionsRule = NotificationItemActivityGroupQuery;
            catType = 'CatTypeActivities';
            break;
        case 'NotificationTaskAddPage':
            queryOptionsRule = NotificationTaskGroupQuery;
            catType = 'CatTypeTasks';
            break;
        case 'NotificationItemTaskAddPage':
            queryOptionsRule = NotificationItemTaskGroupQuery;
            catType = 'CatTypeTasks';
            break;
        case 'NotificationItemCauseAddPage':
            queryOptionsRule = NotificationItemCauseGroupQuery;
            catType = 'CatTypeCauses';
            break;
        case 'NotificationUpdateMalfunctionEnd':
        case 'NotificationAddPage':
        case 'DefectCreateUpdatePage':
        case 'NotificationItemAddPage':
            if (controlName === 'PartGroupLstPkr') {
                queryOptionsRule = NotificationItemPartGroupQuery;
                catType = 'CatTypeObjectParts';
            } else if (controlName === 'DamageGroupLstPkr') {
                queryOptionsRule = NotificationItemDamageGroupQuery;
                catType = 'CatTypeDefects';
            } else if (controlName === 'CauseGroupLstPkr') {
                queryOptionsRule = NotificationItemCauseGroupQuery;
                catType = 'CatTypeCauses';
            }
            break;
        default:
            break;
    }

    return { queryOptionsRule, catType };
}
