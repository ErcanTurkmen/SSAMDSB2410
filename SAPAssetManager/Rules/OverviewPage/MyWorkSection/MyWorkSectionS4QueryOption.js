import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function MyWorkSectionS4QueryOption(context) {
    const defaultDates = libWO.getActualDates(context);
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    let orderBy;
    let expand;
    let top = '$top=50';
    let entitySet;
    let startedquery = `$filter=MobileStatus_Nav/MobileStatus eq '${STARTED}'`;
    CommonLibrary.setStateVariable(context, 'StartedCount', 0);
    if (IsServiceOrderLevel(context)) {
        entitySet = 'S4ServiceOrders';
        orderBy = '$orderby=MobileStatus_Nav/MobileStatus desc,Priority';
        expand = '$expand=MobileStatus_Nav,MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,Priority_Nav,RefObjects_Nav';
        return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, startedquery).then(results => {
            CommonLibrary.setStateVariable(context, 'StartedCount', results);
            CommonLibrary.setStateVariable(context, 'isAnyOrderStarted', results > 0);
            return S4ServiceLibrary.ordersDateStatusFilterQuery(context, [], defaultDates).then(filter => {
                filter = filter + '&' + orderBy + '&' + expand + '&' + top;
                return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
                    if (result) {
                        return result;
                    }
                    return [];
                }).catch(error => {
                    Logger.error(error);
                });
            });
        });
    } else {
        entitySet = 'S4ServiceItems';
        orderBy = '$orderby=MobileStatus_Nav/MobileStatus desc';
        expand = '$expand=S4ServiceOrder_Nav,ItemCategory_Nav,ServiceType_Nav,Product_Nav,MobileStatus_Nav,AccountingInd_Nav,TransHistories_Nav/S4ServiceContract_Nav,ServiceProfile_Nav,MobileStatus_Nav,MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,RefObjects_Nav';
        return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, startedquery).then(results => {
            CommonLibrary.setStateVariable(context, 'StartedCount', results);
            CommonLibrary.setStateVariable(context, 'IsAnyOperationStarted', results > 0);
            return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [], defaultDates).then(filter => {
                filter = filter + '&' + orderBy + '&' + expand + '&' + top;
                return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
                    if (result) {
                        return result;
                    }
                    return [];
                }).catch(error => {
                    Logger.error(error);
                });
            });
        });
    }
}
