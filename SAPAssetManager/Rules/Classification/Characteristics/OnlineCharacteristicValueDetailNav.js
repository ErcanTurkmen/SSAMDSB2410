import Logger from '../../Log/Logger';
import OnlineGetCharacteristicValues from './OnlineGetCharacteristicValues';

export default function OnlineCharacteristicValueDetailNav(context) {
    return OnlineGetCharacteristicValues(context).then(results => {
        if (results[0]) {
            let actionBinding = results[0];
            actionBinding.InternClassNum = context.binding.InternClassNum;
            context.getPageProxy().setActionBinding(actionBinding);
            return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/OnlineCharacteristicValueDetailNav.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/OnlineCharacteristicValueDetailNav.action');
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
    });
}
