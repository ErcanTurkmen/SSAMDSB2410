import libVal from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function LAMObjectFromControls(controls) {
    const PointSim = 'PointSim';
    const LRPLstPkr = 'LRPLstPkr';
    const StartPoint = 'StartPoint';
    const EndPoint = 'EndPoint';
    const Length = 'Length';
    const UOMLstPkr = 'UOMLstPkr';
    const MarkerUOMLstPkr = 'MarkerUOMLstPkr';
    const Offset1TypeLstPkr = 'Offset1TypeLstPkr';
    const Offset1 = 'Offset1';
    const Offset1UOMLstPkr = 'Offset1UOMLstPkr';
    const Offset2TypeLstPkr = 'Offset2TypeLstPkr';
    const Offset2 = 'Offset2';
    const Offset2UOMLstPkr = 'Offset2UOMLstPkr';
    const DistanceFromEnd = 'DistanceFromEnd';
    const DistanceFromStart = 'DistanceFromStart';
    const StartMarkerLstPkr = 'StartMarkerLstPkr';
    const EndMarkerLstPkr = 'EndMarkerLstPkr';

    if (!libVal.evalIsEmpty(controls[StartPoint].getValue()) && !libVal.evalIsEmpty(controls[EndPoint].getValue())) {
        const lamObj = {
            Point: controls[PointSim].getValue(),
            LRPId: controls[LRPLstPkr].getValue(),
            StartPoint: controls[StartPoint].getValue(),
            EndPoint: controls[EndPoint].getValue(),
            Length: controls[Length].getValue(),
            UOM: libCom.getListPickerValue(controls[UOMLstPkr].getValue()),
            StartMarker: libCom.getListPickerValue(controls[StartMarkerLstPkr].getValue()),
            EndMarker: libCom.getListPickerValue(controls[EndMarkerLstPkr].getValue()),
            DistanceFromStart: controls[DistanceFromStart].getValue(),
            DistanceFromEnd: controls[DistanceFromEnd].getValue(),
            MarkerUOM: libCom.getListPickerValue(controls[MarkerUOMLstPkr].getValue()),
            Offset1Type: libCom.getListPickerValue(controls[Offset1TypeLstPkr].getValue()),
            Offset1: controls[Offset1].getValue(),
            Offset1UOM: libCom.getListPickerValue(controls[Offset1UOMLstPkr].getValue()),
            Offset2Type: libCom.getListPickerValue(controls[Offset2TypeLstPkr].getValue()),
            Offset2: controls[Offset2].getValue(),
            Offset2UOM: libCom.getListPickerValue(controls[Offset2UOMLstPkr].getValue()),
        };
        return lamObj;
    } else {
        return false;
    }
}
