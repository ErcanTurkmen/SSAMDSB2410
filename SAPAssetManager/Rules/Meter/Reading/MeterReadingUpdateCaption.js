import { FDCSectionHelper } from '../../FDC/DynamicPageGenerator';

export default function MeterReadingUpdateCaption(pageProxy) {
    let finished;
    if (pageProxy.binding.FromSingleRegister) {
        pageProxy.setCaption(pageProxy.localizeText('take_reading'));
    } else {
        let takeReadingText = pageProxy.localizeText('take_readings');
        try {
            let sectionHelper = new FDCSectionHelper(pageProxy);
            // eslint-disable-next-line no-unused-vars
            return sectionHelper.run((sectionBinding, section) => {
                return !!section.getControl('ReadingValue').getValue();
            }).then(values => {
                const readValues = values.reduce((accumulator, currValue) => {
                    if (currValue) {
                        accumulator++;
                    }
                    return accumulator;
                }, 0);

                let countString = `${readValues} of ${values.length}`;

                pageProxy.setCaption(`${takeReadingText} (${countString})`);
            });
        } catch (exc) {
            let registers;
            let regCount;
            if (pageProxy.binding.Device_Nav) {
                // If page has not been set up yet, this will be called
                registers = pageProxy.count('/SAPAssetManager/Services/AssetManager.service', pageProxy.binding.Device_Nav['@odata.readLink'] + '/MeterReadings_Nav', '$filter=sap.islocal()');
                regCount = pageProxy.count('/SAPAssetManager/Services/AssetManager.service', pageProxy.binding.Device_Nav.RegisterGroup_Nav['@odata.readLink'] + '/Registers_Nav', '');
            } else {
                // If page has not been set up yet, this will be called
                registers = pageProxy.count('/SAPAssetManager/Services/AssetManager.service', pageProxy.binding.DeviceLink['@odata.readLink'] + '/MeterReadings_Nav', '$filter=sap.islocal()');
                regCount = pageProxy.count('/SAPAssetManager/Services/AssetManager.service', pageProxy.binding.DeviceLink.RegisterGroup_Nav['@odata.readLink'] + '/Registers_Nav', '');
            }

            finished = Promise.all([registers, regCount]).then(function(results) {
                pageProxy.setCaption(`${takeReadingText} (${results[0]} of ${results[1]})`);
            });

        }

        return finished;
    }
}
