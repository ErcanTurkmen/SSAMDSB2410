import libVal from '../../../Common/Library/ValidationLibrary';
import Logger from '../../../Log/Logger';

/**
* Create and resolve an array of promises to update changed service items
* @param {IClientAPI} context
* @param {*} updatedRows 
*/
export default function ServiceItemsEDTUpdate(context, updatedRows) {
    const updatePromises = [];

    if (!libVal.evalIsEmpty(updatedRows)) {
        updatedRows.forEach(row => {
            updatePromises.push(context.executeAction({
                'Name': '/SAPAssetManager/Actions/ServiceItems/ServiceItemUpdate.action',
                'Properties': {
                    'Properties': {
                        ...row.Properties,
                        ...(
                            row.Properties.HigherLvlItem ?
                                { HigherLvlItem: String(row.Properties.HigherLvlItem).padStart(10, '0') } :
                                {}
                        ),
                    },
                    'Target': {
                        'ReadLink': row.OdataBinding['@odata.readLink'],
                    },
                    'Headers': {
                        'OfflineOData.TransactionID': row.OdataBinding.ItemNo,
                    },
                    'OnFailure': '',
                },
            }));
        });

        return Promise.all(updatePromises)
            .then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemUpdateSuccessMessage.action');
                });            
            })
            .catch(error => {
                Logger.error('ServiceItemsEDTUpdate', error);
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
            });
    }

    return Promise.resolve();
}

