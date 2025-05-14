import LabelButtonLibrary from '../../../../Extensions/LabelButtonModule/LabelButtonLibrary';
import libCom from '../../../Common/Library/CommonLibrary';

export default function BulkIssueOrReceiptOnSwitchValueChanged(itemSwitch) {
    const clientAPI= itemSwitch._control.getTable().context.clientAPI;

    let prevSelectedItems = libCom.getStateVariable(clientAPI,'BulkUpdateItem');
    const totalItems = libCom.getStateVariable(clientAPI,'BulkUpdateTotalItems');

    const itemsSelected = itemSwitch.getValue() ? (prevSelectedItems + 1) : (prevSelectedItems - 1);
    libCom.setStateVariable(clientAPI,'BulkUpdateItem', itemsSelected);

    const labelButtonControlContext = clientAPI.getPageProxy().getControls()[0]._control._sections[0]._extensions[0].context.clientAPI;
    const labelText = (itemsSelected === totalItems) ? labelButtonControlContext.localizeText('all_caption', [itemsSelected]) : labelButtonControlContext.localizeText('all_caption_double', [itemsSelected , totalItems]);
    LabelButtonLibrary.setLabelText(labelButtonControlContext, labelText);

    if (itemsSelected === 0 || itemsSelected === totalItems) {
        LabelButtonLibrary.toggleButton(labelButtonControlContext);
        const buttonText = LabelButtonLibrary.getButtonState(labelButtonControlContext) ? labelButtonControlContext.localizeText('deselect_all'): labelButtonControlContext.localizeText('select_all');    
        LabelButtonLibrary.setButtonTitle(labelButtonControlContext, buttonText);
    }
}
