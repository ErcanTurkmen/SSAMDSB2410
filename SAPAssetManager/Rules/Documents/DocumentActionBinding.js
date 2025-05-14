import CommonLibrary from '../Common/Library/CommonLibrary';
export default function DocumentActionBinding(pageProxy) {
    let actionBinding = pageProxy.getActionBinding();
    if (actionBinding) {
        return actionBinding;
    }
    if (CommonLibrary.getStateVariable(pageProxy, 'CSReportTemplate')) {
        return CommonLibrary.getStateVariable(pageProxy, 'CSReportTemplate'); 
    }
    if (CommonLibrary.getStateVariable(pageProxy, 'S4ReportTemplate')) {
        return CommonLibrary.getStateVariable(pageProxy, 'S4ReportTemplate'); 
    }
    if (CommonLibrary.getStateVariable(pageProxy, 'PMReportTemplate')) {
        return CommonLibrary.getStateVariable(pageProxy, 'PMReportTemplate'); 
    }
    if (!actionBinding || !actionBinding.Document ) {
        actionBinding = pageProxy.getPendingDownload('DocumentsListView') ;
    }
    if (!actionBinding || !actionBinding.Document ) {
        actionBinding = pageProxy.getPendingDownload('EquipmentDetailsPage');
    }
    if (!actionBinding || !actionBinding.Document ) {
        actionBinding = pageProxy.getPendingDownload('FunctionalLocationDetails');
    }
    if (!actionBinding || !actionBinding.Document) { 
        if (pageProxy.currentPage && pageProxy.currentPage.context) {
            actionBinding = pageProxy.currentPage.context.clientData.ReportTemplate;
        }
    }
    return actionBinding;
}
