import libPart from '../../PartLibrary';

export default function PartReturnEnable(context) {
    const binding = context.getPageProxy().getActionBinding() || context.binding;
    return libPart.getLocalQuantityIssued(context, binding).then(localQty => {
        return (binding.WithdrawnQuantity + localQty) > 0;
    });
}
