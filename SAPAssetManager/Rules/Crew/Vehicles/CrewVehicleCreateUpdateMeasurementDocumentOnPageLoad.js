import Stylizer from '../../Common/Style/Stylizer';
import OdometerPoint from './CrewVehicleOdometerPoint';
import libCom from '../../Common/Library/CommonLibrary';
import style from '../../Common/Style/StyleFormCellButton';


export default function CrewVehicleCreateUpdateMeasurementDocumentOnPageLoad(context) {

    let description = context.getControl('FormCellContainer').getControl('VehicleDescription');
    let license = context.getControl('FormCellContainer').getControl('VehicleLicense');
    let point = context.getControl('FormCellContainer').getControl('VehiclePoint');
    let previousReading = context.getControl('FormCellContainer').getControl('VehiclePreviousReading');
    let previousReadingDate = context.getControl('FormCellContainer').getControl('VehiclePreviousReadingDate'); 
    let textReadOnlyStyle = new Stylizer(['FormCellReadOnlyEntry']);
    
    textReadOnlyStyle.apply(description, 'Value');
    textReadOnlyStyle.apply(license, 'Value');
    textReadOnlyStyle.apply(point, 'Value');
    textReadOnlyStyle.apply(previousReading, 'Value');
    textReadOnlyStyle.apply(previousReadingDate, 'Value');    
    style(context, 'DiscardButton');

    if (!OdometerPoint) {
        context.setActionBarItemVisible(0, false);
    }
    libCom.saveInitialValues(context);
}
