import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceOrderRefObjectsCreateUpdateOnCommit(clientAPI) {
    return S4ServiceLibrary.AddS4RefObjects(clientAPI).then(() => {
        return clientAPI.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
    });
}
