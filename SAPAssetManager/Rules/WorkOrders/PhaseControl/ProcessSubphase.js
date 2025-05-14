import Logger from '../../Log/Logger';
import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ProcessSubphase(context) {
    let binding = context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], `$filter=Phase eq '${binding.ProcessPhase}' and Subphase eq '${binding.ProcessSubphase}' and EAMOverallStatusProfile eq '${binding.OvrlStsProfile}'`).then(result => {
        if (result.length) {
            return ValueIfExists(result.getItem(0).SubphaseDesc);
        } else {
            return '-';
        }
    }).catch((error) => {
        Logger.error('EAMOverallStatusConfigs', error);
        return '-';
    });
}
