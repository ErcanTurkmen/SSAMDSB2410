import LabelButtonLibrary from '../../../Extensions/LabelButtonModule/LabelButtonLibrary';
import libCom from '../../Common/Library/CommonLibrary';
/*
This function is to select or deselected all items in the page. 
Select or deselect is identified based on the button state and all the items are updated accordingly.
Also need to update the button and label text for next selection.
*/
export default function SelectDeselectAllBulkIssueOrReceiptItems(context) {
    let buttonState = LabelButtonLibrary.getButtonState(context);
    if (buttonState !== undefined) {
        let sections = context.getPageProxy().getControls()[0].getSections();
        const labelButtonTexts = getLabelAndButtonText(context, sections, buttonState);
        const labelText = labelButtonTexts.label;
        const buttonText = labelButtonTexts.button;
        libCom.setStateVariable(context,'BulkUpdateItem', labelButtonTexts.selectedItems);
        selectDeselectItemsHelper(context, sections, buttonState, buttonText, labelText);
    }
}

function selectDeselectItemsHelper(context, sections, value, buttonText, labelText) {
    LabelButtonLibrary.setButtonTitle(context, context.localizeText(buttonText));
    LabelButtonLibrary.setLabelText(context, labelText);
    for (let index = 2; index < sections.length; index += 2) {
        let switchCell = sections[index].getExtension().getCell(0, 0);
        switchCell.setValue(value);
    }   
}

function getLabelAndButtonText(context, sections, buttonState) {
    const itemcount = (sections.length - 1)/2;
    const [labelText, buttonText, selectedItems] = (buttonState) ? [context.localizeText('all_caption', [itemcount]), context.localizeText('deselect_all'), itemcount] : [context.localizeText('all_caption_double', [0 , itemcount]), context.localizeText('select_all'), 0];
    return {label: labelText, button: buttonText, selectedItems: selectedItems};
}
