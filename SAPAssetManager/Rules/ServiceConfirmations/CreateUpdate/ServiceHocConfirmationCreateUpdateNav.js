import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function ServiceHocConfirmationCreateUpdateNav(context) {
    ServiceConfirmationLibrary.getInstance().resetAllFlags();
    ServiceConfirmationLibrary.getInstance().setActionPageFlag(ServiceConfirmationLibrary.itemHocFlag);
    return ServiceConfirmationLibrary.getInstance().openStartPage(context);
}
