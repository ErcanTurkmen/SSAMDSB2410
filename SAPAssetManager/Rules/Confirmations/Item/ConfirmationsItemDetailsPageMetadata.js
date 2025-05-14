import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
import IsItemServiceItem from './IsItemServiceItem';

export default async function ConfirmationsItemDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Confirmations/Item/ConfirmationsItemDetails.page');

    if (IsItemServiceItem(clientAPI)) {
        return await ModifyKeyValueSection(clientAPI, page, 'ConfItemDetails');
    } else {
        return page;
    }
}
