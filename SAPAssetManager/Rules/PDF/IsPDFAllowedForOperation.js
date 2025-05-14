import CommonLibrary from '../Common/Library/CommonLibrary';
import IsServiceReportFeatureEnabled from './IsServiceReportFeatureEnabled';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function IsPDFAllowedForOperation(clientAPI) {
    return IsServiceReportFeatureEnabled(clientAPI) && CommonLibrary.getWorkOrderAssnTypeLevel(clientAPI) === 'Operation' && !libWO.isWorkOrderInCreatedState(clientAPI);
}
