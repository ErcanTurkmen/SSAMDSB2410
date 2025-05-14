export default function MeasuringPointShortText(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let binding = pageClientAPI.binding;
    if (Object.prototype.hasOwnProperty.call(binding,'ShortText')) {
        return binding.ShortText;
    } else {
        return binding.MeasuringPoint ? binding.MeasuringPoint.ShortText : binding.PRTPoint.ShortText;
    }
}
