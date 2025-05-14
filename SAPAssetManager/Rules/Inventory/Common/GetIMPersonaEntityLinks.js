import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import Logger from '../../Log/Logger';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

// TODO: make generic for all personas - tbd in 2310
// this function is puts all IM entity set into app settings if IM persona is available for user

export default async function GetIMPersonaEntityLinks(context) {
    const IMPersonaName = PersonaLibrary.getActivePersonaByCode(context, context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/IMPersonaName.global').getValue());
    const IMPersonaCode = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/IMPersonaName.global').getValue();
    const EWMPersonaName = PersonaLibrary.getActivePersonaByCode(context, context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/EWMPersonaName.global').getValue());
    const EWMPersonaCode = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/EWMPersonaName.global').getValue();
    const FLPersonaName = PersonaLibrary.getActivePersonaByCode(context, context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/FLPersonaName.global').getValue());
    const FLPersonaCode = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/FLPersonaName.global').getValue();

    if (PersonaLibrary.checkPersonaEnabled(context, IMPersonaCode)) {
        await SetApplicationSettings(context, IMPersonaName, IMPersonaCode);
    }
    if (PersonaLibrary.checkPersonaEnabled(context, EWMPersonaCode)) {
        await SetApplicationSettings(context, EWMPersonaName, EWMPersonaCode);
    }
    if (PersonaLibrary.checkPersonaEnabled(context, FLPersonaCode)) {
        await SetApplicationSettings(context, FLPersonaName, FLPersonaCode);
    }
    return true;
}

export async function SetApplicationSettings(context, PersonaName, PersonaCode) {
    const entityCountName = `${PersonaCode}EntityCount`;
    const entityName = `${PersonaCode}Entity`;
    try {
        // we don't adding AppFeature to the query as far as we need all IM related entity sets
        let query = `$filter=UserPersona eq '${PersonaName}'`;
        await ODataLibrary.initializeOnlineService(context);
        const entityLinks = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'PersonaFeatureEntityLinks', [], query);
        // remove duplicate entities, as we don't filter by AppFeature
        const uniqueEntitySets = [...new Set(entityLinks.map(val => val.Entity))];
        if (uniqueEntitySets && uniqueEntitySets.length > 0) {
            ApplicationSettings.remove(context, entityCountName);
            ApplicationSettings.setNumber(context, entityCountName, uniqueEntitySets.length);
            uniqueEntitySets.forEach((val, index) => {
                ApplicationSettings.remove(context, `${entityName}-${index}`);
                ApplicationSettings.setString(context, `${entityName}-${index}`, val);
            });
        }
        return true;
    } catch (error) {
        Logger.error(`Error occured while trying to get the ${PersonaCode} Feature Entity Links: ${error}`);
        context.getClientData().Error = error;
        return false;
    }
}
