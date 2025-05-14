import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetConfirmationObjectType from '../../ServiceConfirmations/CreateUpdate/Data/GetConfirmationObjectType';
import ServiceOrderObjectType from '../../ServiceOrders/ServiceOrderObjectType';

export default function CategoryQueryOptions(pageProxy, categoryLevel, categoryType) {
    let pageName = CommonLibrary.getPageName(pageProxy);
    switch (pageName) {
        case 'ServiceRequestCreateUpdatePage': {
            let catalogType;
            //SubjectCategory or ReasonCategory
            if (categoryType === 'SubjectCategory') {
                catalogType = CommonLibrary.getAppParam(pageProxy, 'CATALOGTYPE', 'S4ServiceRequestSubject');
            } else {
                catalogType = CommonLibrary.getAppParam(pageProxy, 'CATALOGTYPE', 'S4ServiceRequestReason');
            }

            return S4ServiceLibrary.getHeaderCategorySchemaGuid(pageProxy, 'SRVR', 'ServiceRequestCategory' + catalogType + 'SchemaGuid', catalogType).then(guid => {
                return `$orderby=CategoryID&$filter=CategoryLevel eq '${categoryLevel}' and SchemaGuid eq guid'${guid}'`;
            });
        }
        case 'ServiceQuotationCreateUpdatePage': 
        case 'ServiceOrderCreateUpdatePage': {
            let bindingProcessType = pageProxy.binding ? pageProxy.binding.ProcessType : '';
            let processType = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(pageProxy, 'ProcessTypeLstPkr')) || bindingProcessType;
            return S4ServiceLibrary.getHeaderCategorySchemaGuid(pageProxy, processType).then(guid => {
                return `$orderby=CategoryID&$filter=CategoryLevel eq '${categoryLevel}' and SchemaGuid eq guid'${guid}'`;
            });
        }
        case 'CreateUpdateServiceQuotationItem':
        case 'CreateUpdateServiceItemScreen': {
            let itemCategory = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(pageProxy, 'ItemCategoryLstPkr'));
            let objectType = ServiceOrderObjectType(pageProxy);
            let bindingProcessType = pageProxy.binding ? pageProxy.binding.ProcessType : '';
            const orderProcessType = CommonLibrary.getAppParam(pageProxy, 'S4SERVICEORDER', 'ProcessType');

            return S4ServiceLibrary.getItemCategorySchemaGuid(pageProxy, itemCategory, objectType, bindingProcessType || orderProcessType).then(guid => {
                return `$orderby=CategoryID&$filter=CategoryLevel eq '${categoryLevel}' and SchemaGuid eq guid'${guid}'`;
            });
        }
        case 'CreateUpdateServiceConfirmationScreen': {
            return S4ServiceLibrary.getHeaderCategorySchemaGuid(pageProxy, 'SRVC', 'ConfirmationCategorySchemaGuid').then(guid => {
                return `$orderby=CategoryID&$filter=CategoryLevel eq '${categoryLevel}' and SchemaGuid eq guid'${guid}'`;
            });
        }
        //confirmation item and ad-hoc confirmation screens
        default: {
            let itemCategory = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(pageProxy, 'ItemCategoryLstPkr'));
            let objectType = GetConfirmationObjectType(pageProxy);
        
            return S4ServiceLibrary.getItemCategorySchemaGuid(pageProxy, itemCategory, objectType, 'SRVC').then(guid => {
                return `$orderby=CategoryID&$filter=CategoryLevel eq '${categoryLevel}' and SchemaGuid eq guid'${guid}'`;
            });
        }
    }
}
