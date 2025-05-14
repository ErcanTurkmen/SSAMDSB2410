import PartIssueLineItemLocalID from './Issue/LineItem/PartIssueLineItemLocalID';
import GenerateLocalID from '../Common/GenerateLocalID';
import libCom from '../Common/Library/CommonLibrary';

export default async function PartsIssueEDTSave(context) {
    const edtControl = context.getPageProxy()._page.controls[0];
    if (edtControl) {
        const inPartsSet = new Set(libCom.getStateVariable(context, 'InPartsList'));
        for (const row of edtControl.getAllValues()) {
            if (!inPartsSet.has(row.OdataBinding.MaterialNum)) {
                continue;
            }
            const partIssueLineItemLocalID = await PartIssueLineItemLocalID(context);
            const generateLocalID = await GenerateLocalID(context, 'MaterialDocuments', 'MaterialDocNumber', '0000000000', '', '');
            const materialDocumentsCreateAction = await context.executeAction({
                'Name': '/SAPAssetManager/Actions/Parts/PartsCreateHeaderScanAll.action',
                'Properties': {
                    'MaterialDocNumber': generateLocalID,
                },
                'Headers': {
                    'OfflineOData.TransactionID': generateLocalID,
                },
            });
            await context.executeAction({
                'Name': '/SAPAssetManager/Actions/Parts/PartsCreateItemScanAll.action',
                'Properties': {
                    'Properties': {
                        'MatDocItem':partIssueLineItemLocalID,
                        'OrderNumber': row.OdataBinding.OrderId,
                        'MovementType': libCom.getAppParam(context, 'WORKORDER', 'MovementType'),
                        'ReservationNumber': row.OdataBinding.RequirementNumber,
                        'ReservationItemNumber': row.OdataBinding.ItemNumber,
                        'Material': row.OdataBinding.MaterialNum,
                        'Plant': row.OdataBinding.Plant,
                        'StorageLocation': row.OdataBinding.StorageLocation,
                        'EntryQuantity': row.Properties.Quantity,
                        'EntryUOM': row.OdataBinding.UnitOfMeasure ? row.OdataBinding.UnitOfMeasure : '',
                        'AutoGenerateSerialNumbers': row.OdataBinding.SerialNoProfile ? 'X' : '',
                    },
                    'Headers': {
                        'OfflineOData.TransactionID': generateLocalID,
                    },
                    'CreateLinks': [{
                        'Property': 'AssociatedMaterialDoc',
                        'Target': {
                            'EntitySet': 'MaterialDocuments',
                            'ReadLink': JSON.parse(materialDocumentsCreateAction.data)['@odata.readLink'],
                        },
                    }],
                },
            });
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/Parts/PartsIssueSuccessClose.action');
}
