import ApplicationSettings from '../Common/Library/ApplicationSettings';
import isWindows from '../Common/IsWindows';
export default class {
    /*
    * check if measuring point is a classical view
    */
    static isMeasuringPointListView(context) {
        let value = this.getMeasuringPointView(context);
        return (value === 1 || isWindows(context));
    }

    /*
    * check if inspection characteristics is a classical view
    */
    static isInspectionCharacteristicsListView(context) {
        let value = this.getInspectionCharacteristicsView(context);
        return (value === 1 || isWindows(context));
    }
    
    /*
    * check if service items view preference is set to table
    */
    static isServiceItemTableView(context) {
        let value = this.getServiceItemsView(context);
        return value === 0;
    }

    /*
    * check if service items view preference is set to list
    */
    static isServiceItemListView(context) {
        let value = this.getServiceItemsView(context);
        return value === 1;
    }

    /*
    * set measuring point view
    */
    static setMeasuringPointView(context, value) {
        ApplicationSettings.remove(context, 'MeasuringPointView');
        ApplicationSettings.setNumber(context, 'MeasuringPointView', value);
    }

    /*
    * set inspection characteristics view
    */
    static setInspectionCharacteristicsView(context, value) {
        ApplicationSettings.remove(context, 'InspectionCharacteristicView');
        ApplicationSettings.setNumber(context, 'InspectionCharacteristicView', value);
    }
   
    /*
    * set service items view
    */
    static setServiceItemsView(context, value) {
        ApplicationSettings.remove(context, 'ServiceItemsView');
        ApplicationSettings.setNumber(context, 'ServiceItemsView', value);
    }
    
    /*
    * set inspection characteristics view
    */
    static setPersistFilterPreference(context, value) {
        ApplicationSettings.remove(context, 'PersistFilter');
        ApplicationSettings.setBoolean(context, 'PersistFilter', value);
    }

    /*
    * get measuring point view
    */
     static getMeasuringPointView(context) {
        return ApplicationSettings.getNumber(context, 'MeasuringPointView', 0);
    }

    /*
    * get inspection characteristics view
    */
    static getInspectionCharacteristicsView(context) {
        return ApplicationSettings.getNumber(context, 'InspectionCharacteristicView', 0);
    }

    /*
    * get service items view
    */
    static getServiceItemsView(context) {
        return ApplicationSettings.getNumber(context, 'ServiceItemsView', 0);
    }
    
    /*
    * get current Persist Filter preference
    */
    static getPersistFilterPreference(context) {
        return ApplicationSettings.getBoolean(context, 'PersistFilter', true);
    }

    /*
    * get meter screen view
    */
    static getMeterView(context) {
        return ApplicationSettings.getNumber(context, 'MeterView', 0);
    }
}
