import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function EquipCategory(context) {
    if (!CommonLibrary.IsOnCreate(context) && context.binding && !context.binding?.['@sap.isLocal']) {
        return context.binding.EquipCategory;
    }

    return CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'CategoryLstPkr')) || '';
}
