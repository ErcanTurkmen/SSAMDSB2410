
export default function MeasuringPointsEDTPointValue(clientAPI) {
    return `${clientAPI.binding.CharDescription} (${clientAPI.binding.Point} - ${clientAPI.binding.PointDesc})`;
}
