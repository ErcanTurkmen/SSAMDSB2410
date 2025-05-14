import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function MetersReceivingPlantOnValueChange(context) {
    ResetValidationOnInput(context);
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');

    const receivingPlantControlValue = formCellContainer.getControl('ReceivingPlantLstPkr').getValue()[0].ReturnValue;
    const storageLocationControl = formCellContainer.getControl('StorageLocationLstPkr');

    let storageControlSpecifier = storageLocationControl.getTargetSpecifier();
    if (receivingPlantControlValue && receivingPlantControlValue !== '') {
        storageControlSpecifier.setQueryOptions(`$filter=Plant eq '${receivingPlantControlValue}'`);
        if (context.getVisible() !== false) storageLocationControl.setVisible(true);
    } else {
        storageLocationControl.setVisible(false);
        storageControlSpecifier.setQueryOptions('');
    }

    storageLocationControl.setTargetSpecifier(storageControlSpecifier);
}
