import { AcyclicNavigate } from '../../Common/AcyclicNavigate';

export default function OperationalItemDetailsNav(context) {
    return AcyclicNavigate(context, 'OperationalItemDetailsPage',
        '/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemDetailsNav.action',
        (prevBinding, currBinding) => prevBinding.WCMDocument === currBinding.WCMDocument && prevBinding.WCMDocumentItem === currBinding.WCMDocumentItem,
        2);
}
