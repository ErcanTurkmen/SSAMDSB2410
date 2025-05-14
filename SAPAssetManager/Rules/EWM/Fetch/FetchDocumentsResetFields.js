import defaultDocTypes from './DefaultDocumentTypes';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function FetchDocumentsResetFields(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer') ;  
    const documentTypeListPicker = formCellContainer.getControl('DocumentTypeListPicker');
    const warehouseOrder = formCellContainer.getControl('WarehouseOrder');
    const queue = formCellContainer.getControl('QueueListPicker');
    const activityArea = formCellContainer.getControl('ActivityAreaListPicker');
    const processType = formCellContainer.getControl('ProcessTypeListPicker');
    const createdBy = formCellContainer.getControl('CreatedByListPicker');
    const leDeliveryNumber = formCellContainer.getControl('DeliveryNumber');
    const creationDateRangeSwitch = formCellContainer.getControl('CreationDateRangeSwitch');
    const creationStartDate = formCellContainer.getControl('CreationStartDate');
    const creationEndDate = formCellContainer.getControl('CreationEndDate');
    const dateRangeSwitch = formCellContainer.getControl('DateRangeSwitch');
    const startDate = formCellContainer.getControl('StartDate');
    const endDate = formCellContainer.getControl('EndDate');
    warehouseOrder.setValue('');
    documentTypeListPicker.setValue(defaultDocTypes(context));
    queue.setValue('');
    activityArea.setValue('');
    processType.setValue('');   
    createdBy.setValue('');
    leDeliveryNumber.setValue('');
    dateRangeSwitch.setValue(false);
    startDate.setValue(new Date());
    endDate.setValue(new Date());
    creationDateRangeSwitch.setValue(false);
    creationStartDate.setValue(new Date());
    creationEndDate.setValue(new Date());
    libCom.setStateVariable(context, 'DownloadEWMDocsStarted', false);
}
