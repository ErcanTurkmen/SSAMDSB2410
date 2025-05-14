import libCom from '../../../Common/Library/CommonLibrary';
import OnQuantityChange from './OnQuantityChange';
export default function SerialNumberDeleteFromSwipe(context) {
    let serialMap = libCom.getStateVariable(context, 'NewSerialMap');
    let target = context.getPageProxy().getActionBinding(); //Get the row to delete from the swipe action
    serialMap.delete(target.SerialNumber);
    OnQuantityChange(context);
    context.getPageProxy().getControl('SectionedTable').getSection('SerialNumbersObjectTable').redraw();
}
