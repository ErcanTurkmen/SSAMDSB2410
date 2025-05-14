import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';

/**
* Description of the Signature File Name
* @param {IClientAPI} context
*/
export default async function SignatureOnCreateFileDescription(context) {
    let previousPageClientData = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData();

    if (previousPageClientData.isCustomerSignature) {
        return context.localizeText('customer_signature');
    } else {
        let isUserSupervisor = await SupervisorLibrary.isUserSupervisor(context);
        if (isUserSupervisor) {
            return context.localizeText('supervisor_signature');
        } else {
            return context.localizeText('technician_signature');
        }
    }
}
