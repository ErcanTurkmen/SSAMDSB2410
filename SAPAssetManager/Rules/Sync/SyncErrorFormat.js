import errorVal from '../Common/Library/ErrorLibrary';

export default function SyncErrorFormat(context) {
    const section = context.getName();
    const property = context.getProperty();
    if (section === 'SyncErrorObjectTable') {
        switch (property) {
            case 'Title':
                return errorVal.getErrorMessage(context);
            case 'Subhead':
               return '';
            case 'Description':
                return '';
            default:
                break;
        }
    }

    return errorVal.getErrorMessage(context);
}
