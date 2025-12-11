import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import DownloadFailed from '../../../../SAPAssetManager/Rules/OnlineSearch/Download/DownloadFailed';

export default function ZUnAssignToUser(context) {
    const pageProxy = context.getPageProxy();
    //const binding = pageProxy.getActionBinding();
    const binding = context.binding;
    const personnelNumber = libCom.getPersonnelNumber();
   
    context.setActionBinding({ ...binding, EmployeeTo: personnelNumber, EmployeeFrom: binding.AssignedTo, OrderId: binding.OrderId});

    return context.executeAction('/ZDSBSSAM/Actions/Supervisor/UnAssign/ZWorkOrderUnAssignOnline.action')
        .catch((error) => {
            Logger.error('UnAssignToUser', error);
            const sectionedTable = pageProxy.getControl('SectionedTable');
            if (sectionedTable) {
                sectionedTable.redraw();
            }
            return DownloadFailed(context);
        });
}
