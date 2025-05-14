import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function InspectionLotDetailsOnPageReturning(context) {
    CommonLibrary.setStateVariable(context, 'InspectionCharacteristicsAttachments', []);
    context.getControl('SectionedTable').redraw();
}
