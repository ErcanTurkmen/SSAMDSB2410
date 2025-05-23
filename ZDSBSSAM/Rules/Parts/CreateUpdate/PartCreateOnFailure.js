
export default function PartCreateOnFailure(context) {

    let result = context.getActionResult('partCreate').error;
    context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
}
