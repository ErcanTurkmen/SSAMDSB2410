
export default function SoldToPartyEmail(context) {
    let email = '';

    if (context.binding && context.binding.Address_Nav && context.binding.Address_Nav.AddressCommunication) {
        let communicationObject = context.binding.Address_Nav.AddressCommunication[0];
        email = communicationObject.EMail;
    }

    return email;
}
