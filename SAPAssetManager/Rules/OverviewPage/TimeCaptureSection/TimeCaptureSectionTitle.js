import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import ConfirmationListViewCaption from '../../Confirmations/ListView/ConfirmationListViewCaption';

export default function TimeCaptureSectionTile(context) {
    return TimeCaptureTypeHelper(context, ConfirmationsTitle, TimeSheetsTitle, context.localizeText('time'));
}

function ConfirmationsTitle(context) {
    return ConfirmationListViewCaption(context);
}

function TimeSheetsTitle(context) {
    return context.localizeText('time_sheets');
}
