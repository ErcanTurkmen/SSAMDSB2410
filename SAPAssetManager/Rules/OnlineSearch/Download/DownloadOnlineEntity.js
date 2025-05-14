import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import DownloadFailed from './DownloadFailed';

/**
* Perform the download of the selected entity
* @param {IClientAPI} context
*/
export default function DownloadOnlineEntity(context) {
    const pageProxy = context.getPageProxy();
    let binding = pageProxy.binding;
    if (!binding?.['@odata.readLink']) {
        binding = pageProxy.getActionBinding();
    }
    if (!libVal.evalIsEmpty(binding)) {
        const selectedTab = tabFields[binding['@odata.type']];

        const ObjectId = binding[selectedTab.id];
        const path = `/SAPAssetManager/Globals/OnlineSearch/${selectedTab.objectTypeField}.global`;
        const ObjectType = context.getGlobalDefinition(path).getValue();
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action',
            'Properties': {
                Properties: {
                    ObjectId,
                    ObjectType,
                    Action: 'I',
                },
                Headers: {
                    'OfflineOData.TransactionID': ObjectId,
                },
            },
        }).then(() => context.executeAction({
            'Name': '/SAPAssetManager/Actions/Inventory/Fetch/FetchUploadDocuments.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/OnlineSearch/Download/FetchDownloadEntity.js',
                'OnFailure': '',
            },
        })).catch((error) => {
            Logger.error('DownloadOnlineEntity', error);
            const sectionedTable = pageProxy.getControl('SectionedTable');
            if (sectionedTable) {
                sectionedTable.redraw();
            }
            return DownloadFailed(context);
        });
    }
    return Promise.resolve();
}

const tabFields = {
    '#sap_mobile.Equipment': {
        objectTypeField: 'EquipmentObjectType',
        id: 'EquipId',
    },
    '#sap_mobile.FunctionalLocation': {
        objectTypeField: 'FuncLocObjectType',
        id: 'FuncLocIdIntern',
    },
    '#sap_mobile.WorkOrderHeader': {
        objectTypeField: 'WorkOrderObjectType',
        id: 'OrderId',
    },
    '#sap_mobile.WorkOrderOperation': {
        objectTypeField: 'WorkOrderObjectType',
        id: 'OrderId',
    },
    '#sap_mobile.WorkOrderSubOperation': {
        objectTypeField: 'WorkOrderObjectType',
        id: 'OrderId',
    },
    '#sap_mobile.NotificationHeader': {
        objectTypeField: 'NotificationObjectType',
        id: 'NotificationNumber',
    },
};
