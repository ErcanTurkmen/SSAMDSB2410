import CommonLibrary from '../Common/Library/CommonLibrary';
import IsServiceReportFeatureEnabled from './IsServiceReportFeatureEnabled';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function IsPDFAllowedForOrder(clientAPI) {
    return IsServiceReportFeatureEnabled(clientAPI) && CommonLibrary.getWorkOrderAssnTypeLevel(clientAPI) === 'Header' && !libWO.isWorkOrderInCreatedState(clientAPI);
}
