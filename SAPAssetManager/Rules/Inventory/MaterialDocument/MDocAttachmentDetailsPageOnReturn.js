import RedrawDetailsHeader from '../Common/RedrawDetailsHeader';
import Logger from '../../Log/Logger';

export default function MDocAttachmentDetailsPageOnReturn(context) {
    try {
        context.getControl('SectionedTable').getSection('AttachmentSection').redraw(true);
    } catch (err) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryMaterialDocItems.global').getValue(), 'MDocAttachmentDetailsPageOnReturn(context)' + err);
    }
    return RedrawDetailsHeader(context);
}
