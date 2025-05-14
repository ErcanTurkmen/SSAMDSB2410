import IsClassicLayoutEnabled from '../Common/IsClassicLayoutEnabled';
import EnableAttachmentCreate from '../UserAuthorizations/Attachments/EnableAttachmentCreate';

export default function DocumentsSectionAddNewVisible(context) {
    return !IsClassicLayoutEnabled(context) && EnableAttachmentCreate(context);
}
