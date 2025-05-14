import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDetailsOnReturning(context) {
    if (libCom.getStateVariable(context, 'RedrawPIItems')) {
        libCom.removeStateVariable(context, 'RedrawPIItems');
        context.evaluateTargetPathForAPI('#Page:PhysicalInventoryItemsListPage').getControl('SectionedTable').getSection('SectionObjectTable0').redraw(true);
    }
}

