import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionLotKPIValueForPoints(context) {
    if (Object.prototype.hasOwnProperty.call(context.binding,'InspectionPoints_Nav') && !libVal.evalIsEmpty(context.binding.InspectionPoints_Nav)) {
        let points = context.binding.InspectionPoints_Nav;
        let nonEmpty = 0;
        for (let point of points) {
            if (!libVal.evalIsEmpty(point.ValuationStatus)) {
                nonEmpty++;
            }
        }
        return nonEmpty + '/' + points.length;
    }
    return '0/0';
}
