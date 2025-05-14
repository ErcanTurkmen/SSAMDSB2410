import ODataDate from '../../../Common/Date/ODataDate';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetServiceItemRequstedStartDate(context) {
    let date = '';
    let dateControl = CommonLibrary.getControlProxy(context, 'StartDatePkr');

    if (dateControl) {
        date = CommonLibrary.getControlValue(dateControl);
    }

    let time = '';
    let timeControl = CommonLibrary.getControlProxy(context, 'StartTimePkr');
    if (timeControl) {
        time = CommonLibrary.getControlValue(timeControl);
    }

    if (date && time) {
        let otime = new ODataDate(time);
        let odataDate = new ODataDate(date, otime.toLocalTimeString(context));
        return odataDate.toDBDateTimeString(context);
    }
    
    if (date) {
        let odataDate = new ODataDate(date);
        return odataDate.toDBDateTimeString(context);
    } else {
        let odataDate = new ODataDate();
        return odataDate.toDBDateTimeString(context);
    }
}
