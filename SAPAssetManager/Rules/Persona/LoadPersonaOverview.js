import libPersona from './PersonaLibrary';
import Logger from '../Log/Logger';

/**
 *
 * @param {*} context
 * @param {*} allowSkip - Should the navigate be skipped if the existing page matches the new page name?
 * @returns
 */
export default function LoadPersonaOverview(context, allowSkip = false, personaName = libPersona.getActivePersona(context)) {
    if (libPersona.isMaintenanceTechnicianStd(context)) {
        return setPersonaMenuItem(context, 'OverviewMTStd', allowSkip);
    } else if (libPersona.isMaintenanceTechnician(context) &&
            (context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewMT') || 
                context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewClassicMT'))) {
        return setPersonaMenuItem(context, !libPersona.isClassicHomeScreenEnabled(context) ? 'OverviewMT' : 'OverviewClassicMT', allowSkip);
    } else if (libPersona.isInventoryClerk(context) && 
            context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewIC')) {
        return setPersonaMenuItem(context, 'OverviewIC', allowSkip);
    } else if (libPersona.isExtendedWarehouseClerk(context) && 
            context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewEWM')) {
        return setPersonaMenuItem(context, 'OverviewEWM', allowSkip);
    } else if (libPersona.isEnableFieldLogisticsOperator(context) && 
            context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewFL')) {
        return setPersonaMenuItem(context, 'OverviewFL', allowSkip);
    } else if (libPersona.isFieldServiceTechnician(context) && 
            (context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewST') || 
                context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewClassicST'))) {
        return setPersonaMenuItem(context, !libPersona.isClassicHomeScreenEnabled(context) ? 'OverviewST' : 'OverviewClassicST', allowSkip);
    } else if (libPersona.isWCMOperator(context) && 
            context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewWCM')) {
        return setPersonaMenuItem(context, 'OverviewWCM', allowSkip);
    } else if (libPersona.isCustomPersona(context) && 
            context.getGlobalSideDrawerControlProxy().getMenuItem('OverviewCustom')) {
        return setPersonaMenuItem(context, 'OverviewCustom', allowSkip);
    } else {
        Logger.error('Persona', 'Invalid persona: ' + personaName + ', cannot load persona based overview page');
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/User/HomePageMissingMessage.action',
            'Properties' : {
                'Message': context.localizeText('home_page_missing_for_the_selected_persona_x', [personaName]),
            },
        }).then(() => {
            return setPersonaMenuItem(context, 'OverviewBlank', allowSkip);
        });
    }
}

/**
 *
 * @param {*} context
 * @param {*} itemName
 * @param {*} allowSkip
 * @returns
 */
function setPersonaMenuItem(context, itemName, allowSkip) {
    let sleepTime = 750;
    let navigate = true;

    Logger.info('Start redraw for ' + itemName);
    return context.getGlobalSideDrawerControlProxy().redraw().then(() => {
        return sleep(sleepTime).then(() => {
            if (allowSkip && context.getGlobalSideDrawerControlProxy().getSelectedMenuItemName() === itemName) {
                navigate = false;
            }
            if (navigate) {
                context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName(itemName);
            }
            return sleep(sleepTime).then(() => {
                Logger.info('Done redraw for ' + itemName);
                return Promise.resolve();
            });
        });
    });
}

function sleep(ms) {
    return (new Promise((resolve) => {
        Logger.info('Sleeping for ' + ms);
        setTimeout(function() {
            Logger.info('Done sleeping for ' + ms);
            resolve();
        }, ms);
    }));
}
