import { WorkOrderLibrary as libWO } from './WorkOrderLibrary';

export default function WorkOrdersCount(sectionProxy, queryOption = '') {
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(sectionProxy, queryOption)).then((count) => {
        return count;
    });
}
