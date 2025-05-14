import libCom from '../../Common/Library/CommonLibrary';

export default function GetFailedOperations(context) {
    const data = libCom.getStateVariable(context, 'FailedOperations');
    let confNumbers = [];
    data.map((item, index) => {
        confNumbers.push(`${index === 0 ? '' : '\n'}${item.OperationShortText} - ${item.Operation} - ${item.error}`);
    });
    return confNumbers;
}
