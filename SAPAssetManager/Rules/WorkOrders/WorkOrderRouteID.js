
export default function WorkOrderRouteID(context) {
    let binding = context.getBindingObject();
    let date = binding.ScheduledStartDate || binding.RequestedStart;

    //return id based on start date: from 2018-02-04T01:20:15 into 20180204012015
    return date.replace(/-/g, '').replace(/T/g, '').replace(/:/g, '');
}
