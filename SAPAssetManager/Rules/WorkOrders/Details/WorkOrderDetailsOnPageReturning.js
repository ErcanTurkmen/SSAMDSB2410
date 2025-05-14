import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import ProgressTrackerOnDataChanged from '../../TimelineControl/ProgressTrackerOnDataChanged';
import QABRedrawExtension from '../../QAB/QABRedrawExtension';
import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderDetailsOnPageReturning(context) {

    //No need to refresh screen if user was closing defense flight leg read only screen
    if (libCom.getStateVariable(context, 'ReturningFromFlightData')) {
        libCom.removeStateVariable(context, 'ReturningFromFlightData');
        return Promise.resolve();
    }

    QABRedrawExtension(context);

    const sectionedTableControl = context.getPageProxy().getControl('SectionedTable');

    // Redraw EDT section for new meter list section only
    const meterListUninstallSection = sectionedTableControl.getSection('meterListUninstallSection');
    meterListUninstallSection?.redraw();

    const operationsObjectCardCollectionSection = sectionedTableControl.getSection('OperationsObjectCardCollection');
    operationsObjectCardCollectionSection?.redraw(true);

    return ToolbarRefresh(context, false).then(() => {
        return ProgressTrackerOnDataChanged(context).then(() => {
            return context.redraw();
        });
    });
}
