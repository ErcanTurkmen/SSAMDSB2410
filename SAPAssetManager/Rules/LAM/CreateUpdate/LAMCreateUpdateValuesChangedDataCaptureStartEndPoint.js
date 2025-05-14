import CommonLibrary from '../../Common/Library/CommonLibrary';

/** @param {IFormCellProxy} controlProxy */
export default function LAMCreateUpdateValuesChangedDataCaptureStartEndPoint(controlProxy) {
    const section = CommonLibrary.GetParentSection(controlProxy);
    const [startVal, endVal] = ['StartPoint', 'EndPoint'].map(n => section.getControl(n)).map(c => c.getValue());

    if (startVal || endVal) {
        CommonLibrary.clearValidationOnInput(controlProxy);
    }
}
