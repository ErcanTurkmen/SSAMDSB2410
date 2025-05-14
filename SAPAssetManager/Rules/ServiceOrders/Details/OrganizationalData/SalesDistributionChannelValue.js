import libCom from '../../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function SalesDistributionChannelValue(context) {
    let distributionChannel = context.binding.DistributionChannel;
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem' && context.binding.S4ServiceOrder_Nav) {
        distributionChannel = context.binding.S4ServiceOrder_Nav.DistributionChannel; 
    }
  
    if (!libCom.isDefined(distributionChannel)) {
        return ValueIfExists('');
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'DistributionChannels', [], `$filter=DistributionChannelCode eq '${distributionChannel}'`).then((result) => {
        if (result.length) {
            return ValueIfExists(`${distributionChannel} ${result.getItem(0).DistributionChannelText}`); 
        }
        return ValueIfExists(distributionChannel);
    });
}
