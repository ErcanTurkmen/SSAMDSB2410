import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function OnCreateServiceQuotationNote(context) {
    const note = CommonLibrary.getTargetPathValue(context, '#Page:ServiceQuotationCreateUpdatePage/#Control:LongTextNote/#Value');
    if (note) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Notes/NoteCreateDuringSOCreate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'S4ServiceQuotationLongTexts',
                },
                'Properties': {
                    'NewTextString': '#Page:ServiceQuotationCreateUpdatePage/#Control:LongTextNote/#Value',
                    'TextString': '#Page:ServiceQuotationCreateUpdatePage/#Control:LongTextNote/#Value',
                    'TextID': '#Page:ServiceQuotationCreateUpdatePage/#Control:ServiceNoteTypesListPicker/#SelectedValue',
                },
                'Headers': {
                    'OfflineOData.TransactionID': '/SAPAssetManager/Rules/ServiceQuotations/CreateUpdate/ServiceQuotationLocalID.js',
                },
                'CreateLinks': [
                    {
                        'Property': 'S4ServiceQuotation_QuotText_Nav',
                        'Target': {
                            'EntitySet': 'S4ServiceQuotations',
                            'ReadLink': 'pending_1',
                        },
                    },
                ],
            },
        });
    }

    return Promise.resolve();
}
