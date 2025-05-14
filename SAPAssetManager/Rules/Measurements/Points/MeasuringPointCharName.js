export default function MeasuringPointCharName(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let binding = pageClientAPI.binding;
    if (Object.prototype.hasOwnProperty.call(binding,'CharName')) {
        return binding.CharName;
    } else {
        return binding.MeasuringPoint.CharName;
    }
}
