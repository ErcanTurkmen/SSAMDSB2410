import libCom from '../../Common/Library/CommonLibrary';
import RefreshSoftInputModeConfig from '../Common/RefreshSoftInputModeConfig';

export default function PhysicalInventoryDetailsOnLoaded(context) {
    RefreshSoftInputModeConfig(context);
    //Save the current header readlink
    libCom.setStateVariable(context, 'PIHeaderReadlink', context.binding['@odata.readLink']);
    libCom.setStateVariable(context, 'PIDetailsScreenActiveTabCounted', false);
    libCom.setStateVariable(context, 'PhysicalInventoryLocalId', context.binding.PhysInvDoc);
    libCom.setStateVariable(context, 'PhysicalInventoryLocalFiscalYear', context.binding.FiscalYear);
    
    libCom.removeStateVariable(context, 'RedrawPIItems');
    libCom.removeStateVariable(context, 'RedrawPIItemsCounted');
}
