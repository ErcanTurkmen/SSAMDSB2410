import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';

export default function ServiceItemDetailImage(context) {
    if (IsClassicLayoutEnabled(context)) return '';
    return '$(PLT, /SAPAssetManager/Images/DetailImages/ServiceItem.ios.png, /SAPAssetManager/Images/DetailImages/ServiceItem.android.png)';
}
