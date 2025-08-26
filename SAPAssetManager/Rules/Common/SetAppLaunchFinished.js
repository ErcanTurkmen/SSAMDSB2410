import ApplicationSettings from './Library/ApplicationSettings';
import AnalyticsManager from '../AnalyticsManager/AnalyticsManagerLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function SetAppLaunchFinished(context) {
    ApplicationSettings.setBoolean(context, 'onAppLaunch', false);
    if (!context.isDemoMode()) {
        return AnalyticsManager.init(context).then((result) => {
            if (result) {
                triggerLaunchEvents(context);
            }
        });
    }
}

function triggerLaunchEvents(context) {
    AnalyticsManager.systemLaunch(context);
    AnalyticsManager.appLaunch();

    let personaObject = {
        MT: AnalyticsManager.maintenanceTechnicaionAppLaunch,
        MTSTD: AnalyticsManager.maintenanceTechnicaionSTDAppLaunch,
        FSTPR: AnalyticsManager.fieldServiceTechnicaionProAppLaunch,
        FST: AnalyticsManager.fieldServiceTechnicaionAppLaunch,
        IC: AnalyticsManager.inventoryManagerAppLaunch,
        ST: AnalyticsManager.safetyTechnicaionAppLaunch,
    };

    let personaCode = libPersona.getActivePersonaCode(context);

    for (const persona in personaObject) {
        if (persona === personaCode) {
            personaObject[persona]();
        }
    }
}
