import MeterLibrary from '../Common/MeterLibrary';

export default function IsRevertButtonVisible(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    let isLocal = context?.binding?.Device_Nav ? context.binding.Device_Nav['@sap.isLocal'] : false;

    const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();
    return meterTransactionType === REMOVE_EDIT && isLocal;
}
