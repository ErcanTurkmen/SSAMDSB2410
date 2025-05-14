import libSuper from '../Supervisor/SupervisorLibrary';
import personalLib from '../Persona/PersonaLibrary';

export default function SideDrawerHeadLine(context) {
    const activePersonaCode = personalLib.getActivePersonaCode(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], `$filter=PersonaCode eq '${activePersonaCode}'`).then(function(persona) {
        if (persona.getItem(0).PersonaCode === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTPersonaName.global').getValue()) {
            if (libSuper.isSupervisorFeatureEnabled(context)) {
                return libSuper.isUserSupervisor(context).then(isSupervisor => {
                    if (isSupervisor) {
                        return context.localizeText('supervisor');
                    }
                    return persona.getItem(0).PersonaCodeDesc;
                });
            }
        } 
        return persona.getItem(0).PersonaCodeDesc;
    }).catch(() => {
        return Promise.resolve('');
    });
}
