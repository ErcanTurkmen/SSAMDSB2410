export default function MaintenancePlantForEquipment(controlProxy) {
    let pageProxy;

    try {
        pageProxy = controlProxy.getPageProxy();
    } catch (err) {
        controlProxy = controlProxy.binding.clientAPI;
        pageProxy = controlProxy.getPageProxy();
    }

    if (pageProxy) {
        const maintenancePlantValues = pageProxy.getControl('FormCellContainer').getControl('MaintenacePlantLstPkr').getValue();
        const maintenancePlantLstPkrValue = maintenancePlantValues && maintenancePlantValues.length ? maintenancePlantValues[0].ReturnValue : '';
    
        return maintenancePlantLstPkrValue || pageProxy.binding.MaintPlant || '';
    }
 
    return '';
}
