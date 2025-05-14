import IsAndroid from '../Common/IsAndroid';
import OnDateChanged from '../Common/OnDateChanged';
import libPersona from '../Persona/PersonaLibrary';
import QABRedrawExtension from '../QAB/QABRedrawExtension';
import AnalyticsManager from '../AnalyticsManager/AnalyticsManagerLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function OverviewMTOnPageReturning(context) {
    if (!libCommon.isApplicationLaunch(context)) {
        Logger.debug('FSMOverviewOnPageReturning', 'App Launch is not complete, skipping app launch analytics');
        return;
    }
    if (libPersona.isMaintenanceTechnician(context)) {
        // Refresh the map view
        let sectionedTable = context.getControls()[0];
        let mapSection = sectionedTable.getSection('MapExtensionSection');
        if (mapSection) {
            let mapViewExtension = mapSection.getExtension();
            if (IsAndroid(context)) {
                mapSection.redraw(true);
            } else {
                mapViewExtension.update();
            }
        }

        // Refresh the QAB
        let qabSection = sectionedTable.getSection('QuickActionBarExtensionSection');
        if (qabSection) {
            QABRedrawExtension(context);
        }

        // Refresh the High Prority Work Orders
        sectionedTable.getSection('MyNotificationSection').redraw();

        //Refresh the My Work Cards
        sectionedTable.getSection('ObjectCard').redraw(true);

        // Check to see if this date has changed
        let lastDateChange = context.getClientData().lastDateChange;
        let now = new Date();

        if (lastDateChange.getDate() !== now.getDate() && now > lastDateChange) {
            OnDateChanged(context);
        }

        //trigger analytics event for MT Return to Overview Page
        AnalyticsManager.maintenanceTechnicaionReturnOverview();
    } else if (libPersona.isMaintenanceTechnicianStd(context)) {
        //trigger analytics event for MT STD Return to Overview Page
        AnalyticsManager.maintenanceTechnicaionStdReturnOverview();
    }
}
