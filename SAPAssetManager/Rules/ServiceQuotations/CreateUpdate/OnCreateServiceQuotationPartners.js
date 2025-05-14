import S4ServiceQuotationControlsLibrary from '../../ServiceOrders/S4ServiceQuotationControlsLibrary';
import ServiceOrderObjectType from '../../ServiceOrders/ServiceOrderObjectType';
import GetServiceQuotationLocalID from '../Items/CreateUpdate/Data/GetServiceQuotationLocalID';

export default function OnCreateServiceQuotationPartners(context) {
    const promises = [];

    const soldToParty = S4ServiceQuotationControlsLibrary.getSoldToParty(context);
    const soldToPartyType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/SoldToPartyType.global').getValue();
    if (soldToParty) {
        promises.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceOrders/S4ServiceOrderPartnerCreate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'S4ServiceQuotationPartners',
                },
                'Properties': {
                    'ObjectID': GetServiceQuotationLocalID(context),
                    'ObjectType': ServiceOrderObjectType(context),
                    'BusinessPartnerID': soldToParty,
                    'PartnerFunction': soldToPartyType,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceQuotation_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceQuotations',
                            'ReadLink': 'pending_1',
                        },
                    },
                ],
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': '/SAPAssetManager/Rules/ServiceQuotations/CreateUpdate/ServiceQuotationLocalID.js',
                },
            },
        }));
    }

    const billToParty = S4ServiceQuotationControlsLibrary.getBillToParty(context);
    const billToPartyType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/BillToPartyType.global').getValue();
    if (billToParty) {
        promises.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceOrders/S4ServiceOrderPartnerCreate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'S4ServiceQuotationPartners',
                },
                'Properties': {
                    'ObjectID': GetServiceQuotationLocalID(context),
                    'ObjectType': ServiceOrderObjectType(context),
                    'BusinessPartnerID': billToParty,
                    'PartnerFunction': billToPartyType,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceQuotation_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceQuotations',
                            'ReadLink': 'pending_1',
                        },
                    },
                ],
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': '/SAPAssetManager/Rules/ServiceQuotations/CreateUpdate/ServiceQuotationLocalID.js',
                },
            },
        }));
    }

    return Promise.all(promises);
}
