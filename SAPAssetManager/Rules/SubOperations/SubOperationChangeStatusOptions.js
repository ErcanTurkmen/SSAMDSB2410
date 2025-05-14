import MobileStatusGeneratorWrapper from '../MobileStatus/MobileStatusGeneratorWrapper';

export default function SubOperationChangeStatusOptions(context, /** @type {MyWorkOrderSubOperation} */ subOperation, rereadStatus = false) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, subOperation, objectType);

    return StatusGeneratorWrapper.generateMobileStatusOptions(rereadStatus);
}
