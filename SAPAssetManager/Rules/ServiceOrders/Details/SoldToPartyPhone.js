import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function SoldToPartyPhone(context) {
    let phone = '';

    if (context.binding && context.binding.Address_Nav && context.binding.Address_Nav.AddressCommunication) {
        let communicationObject = context.binding.Address_Nav.AddressCommunication[0];
        let extension = communicationObject.TelExtension;
        let telephoneLong = communicationObject.TelNumberLong;

        if (!ValidationLibrary.evalIsEmpty(extension)) {
            let ext_idx = telephoneLong.length - extension.length;
            if (ext_idx > 0) {
                phone = telephoneLong.substring(0, ext_idx);
                phone = context.localizeText('telephone_w_ext', [phone, extension]);
            }
        } else {
            phone = telephoneLong;
        }

    }

    return phone;
}
