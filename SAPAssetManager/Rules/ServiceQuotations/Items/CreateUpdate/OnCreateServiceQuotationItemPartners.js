import CommonLibrary from '../../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';
import S4ServiceQuotationControlsLibrary from '../../../ServiceOrders/S4ServiceQuotationControlsLibrary';
import ServiceOrderObjectType from '../../../ServiceOrders/ServiceOrderObjectType';
import GetServiceQuotationLocalID from './Data/GetServiceQuotationLocalID';

export default async function OnCreateServiceQuotationItemPartners(context) {
    const promises = [];
    const soldToPartyType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/SoldToPartyType.global').getValue();
    const billToPartyType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/BillToPartyType.global').getValue();
    const objectID = GetServiceQuotationLocalID(context);

    let soldToParty;
    let billToParty;
    if (S4ServiceLibrary.isOnSQChangeset(context)) {
        soldToParty = S4ServiceQuotationControlsLibrary.getSoldToParty(context);
        billToParty = S4ServiceQuotationControlsLibrary.getBillToParty(context);
    } else {
        const partners = await context.read('/SAPAssetManager/Services/AssetManager.service', `S4ServiceQuotations(ObjectID='${context.binding.ObjectID}',ObjectType='${context.binding.ObjectType}')/Partners_Nav`, [], `$filter=PartnerFunction eq '${soldToPartyType}' or PartnerFunction eq '${billToPartyType}'`);
        soldToParty = partners.find(partner => partner.PartnerFunction === soldToPartyType)?.BusinessPartnerID;
        billToParty = partners.find(partner => partner.PartnerFunction === billToPartyType)?.BusinessPartnerID;
    }

    if (soldToParty) {
        promises.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceOrders/S4ServiceOrderPartnerCreate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'S4ServiceQuotationPartners',
                },
                'Properties': {
                    'ItemNo': CommonLibrary.getStateVariable(context, 'lastLocalItemId'),
                    'ObjectID': objectID,
                    'ObjectType': ServiceOrderObjectType(context),
                    'BusinessPartnerID': soldToParty,
                    'PartnerFunction': soldToPartyType,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceQuotItem_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceQuotationItems',
                            'ReadLink': S4ServiceLibrary.isOnSQChangeset(context) ? 'pending_2' : 'pending_1',
                        },
                    },
                ],
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': objectID,
                },
            },
        }));
    }

    if (billToParty) {
        promises.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ServiceOrders/S4ServiceOrderPartnerCreate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'S4ServiceQuotationPartners',
                },
                'Properties': {
                    'ItemNo': CommonLibrary.getStateVariable(context, 'lastLocalItemId'),
                    'ObjectID': objectID,
                    'ObjectType': ServiceOrderObjectType(context),
                    'BusinessPartnerID': billToParty,
                    'PartnerFunction': billToPartyType,
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceQuotItem_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceQuotationItems',
                            'ReadLink': S4ServiceLibrary.isOnSQChangeset(context) ? 'pending_2' : 'pending_1',
                        },
                    },
                ],
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': 'true',
                    'OfflineOData.TransactionID': objectID,
                },
            },
        }));
    }

    return Promise.all(promises);
}
