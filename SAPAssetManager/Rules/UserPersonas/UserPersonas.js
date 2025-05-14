import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function UserPersonas(context) {
    let personas = [];
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], '').then(function(userPersonasResults) {
        for (let i = 0; i < userPersonasResults.length; i++) {
            const displayValue = userPersonasResults.getItem(i).PersonaCodeDesc;
            const persona = userPersonasResults.getItem(i).UserPersona;
            personas.push({
                'DisplayValue': displayValue,
                'ReturnValue': persona,
            });
        }
        libCom.setStateVariable(context, 'UserPersonas', personas);
        libCom.setStateVariable(context, 'UserPersonasData', userPersonasResults);
        return personas;
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryUserPersona.global').getValue(),`UserPersonas(context) error: ${error}`);
        libCom.setStateVariable(context, 'UserPersonas', personas);
        return personas;
    });
}
