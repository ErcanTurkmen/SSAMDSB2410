import MDKVersionInfo from '../UserProfile/MDKVersionInfo';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import PersonaLibrary from '../Persona/PersonaLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

const EMPTY_KEY = 'empty';

/**
* Updates App Information for cloud reporting metrics.
* Checks if App Info has changed or does not exist.
* Updates App Info if nonexistent or changed, then
* Does a fake entity update on UserGeneralInfos
* so a record is generated with updated app info in
* the header.
* @param {IClientAPI} context
*/
export default async function UpdateAppInformation(context) {
    const savedXappinfo = ApplicationSettings.getString(context, 'xappinfo');
    if (isHeaderComplete(savedXappinfo)) {
        return savedXappinfo.replaceAll(EMPTY_KEY, '');
    }

    const userSystemInfos = readUserSystemInfos(context);
    const appName = 'SAP Service and Asset Manager'; // This should be the hardcoded app name
    const appVersion = context.getVersionInfo()['Application Version'];
    const systemClientRole = getSystemClientRole(context, userSystemInfos);
    const backendVersion = getBackendVersion(context, userSystemInfos);
    const mdkVersion = MDKVersionInfo(context);
    const platform = (function() {
        if (context.nativescript?.platformModule?.isIOS) {
            return 'ios';
        } else if (context.nativescript?.platformModule?.isAndroid) {
            return 'android';
        } else if (context.nativescript?.applicationModule?.windows) {
            return 'windows';
        } else {
            return 'unknown';
        }
    })();

    let personas = getPersonas(context);
    let xappinfo = `name=${appName};version=${appVersion};backend-version=${backendVersion};persona=${personas.join()};mdk-version=${mdkVersion};platform=${platform};systemClientRole=${systemClientRole}`;
    ApplicationSettings.setString(context, 'xappinfo', xappinfo);
    return xappinfo.replaceAll(EMPTY_KEY, '');
}

function getPersonas(context) {
    let userpersonas = PersonaLibrary.getPersonas(context);
    let personas = [];
    for (const persona of userpersonas) {
        switch (persona) {
            case 'MAINTENANCE_TECHNICIAN_STD':
            case 'MAINTENANCE_TECHNICIAN':
            case 'FIELD_SERVICE_TECHNICIAN_PRO':
            case 'FIELD_SERVICE_TECHNICIAN':
            case 'SAFETY_TECHNICIAN':
            case 'INVENTORY_CLERK':
            case 'EXTERNAL_TECHNICIAN':
            case 'FIELD_LOGISTICS_OPERATOR':
            case 'WAREHOUSE_CLERK':
                personas.push(persona);
                break;
            default:
                personas.push('CUS_PERSONA');
                break;
        }
    }
    return personas;
}

function readUserSystemInfos(context) {
    const userSystemInfos = ApplicationSettings.getString(context, 'UserSystemInfos');
    if (!ValidationLibrary.evalIsEmpty(userSystemInfos)) {
        return JSON.parse(userSystemInfos);
    }
    return null;
}

/**
 * Gets backend version from UserSystemInfos. If in demo mode or backend version hasn't been found in UserSystemInfos,
 * returns string 'empty' so that we can distinguish from the use case when UserSystemInfos is not available yet.
 * String 'empty' will not be put into actual header value.
 * @param {IClientAPI} context 
 * @param {Array<UserSystemInfo>} userSystemInfos 
 */
function getBackendVersion(context, userSystemInfos) {
    if (context.isDemoMode()) {
        return EMPTY_KEY;
    }

    let version = ApplicationSettings.getString(context, 'BackendVersion');
    if (version) {
        return version;
    }

    const config = findConfig(userSystemInfos);

    if (config) {
        if (config.SystemSettingValue === EMPTY_KEY) {
            return EMPTY_KEY;
        }

        version = config.SystemSettingName + ' ' + config.SystemSettingValue;
        ApplicationSettings.setString(context, 'BackendVersion', version);
        return version;
    } else {
        return '';
    }
}

function findConfig(userSystemInfos) {
    const configNames = ['S4CORE', 'S4MERP', 'SMERP'];
    if (userSystemInfos?.length > 0) {
        let config = null;
        for (const name of configNames) {
            config = userSystemInfos.filter(item => item.SystemSettingName === name)?.[0];

            if (config) {
                return config;
            }
        }
        return {
            SystemSettingValue: EMPTY_KEY,
        };
    }
    return null;
}

/**
 * Gets SystemClientRole from UserSystemInfos. If the setting hasn't been found in UserSystemInfos,
 * returns string 'empty' so that we can distinguish from the use case when UserSystemInfos is not available yet.
 * String 'empty' will not be put into actual header value.
 * @param {IClientAPI} context 
 * @param {Array<UserSystemInfo>} userSystemInfos 
 */
function getSystemClientRole(context, userSystemInfos) {
    const systemClientRole = ApplicationSettings.getString(context, 'SystemClientRole');

    if (systemClientRole) {
        return systemClientRole;
    }

    if (userSystemInfos?.length > 0) {
        const settingName = context.getGlobalDefinition('/SAPAssetManager/Globals/SystemClientRoleSettingName.global').getValue();
        const setting = userSystemInfos.filter(sysInfo => sysInfo.SystemSettingName === settingName)?.[0];

        if (setting) {
            const settingValue = setting.SystemSettingValue;
            ApplicationSettings.setString(context, 'SystemClientRole', settingValue);
            return settingValue;
        }
        return EMPTY_KEY;
    }

    return '';
}

/**
 * Checks if header value is not empty and contains all info (backend version and client role that are read from online store)
 * @param {string} header header value that was saved to app settings after previous execution
 * Example string: 
 * 'name={name};version={version};backend-version={backend-version};persona={persona};mdk-version={mdk-version};platform={platform};systemClientRole={systemClientRole}'
 * @returns {boolean} is header value not empty and complete
 */
function isHeaderComplete(header) {
    if (ValidationLibrary.evalIsEmpty(header)) {
        return false;
    }

    const headerComponents = header.split(';');
    const backendVersion = headerComponents.find(component => component.includes('backend-version'));
    const systemClientRole = headerComponents.find(component => component.includes('systemClientRole'));

    if (!backendVersion || !systemClientRole) {
        return false;
    }

    return !!backendVersion.replace('backend-version=', '') && !!systemClientRole.replace('systemClientRole=', '');
}
