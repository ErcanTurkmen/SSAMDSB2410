import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import DownloadFailed from './DownloadFailed';

export default function AssignToUser(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getActionBinding();
    const personnelNumber = libCom.getPersonnelNumber();
    context.setActionBinding({ ...binding, EmployeeTo: personnelNumber, EmployeeFrom: binding.AssignedTo, OperationNo: binding.OperationNo || '', SubOperationNo: binding.SubOperationNo || '' });

    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignOnline.action')
        .catch((error) => {
            Logger.error('AssignToUser', error);
            const sectionedTable = pageProxy.getControl('SectionedTable');
            if (sectionedTable) {
                sectionedTable.redraw();
            }
            return DownloadFailed(context);
        });
}
