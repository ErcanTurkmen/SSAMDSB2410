import libCom from '../Common/Library/CommonLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import CreateFromValueChanged from './CreateUpdate/FormCellHandlers/CreateFromValueChanged';

/**
 * Triggered when the create/edit page is loaded
 * @param {IPageProxy} pageClientAPI
 */
export default function equipmentCreateUpdateOnPageLoad(pageClientAPI) {
    if (!pageClientAPI.getClientData().LOADED) {
        let onCreate = libCom.IsOnCreate(pageClientAPI);

        setPageTitle(pageClientAPI, onCreate);

        if (ValidationLibrary.evalIsEmpty(pageClientAPI.binding)) {
            setDefaultValuesForUndefinedBinding(pageClientAPI);
        } else {
            setDefaultValues(pageClientAPI);
        }

        if (onCreate) {
            CreateFromValueChanged(pageClientAPI);
        } else {
            disableControlsOnEdit(pageClientAPI);
        }

        pageClientAPI.getClientData().LOADED = true;
    }
}

function disableControlsOnEdit(pageProxy) {
    libCom.getControlProxy(pageProxy, 'CreateFromLstPkr').setVisible(false);
    let isNotLocal = !libCom.isCurrentReadLinkLocal(pageProxy.binding['@odata.readLink']);
    if (isNotLocal) { //Allow editing of non-local equipment
        libCom.getControlProxy(pageProxy, 'CategoryLstPkr').setVisible(false);
        libCom.getControlProxy(pageProxy, 'TemplateLstPkr').setVisible(false);
    }

    if (pageProxy.binding.CopyEquipId) {
        libCom.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(true);
    }
}
/**
 * Set the default values of the page's control when the binding is undefined
 * @param  {IPageProxy} clientAPI
 */
function setDefaultValuesForUndefinedBinding(clientAPI) {
    const locationPicker = libCom.getControlProxy(clientAPI, 'LocationLstPkr');
    locationPicker.setEditable(false);
    libCom.getControlProxy(clientAPI, 'LocationLstPkr').setValue('');
}

/** 
 * set the default values of the page's control
 * @param {IPageProxy} pageProxy
 * 
 */
function setDefaultValues(pageProxy) {
    setControlValues(pageProxy);

    if (pageProxy.binding.ConstMonth && pageProxy.binding.ConstYear) {
        let date = new Date();
        date.setFullYear(pageProxy.binding.ConstYear);
        date.setMonth(pageProxy.binding.ConstMonth - 1);
        libCom.getControlProxy(pageProxy, 'ManufactureDatePicker').setValue(date);
    }


    const locationPicker = libCom.getControlProxy(pageProxy, 'LocationLstPkr');

    if (pageProxy.binding.Location) {
        locationPicker.setEditable(true);
        locationPicker.setValue([`Locations(Location='${pageProxy.binding.Location}',Plant='${pageProxy.binding.MaintPlant}')`]);
    } else if (pageProxy.binding.MaintPlant) {
        locationPicker.setEditable(true);
        libCom.getControlProxy(pageProxy, 'LocationLstPkr').setValue('');
    } else {
        locationPicker.setEditable(false);
        libCom.getControlProxy(pageProxy, 'LocationLstPkr').setValue('');
    }

    let aCopyFlags = setCopyFlags(pageProxy);
    libCom.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setValue(aCopyFlags);
    pageProxy.getClientData().DefaultValuesLoaded = true;
}

function setControlValues(pageProxy) {
    libCom.getControlProxy(pageProxy, 'CategoryLstPkr').setValue(pageProxy.binding.EquipCategory || '');
    libCom.getControlProxy(pageProxy, 'DescriptionNote').setValue(pageProxy.binding.EquipDesc || '');
    libCom.getControlProxy(pageProxy, 'MaintenacePlantLstPkr').setValue(pageProxy.binding.MaintPlant || '');
    libCom.getControlProxy(pageProxy, 'ManufactureNameProperty').setValue(pageProxy.binding.Manufacturer || ''); 
    libCom.getControlProxy(pageProxy, 'ModelNumberProperty').setValue(pageProxy.binding.ModelNum || ''); 
    libCom.getControlProxy(pageProxy, 'SerialNumberProperty').setValue(pageProxy.binding.SerialNumber || '');
    libCom.getControlProxy(pageProxy, 'RoomProperty').setValue(pageProxy.binding.Room || ''); 
    libCom.getControlProxy(pageProxy, 'SerialNumberProperty').setValue(pageProxy.binding.ManufSerialNo || '');
    libCom.setStateVariable(pageProxy, 'CopyValues', []);
}

function setCopyFlags(pageProxy) {
    let flags = [];
    if (pageProxy.binding.CopyClassification) { 
        flags.push('CLASSIFICATIONS_TO_COPY');
    }

    if (pageProxy.binding.CopyClassificationValues) { 
        flags.push('CLASSIFICATION_VALUES_TO_COPY');
    }

    if (pageProxy.binding.CopyDocuments) { 
        flags.push('DOCUMENT_TO_COPY');
    }

    if (pageProxy.binding.CopyMeasuringPoints) { 
        flags.push('MEASURING_POINTS_TO_COPY');
    }

    if (pageProxy.binding.CopyPartners) { 
        flags.push('PARTNERS_TO_COPY');
    }

    if (pageProxy.binding.CopyNote) { 
        flags.push('NOTE_TO_COPY');
    }

    if (pageProxy.binding.CopyInstallLocation) { 
        flags.push('INSTALL_LOCATION_TO_COPY');
    }

    return flags;
}

/**
 * Private method of setting title when the page is loaded
 * @param {IPageProxy} context
 * @param {boolean} onCreate flag of the current page state (create/edit)
 */
function setPageTitle(context, onCreate) {
    let title = '';
    if (onCreate) {
        title = context.localizeText('add_equipment');
    } else {
        title = context.localizeText('edit_equipment');
    }
    context.setCaption(title);
}
