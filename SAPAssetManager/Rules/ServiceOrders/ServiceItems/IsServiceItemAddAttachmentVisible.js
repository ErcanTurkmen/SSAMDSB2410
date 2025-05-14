import IsServiceItemOrderNotCompleted from './IsServiceItemOrderNotCompleted';
import DocumentsIsVisible from '../../Documents/DocumentsIsVisible';

export default function IsServiceItemAddAttachmentVisible(context) {
    let documentsIsVisible = DocumentsIsVisible(context);
    return IsServiceItemOrderNotCompleted(context).then((isNotCompleted) => {
        return isNotCompleted && documentsIsVisible;
    });
}
