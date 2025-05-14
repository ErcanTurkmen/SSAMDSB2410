import libVal from '../Common/Library/ValidationLibrary';

export default function QABRedrawExtension(context) {
    const clientData = context.getPageProxy().getClientData();

    if (!libVal.evalIsEmpty(clientData.QABSettingsInstance)) {
        clientData.QABSettingsInstance.redrawExtension();
    }
}
