import LoadPersonaOverview from '../Persona/LoadPersonaOverview';
import libPersona from '../Persona/PersonaLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libLoc from '../LocationTracking/LocationTrackingLibrary';
import Logger from '../Log/Logger';
import CacheMobileStatusTexts from '../Common/CacheMobileStatusTexts';

export default function OverviewUserPersona(context) {
    try {
        let switchPersonaLstPkrControl;
        const dict = libCom.getControlDictionaryFromPage(context);

        if (dict && dict.SwitchPersonaLstPkr) {
            switchPersonaLstPkrControl = dict.SwitchPersonaLstPkr;

            const listPickerValue = switchPersonaLstPkrControl.getValue()[0].ReturnValue;
            if (libCom.getStateVariable(context, 'currentPersona', 'UserProfileSettings') !== listPickerValue) {
                libCom.removeStateVariable(context, 'currentPersona', 'UserProfileSettings');
                const userPersonas = libCom.getStateVariable(context, 'UserPersonasData');
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], `$filter=UserPersona eq '${listPickerValue}'`).then(function(persona) {
                    if (persona.getItem(0)) {
                        //Since the UserFeatures entity still does not have the PersonaCode, the code is relying on the active persona. So whenever chahing the persona, active persona needs to be set.
                        libPersona.setActivePersona(context, persona.getItem(0).UserPersona);
                        libPersona.setActivePersonaCode(context, persona.getItem(0).PersonaCode);
                        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action').then(() => {
                            let activityIndicatorId = context.showActivityIndicator(context.localizeText('switching_persona'));
                            libCom.resetAppState(context);
                            libCom.setStateVariable(context, 'UserPersonasData', userPersonas);
                            libPersona.setUpUserDefaultHomeScreen(context);
                            return LoadPersonaOverview(context, false, listPickerValue)
                                .then(() => CacheMobileStatusTexts(context))
                                .then(() => {
                                    context.dismissActivityIndicator(activityIndicatorId);
                                    // Reload the sectioned table on the persona overview
                                    let sectionedTable = getSectionedTableOnOverviewPage(context);

                                    if (libCom.isDefined(sectionedTable)) {
                                        sectionedTable.redraw();
                                    }
                                    // Reinitialize location tracking service
                                    return libLoc.initService(context);
                                });
                        });
                    }
                    return Promise.resolve('');
                }).catch(function(err) {
                    Logger.error(`Failed to read UserPersonas from offline OData: ${err}`);
                    context.dismissActivityIndicator();
                    return Promise.resolve('');
                });
            }
            libCom.removeStateVariable(context, 'currentPersona', 'UserProfileSettings');
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        }
    } catch (exception) {
        Logger.log(String(exception), 'Error');
        return undefined;
    }
}

export function getMapControlInOverViewPage(context) {
    let section = getSectionedTableOnOverviewPage(context);
    if (libCom.isDefined(section)) {
        const control = section.getSections().find(function(sec) {
            return libCom.isDefined(sec.getName()) && sec.getName().includes('MapExtensionSection');
        });
        return control;
    } else {
        return undefined;
    }
}

function getSectionedTableOnOverviewPage(context) {
    let overviewPageName = libPersona.getPersonaOverviewStateVariablePage(context);
    try {
        const overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
        if (overviewPage && overviewPage.getControls().length > 0) {
            return overviewPage.getControls()[0];
        } else {
            throw new Error();
        }
    } catch (err) {
        return undefined;
    }
}
