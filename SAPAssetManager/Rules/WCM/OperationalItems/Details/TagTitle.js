import OperationalItemMobileStatusTextOrEmpty from './OperationalItemMobileStatusTextOrEmpty';

export default function TagTitle(context) {
    return OperationalItemMobileStatusTextOrEmpty(context)
        .then(possibleEmptyString => possibleEmptyString ? [possibleEmptyString] : []);
}
