import libCommon from '../Common/Library/CommonLibrary';

export default function MeterListDoneEnabled(context) {
    const selectedItems = libCommon.getStateVariable(context, 'selectedMeters');
    return !!selectedItems && !!selectedItems.length;
}
