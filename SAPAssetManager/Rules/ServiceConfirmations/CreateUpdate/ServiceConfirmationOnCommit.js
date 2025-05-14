import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';
import GetIsFinalServiceConfirmation from './Data/GetIsFinalServiceConfirmation';
import GetServiceItemCategory1 from '../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory1';
import GetServiceItemCategory2 from '../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory2';
import GetServiceItemCategory3 from '../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory3';
import GetServiceItemCategory4 from '../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory4';
import ServiceConfirmationItemCreateNav from './ServiceConfirmationItemCreateNav';
import GetConfirmationObjectType from './Data/GetConfirmationObjectType';
import DocumentLibrary from '../../Documents/DocumentLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import GetLastCategorySchemaPropertyValue from '../../ServiceItems/CreateUpdate/Data/GetLastCategorySchemaPropertyValue';

export default function ServiceConfirmationOnCommit(context) {
    CommonLibrary.setStateVariable(context, 'LocalId', '');
    
    return Promise.all([
        ServiceConfirmationLibrary.getConfirmationProcessType(context),
        GetLastCategorySchemaPropertyValue(context),
    ]).then(results => {
        let type = results[0];
        let categorySchema = results[1];

        ServiceConfirmationLibrary.getInstance().storeConfirmationFilledValues({
            'Description': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'DescriptionNote')),
            'Category1': GetServiceItemCategory1(context),
            'Category2': GetServiceItemCategory2(context),
            'Category3': GetServiceItemCategory3(context),
            'Category4': GetServiceItemCategory4(context),
            'ObjectType': GetConfirmationObjectType(context),
            'ProcessType': type,
            'FinalConfirmation': GetIsFinalServiceConfirmation(context),
            'Status': '',
            'CreatedBy': CommonLibrary.getSapUserName(context),
            'SchemaID': categorySchema.SchemaID,
            'CategoryID': categorySchema.CategoryID,
            'SubjectProfile': categorySchema.SubjectProfile,
            'CatalogType': categorySchema.CodeCatalog,
            'CodeGroup': categorySchema.CodeGroup,
            'Code': categorySchema.Code,
        });

        if (CommonLibrary.IsOnCreate(context)) {
            ServiceConfirmationLibrary.getInstance().storeComponentRelatedObjectIds({
                'Product': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ProductIdLstPkr')),
                'FunctionalLocation': CommonLibrary.getControlProxy(context, 'FuncLocHierarchyExtensionControl').getValue(),
                'Equipment': CommonLibrary.getControlProxy(context, 'EquipHierarchyExtensionControl').getValue(),
                'ServiceOrder': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceOrderLstPkr')),
                'Note': CommonLibrary.getControlProxy(context, 'LongTextNote').getValue(),
                'NoteType': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceNoteTypesListPicker')),
                'AttachmentDescription': CommonLibrary.getControlProxy(context, 'AttachmentDescription').getValue() || '',
                'Attachments': CommonLibrary.getControlProxy(context, 'Attachment').getValue(),
                'AttachmentsCount': DocumentLibrary.validationAttachmentCount(context),
            });

            if (ServiceConfirmationLibrary.getInstance().getActionPage() === ServiceConfirmationLibrary.itemHocFlag) {
                return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceHocConfirmationItemCreateNav.action');
            } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
                return ServiceConfirmationItemCreateNav(context, context.binding);
            } else {
                return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationSelectItemNav.action');
            }
        } else {
            ServiceConfirmationLibrary.getInstance().storeComponentRelatedObjectIds({
                'Product': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ProductIdLstPkr')),
                'FunctionalLocation': CommonLibrary.getControlProxy(context, 'FuncLocHierarchyExtensionControl').getValue(),
                'Equipment': CommonLibrary.getControlProxy(context, 'EquipHierarchyExtensionControl').getValue(),
            });

            if (context.binding && context.binding.RefObjects_Nav) {
                let objects = S4ServiceLibrary.getRefObjects(context.binding.RefObjects_Nav);
                ServiceConfirmationLibrary.getInstance().storePrevComponentRelatedObjectIds(objects);
            }

            return ServiceConfirmationLibrary.getInstance().updateConfirmation(context).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action').then(() => {
                    CommonLibrary.setOnCreateUpdateFlag(context, '');
                    return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationSuccessfullyUpdatedMessage.action');
                });
            });
        }
    });
}
