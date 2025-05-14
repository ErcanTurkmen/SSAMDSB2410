import { AcyclicNavigate } from '../Common/AcyclicNavigate';

export default function WorkPermitDetailsNav(context) {
    return AcyclicNavigate(context, 'WorkPermitDetails', '/SAPAssetManager/Actions/WCM/WorkPermitDetailsNav.action', (prevBinding, currBinding) => prevBinding.WCMApplication === currBinding.WCMApplication, 2);
}
