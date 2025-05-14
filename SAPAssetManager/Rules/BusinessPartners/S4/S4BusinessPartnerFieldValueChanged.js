import CommonLibrary from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import { BusinessPartnerWrapper } from '../BusinessPartnerWrapper';

export default async function  S4BusinessPartnerFieldValueChanged(controlProxy) {
    ResetValidationOnInput(controlProxy);

    const pageProxy = controlProxy.getPageProxy();
    const clientData = pageProxy.getClientData();
    const businessPartner = CommonLibrary.getControlValue(controlProxy);

    if (businessPartner) {
        const partner = await pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `${businessPartner}`, ['PersonNum', 'LastName', 'FirstName'], '$expand=AddressAtWork_Nav/AddressAtWorkComm,S4BusinessPartnerLongText_Nav').then(result => result.length ? result.getItem(0) : null);
        const partnerAddress = partner?.AddressAtWork_Nav;
        const partnerLongTexts = partner?.S4BusinessPartnerLongText_Nav;
        updateNoteTypeControlQueryOptions(pageProxy, partnerLongTexts);
        updateAddressControlValues(pageProxy, partnerAddress);
        updateCommunicationControlValues(pageProxy, partnerAddress?.AddressAtWorkComm[0]);

        clientData.personelNum = partner?.PersonNum;
        clientData.addressEntity = 'AddressesAtWork';
        clientData.addressReadLink = partnerAddress?.['@odata.readLink'];
        clientData.addressComm = 'AddressesAtWorkComm';
        clientData.commPropertyReadLink = partnerAddress?.AddressAtWorkComm[0]?.['@odata.readLink'];
        clientData.commType = partnerAddress?.AddressAtWorkComm[0]?.CommType;
        clientData.lastName = partner?.LastName;
        clientData.firstName = partner?.FirstName;

        return Promise.resolve();
    }

    updateAddressControlValues(pageProxy);
    updateCommunicationControlValues(pageProxy);

    clientData.addressEntity = '';
    clientData.addressReadLink = '';
    clientData.addressComm = '';
    clientData.commPropertyReadLink = '';
    clientData.commType = '';
    clientData.personelNum = '';
    clientData.lastName = '';
    clientData.firstName = '';


    return Promise.resolve();
}

function updateAddressControlValues(pageProxy, addressData) {
    const countryControl = CommonLibrary.getControlProxy(pageProxy, 'Country');
    const houseControl = CommonLibrary.getControlProxy(pageProxy, 'House');
    const streetControl = CommonLibrary.getControlProxy(pageProxy, 'Street');
    const zipCodeControl = CommonLibrary.getControlProxy(pageProxy, 'ZipCode');
    const stateControl = CommonLibrary.getControlProxy(pageProxy, 'State');
    const cityControl = CommonLibrary.getControlProxy(pageProxy, 'City');
    const buildingControl = CommonLibrary.getControlProxy(pageProxy, 'Building');
    const floorControl = CommonLibrary.getControlProxy(pageProxy, 'Floor');
    const roomControl = CommonLibrary.getControlProxy(pageProxy, 'Room');

    countryControl.setValue(addressData ? addressData.Country : '', false);
    houseControl.setValue(addressData ? addressData.HouseNum : '');
    streetControl.setValue(addressData ? addressData.Street : '');
    zipCodeControl.setValue(addressData ? addressData.PostalCode : '');
    stateControl.setValue(addressData ? addressData.Region : '');
    cityControl.setValue(addressData ? addressData.City : '');
    buildingControl.setValue(addressData ? addressData.Building : '');
    floorControl.setValue(addressData ? addressData.Floor : '');
    roomControl.setValue(addressData ? addressData.RoomNum : '');
}

function updateCommunicationControlValues(pageProxy, communicationData) {
    const wrapper = new BusinessPartnerWrapper({ 'S4PartnerFunc_Nav': {} });
    const communicationsPropertyMap = wrapper.communicationsPropertyMap();

    const controls = {
        'Email': CommonLibrary.getControlProxy(pageProxy, 'Email'),
        'Fax': CommonLibrary.getControlProxy(pageProxy, 'Fax'),
        'Mobile': CommonLibrary.getControlProxy(pageProxy, 'Mobile'),
        'Telephone': CommonLibrary.getControlProxy(pageProxy, 'Phone'),
        'Extension': CommonLibrary.getControlProxy(pageProxy, 'Extension'),
        'FaxExtension': CommonLibrary.getControlProxy(pageProxy, 'FaxExtension'),
    };

    Object.keys(communicationsPropertyMap).forEach(propertyKey => {
        const communicationTypeKey = communicationsPropertyMap[propertyKey][0];
        const communicationType = communicationData?.[communicationTypeKey];
        const control = controls[propertyKey];

        if (control) {
            if (communicationsPropertyMap[propertyKey][1] === communicationType) {
                control.setValue(communicationData ? communicationData[communicationsPropertyMap[propertyKey][2]] : '');
            } else {
                control.setValue('');
            }
        }
    });
}

function updateNoteTypeControlQueryOptions(pageProxy, partnerLongTexts) {
    const noteTypeControl = CommonLibrary.getControlProxy(pageProxy, 'ServiceNoteTypesListPicker');
    const specifier = noteTypeControl.getTargetSpecifier();  

    if (partnerLongTexts?.length > 0) {
        const filter = partnerLongTexts.map(longText => `TextType ne '${longText.TextID}'`).join(' and ');
        specifier.setQueryOptions(`$filter=${filter}&$orderby=TextType`);
    } else {
        specifier.setQueryOptions('$orderby=TextType');
    }
    
    noteTypeControl.setTargetSpecifier(specifier);
    noteTypeControl.redraw();
}
