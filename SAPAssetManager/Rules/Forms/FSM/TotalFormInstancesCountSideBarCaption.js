import libCom from '../../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import isWindows from '../../Common/IsWindows';

export default function TotalFormInstancesCountSideBarCaption(context) {
    let s4 = IsS4ServiceIntegrationEnabled(context);
    let query;

    if (s4) {
        query = "$filter=S4ServiceOrderId ne ''";
    } else {
        query = "$filter=WorkOrder ne ''";
    }
    return libCom.getEntitySetCount(context, 'FSMFormInstances', query).then((result) => {
        return isWindows(context)? result : context.localizeText('smart_forms_x', [result]);
    });
}
