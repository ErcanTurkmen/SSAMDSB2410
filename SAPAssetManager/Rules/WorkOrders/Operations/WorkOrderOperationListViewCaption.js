import libCommon from '../../Common/Library/CommonLibrary';
import OperationsToSelectCount from './OperationsToSelectCount';
import Logger from '../../Log/Logger';

export default function WorkOrderOperationListViewCaption(context) {

    let caption = context.getClientData();
 
    //If you can't find the PageCaption stored in the clientdata, then use default
    if (context.getPageProxy().getControl('SectionedTable') && context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
      let selectedOperations = libCommon.getStateVariable(context, 'selectedOperations') || [];
      return OperationsToSelectCount(context).then(res => {
        if (res > 0) {
          return context.localizeText('select_operations_x_x', [selectedOperations.length, res]);
        } else {
          return context.localizeText('operations');
        }
      }).catch((error) => {
        Logger.error(error);
        return context.localizeText('operations');
      });
    } else if (!caption || !caption.PageCaption) {
      return context.localizeText('operations');
    } else {
      return caption.PageCaption;
    }
}
