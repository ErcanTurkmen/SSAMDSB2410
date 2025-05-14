import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function OnCreateServiceQuotationItemNote(context) {
    let note = CommonLibrary.getControlProxy(context, 'LongTextNote').getValue();
	if (note) {
		return context.executeAction('/SAPAssetManager/Actions/ServiceQuotations/Items/ServiceQuotationItemNoteCreate.action');
	} else {
		return Promise.resolve();
	}
}
