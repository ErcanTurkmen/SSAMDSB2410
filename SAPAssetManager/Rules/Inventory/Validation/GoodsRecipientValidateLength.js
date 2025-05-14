import libCom from '../../Common/Library/CommonLibrary';

export default function ItemTextValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/GoodsRecipientFieldLength.global');
    //if value added, capture and default it to Signatory
    const value = context.getPageProxy().getControl('FormCellContainer').getControl('GoodsRecipientSimple').getValue();
    libCom.setStateVariable(context, 'SGoodsRecipient', value);
    const signatory = context.getPageProxy().getControl('FormCellContainer').getControl('Signatory');
    signatory.setValue(value);
    signatory.redraw();
    return value;
}
