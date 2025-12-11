import QueryBuilder from '../../../../../SAPAssetManager/Rules/Common/Query/QueryBuilder';
import PartIssueCreateUpdateValidation from './PartIssueCreateUpdateValidation';
import ResetValidationOnInput from '../../../../../SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput';
/**
* Validate form and delete previous local entries for the same part if exist so that backend receives only the last set of transaction
*/
export default function ZPartAdhocIssueCreateUpdateOnCommit(context) {
    ResetValidationOnInput(context);
    return PartIssueCreateUpdateValidation(context).then(result => {
        if (!result) {
            return false;
        }
        // Removed the deletion of local entries as was unable to add multiple adhoc issues.
        //return deletePreviousLocalEntriesIfExist(context).then(() => {
            return context.executeAction('/ZDSBSSAM/Actions/Parts/ZPartAdhocIssueCreateHeader.action');
        //});
    });
}

function deletePreviousLocalEntriesIfExist(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], materialDocQueryOptions(context)).then(docItems => {
        if (docItems && docItems.length > 0) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'MaterialDocItems',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': docItems.getItem(0)['@odata.readLink'],
                    },
                },
            }).then(() => {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Parts/PartIssueDeleteHeader.action',
                    'Properties': {
                        'Target': {
                            'EntitySet': 'MaterialDocuments',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'ReadLink': docItems.getItem(0).AssociatedMaterialDoc['@odata.readLink'],
                        },
                        'OnSuccess': '',
                        'OnFailure': '',
                    },
                });
            });
        } else {
            return Promise.resolve();
        }
    });
}

function materialDocQueryOptions(context) {
    let binding = context.binding;
    let queryBuilder = new QueryBuilder();
    let filterOpts = ['sap.islocal()'];

    if (binding.OrderId) {
        filterOpts.push(`OrderNumber eq '${binding.OrderId}'`);
    }

    if (binding.ItemNumber) {
        filterOpts.push(`ReservationItemNumber eq '${binding.ItemNumber}'`);
    }

    if (binding.RequirementNumber) {
        filterOpts.push(`ReservationNumber eq '${binding.RequirementNumber}'`);
    }

    if (binding.MaterialNum) {
        filterOpts.push(`Material eq '${binding.MaterialNum}'`);
    }

    queryBuilder.addAllFilters(filterOpts);
    queryBuilder.addExpandStatement('AssociatedMaterialDoc');

    return queryBuilder.build();
}
