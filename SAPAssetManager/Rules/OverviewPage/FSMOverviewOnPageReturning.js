import IsAndroid from '../Common/IsAndroid';
import libPersona from '../Persona/PersonaLibrary';
import QABRedrawExtension from '../QAB/QABRedrawExtension';
import AnalyticsManager from '../AnalyticsManager/AnalyticsManagerLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function FSMOverviewOnPageReturning(context) {
    if (!libCommon.isApplicationLaunch(context)) {
        Logger.debug('FSMOverviewOnPageReturning', 'App Launch is not complete, skipping app launch analytics');
        return;
    }
    if (libPersona.isFieldServiceTechnician(context)) {
        let sectionedTable = context.getControls()[0];
        let mapSection = sectionedTable.getSection('MapExtensionSection');

        if (mapSection && mapSection.getVisible() !== false) {
            let mapViewExtension = mapSection.getExtension();
            if (IsAndroid(context)) {
                mapSection.redraw(true);
            } else {
                mapViewExtension.update();
            }
        }

        let s4MapSection = sectionedTable.getSection('S4MapExtensionSection');
        if (s4MapSection && s4MapSection.getVisible() !== false) {
            let mapViewExtension = s4MapSection.getExtension();
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

        if (libPersona.isFieldServiceTechnicianPro(context)) {
            //trigger analytics event for FST Pro Return to Overview Page
            AnalyticsManager.fieldServiceTechnicaionProReturnOverview();
            return;
        }

        //trigger analytics event for FST Return to Overview Page
        AnalyticsManager.fieldServiceTechnicaionReturnOverview();
    }
}
