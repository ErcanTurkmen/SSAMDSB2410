
export default function PartCreateOnFailure(context) {

    let result = context.getActionResult('PRTCreate').error;
    context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
}
