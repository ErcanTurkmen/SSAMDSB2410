import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function ServiceConfirmationCreate(context) {
    return ServiceConfirmationLibrary.getInstance().createConfirmation(context);
}
