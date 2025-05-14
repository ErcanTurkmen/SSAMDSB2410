import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import CloseRecordResultsOnSuccess from '../Operations/InspectionPoints/CloseRecordResultsOnSuccess';
/**
* Function to fix the queue of UD posted to backend
* Must post all RR before any UD
* @param {context} context
*/
export default function InspectionLotSetUsageDecisionNav(context) {
    let array = [];
    let binding = context.binding;
    let pageName = libCom.getStateVariable(context, 'FDCPreviousPage');
    try {
        let actionBinding = context.evaluateTargetPathForAPI('#Page:' + pageName).getClientData().ActionBinding;
        if (actionBinding) {
            binding = actionBinding;
        }
    } catch (error) {
        //exception when the pageName does not exists
        Logger.error('pageName does not exists ' + error);
    }
    context.showActivityIndicator('');
    //Count local UsageDecisions
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionLots', [], '$filter=sap.islocal()&$expand=InspectionCode_Nav,InspValuation_Nav,InspectionLotDocument_Nav').then(function(result) {
        if (result.length > 0) {
            //delete all local UD and remake them
            for (let k = 0; k < result.length; k++) {
                //store local ud
                let localUD = result.getItem(k);
                array.push((function(localObject) {
                    let discardAction;
                    if (localObject['@sap.inErrorState']) {
                        discardAction = context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 'Properties': {
                            'Target': {
                                'EntitySet': 'ErrorArchive',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'QueryOptions': `$filter=RequestURL eq '${localObject['@odata.readLink'].replace(/'/g, '\'\'')}'`,
                            },
                        }});
                    } else {
                        discardAction = context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action', 'Properties': {
                            'Target': {
                                'EntitySet': 'InspectionLots',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'EditLink': localObject['@odata.editLink'],
                            },
                        }});
                    }
                    //delete local ud
                    return discardAction.then(()=> {
                    //re-create stored local ud
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsage.action', 'Properties': {
                            'Target': {
                                'EntitySet' : 'InspectionLots',
                                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': localObject['@odata.readLink'],
                            },
                            'Properties': {
                                'UDCatalog': localObject.UDCatalog,
                                'UDCode': localObject.UDCode,
                                'UDCodeGroup': localObject.UDCodeGroup,
                                'UDSelectedSet': localObject.UDSelectedSet,
                                'Plant': localObject.Plant,
                            },
                            'Headers': {
                                'OfflineOData.TransactionID': localObject.OrderId,
                            },
                            'UpdateLinks': [
                                {
                                    'Property': 'InspValuation_Nav',
                                    'Target': {
                                        'EntitySet': 'InspectionCatalogValuations',
                                        'ReadLink': localObject.InspValuation_Nav ? localObject.InspValuation_Nav['@odata.readLink']: '',
                                    },
                                },
                                {
                                    'Property': 'InspectionCode_Nav',
                                    'Target': {
                                        'EntitySet': 'InspectionCodes',
                                        'ReadLink': localObject.InspectionCode_Nav ? localObject.InspectionCode_Nav['@odata.readLink'] : '',
                                    },
                                },
                            ],
                            'OnSuccess': '',
                        }}).then(()=> {
                            let promises = [];
                            localObject.InspectionLotDocument_Nav.forEach(doc => {
                                promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', doc['@odata.readLink'] + '/Document', [], '').then(res => {
                                    const links = [
                                        context.createLinkSpecifierProxy('InspectionLot_Nav', 'InspectionLots', '', localObject['@odata.readLink']),
                                        context.createLinkSpecifierProxy('Document', 'Documents', '', res.getItem(0)['@odata.readLink']),
                                    ];
                                    return context.create('/SAPAssetManager/Services/AssetManager.service', 'InspectionLotDocuments', { ObjectKey: doc.ObjectKey }, links, { 'OfflineOData.RemoveAfterUpload': 'true' });
                                }));
                            });
                            return Promise.all(promises);
                        });
                    });
                })(localUD));
            }
            context.dismissActivityIndicator();
            return Promise.all(array).then(()=> {
                //continue with UD creation
                return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '').then(value => {
                    context.setActionBinding(value.getItem(0));
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageRequiredFields.action').then(() => {
                        return CloseRecordResultsOnSuccess(context);
                    });
                });
            });
        } else { //no local UD
            context.dismissActivityIndicator();
            context.setActionBinding(binding);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageRequiredFields.action').then(() => {
                return CloseRecordResultsOnSuccess(context);
            });
        }
    });
}
