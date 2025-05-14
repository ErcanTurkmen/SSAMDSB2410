import libCom from '../../Common/Library/CommonLibrary';

export default function CharacteristicDoneButtonVisible(context) {
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    return !(controlName ==='CurrencyMultipleValue' || controlName ==='CharacterMultipleValue' || controlName ==='NumberMultipleValue' || controlName === 'TimeMultipleValue' || controlName === 'DateMultipleValue');
}
