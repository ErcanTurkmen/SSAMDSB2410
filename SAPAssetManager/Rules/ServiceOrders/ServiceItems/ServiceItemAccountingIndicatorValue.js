import libCom from '../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemAccountingIndicatorValue(context) {
    let binding = context.getBindingObject();

    if (libCom.isDefined(binding.AccountingInd)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `AcctIndicators('${binding.AccountingInd}')`, ['AcctIndicatorDesc'], '').then(result => {
            if (result.length) {
                let indicatorData = result.getItem(0);
                return `${binding.AccountingInd} - ${indicatorData.AcctIndicatorDesc}`;
            }
            return ValueIfExists(binding.AccountingInd);
        });
    }

    return Promise.resolve(ValueIfExists(binding.AccountingInd));
}
