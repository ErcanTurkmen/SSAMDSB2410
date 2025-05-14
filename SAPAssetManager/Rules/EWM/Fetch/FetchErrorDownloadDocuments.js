/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import { DocumentTypes } from '../Common/EWMLibrary';
export default function FetchErrorDownloadDocuments(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], '')
        .then(errors => {
            if (libVal.evalIsEmpty(errors)) {
                return context.executeAction('/SAPAssetManager/Actions/EWM/Fetch/FetchUploadDocuments.action');
            }
            libCom.setStateVariable(context, 'DownloadEWMDocsStarted', false);
            const warehouseOrderErrors = errors.filter(error => error.RequestURL === 'WarehouseOrders');
            const promises = warehouseOrderErrors.map(error => {
                const entityData = JSON.parse(error.RequestBody); // Assuming RequestBody is a JSON string that needs parsing.                 
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action',
                    'Properties': {
                        'Target': {
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'EntitySet': 'OnDemandObjects',
                            'QueryOptions': `$filter=ObjectId eq '${entityData.WarehouseNo}${entityData.WarehouseOrder}' and ObjectType eq '${DocumentTypes.WarehouseOrder}' and Action eq 'I'`,
                        },
                    },
                });
            });
            return Promise.all(promises)
                .finally(() => context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action'));
        });
    }
