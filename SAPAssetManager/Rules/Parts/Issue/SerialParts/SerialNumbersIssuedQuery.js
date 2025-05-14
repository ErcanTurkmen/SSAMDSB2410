import queryOptions from '../../Return/CreateUpdate/PartIssuedSerialNumQueryOptions';
import isSerialized from './SerialPartsAreAllowed';
import libCom from '../../../Common/Library/CommonLibrary';
import isDefenseEnabled from '../../../Defense/isDefenseEnabled';

export default function SerialNumbersIssuedQuery(context, bindingObject) {
    const binding = bindingObject || context.binding;    
    if (isSerialized(context, binding)) { //only proceed if serialized material
        return getIssuedSerialNums(context, binding).then((issuedSerialNums) => { //get all of the issued serial number entries 
            if (issuedSerialNums && issuedSerialNums.length > 0) {
                return getReturnedSerialNums(context, binding).then((returnedSerialNums) => { //get all of the returned serial number entries
                    if (returnedSerialNums && returnedSerialNums.length > 0) {
                        let currentIssuedSerialNums = getCurrentIssuedSerialNums(issuedSerialNums, returnedSerialNums); //compare the two collections and determine the ones that are currently issued as they could have been returned
                        return buildJsonObjectArray(context, currentIssuedSerialNums);
                    } else {
                        return buildJsonObjectArray(context, issuedSerialNums);
                    }
                });
            }
            return [];  
        });
    }
}

function getIssuedSerialNums(context, bindingObject) {
    let goodsIssueMovementType = libCom.getAppParam(context, 'WORKORDER', 'MovementType');
    let defenseEnabled = isDefenseEnabled(context);
    let selectFields = ['SerialNum', 'MaterialDocNumber'];

    if (defenseEnabled) selectFields.push('UniversalItemId');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MatDocItemSerialNums', selectFields, queryOptions(context, goodsIssueMovementType, bindingObject)).then((allIssuedSerialNumRecords) => {
        let allIssuedSerialNums = [];

        if (allIssuedSerialNumRecords && allIssuedSerialNumRecords.length > 0) {
            allIssuedSerialNums = allIssuedSerialNumRecords.map(record => ({
                'SerialNum': record.SerialNum,
                'MaterialDocNumber': record.MaterialDocNumber,
                'UniversalItemId': defenseEnabled && record.UniversalItemId ? record.UniversalItemId: '',
            }));
        }

        return allIssuedSerialNums;
    });
}

function getReturnedSerialNums(context, bindingObject) {
    let goodsReturnMovementType = libCom.getAppParam(context, 'WORKORDER', 'GoodsReturnMovementType');
    let defenseEnabled = isDefenseEnabled(context);
    let selectFields = ['SerialNum', 'MaterialDocNumber'];
    
    if (defenseEnabled) selectFields.push('UniversalItemId');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MatDocItemSerialNums', selectFields, queryOptions(context, goodsReturnMovementType, bindingObject)).then((allReturnedSerialNumRecords) => {
        let allReturnedSerialNums = [];
        
        if (allReturnedSerialNumRecords && allReturnedSerialNumRecords.length > 0) {
            allReturnedSerialNums = allReturnedSerialNumRecords.map(record => ({
                'SerialNum': record.SerialNum,
                'MaterialDocNumber': record.MaterialDocNumber,
                'UniversalItemId': defenseEnabled && record.UniversalItemId ? record.UniversalItemId: '',
            }));
        }
        
        return allReturnedSerialNums;
    });
}

function getCurrentIssuedSerialNums(issuedSerialNums, returnedSerialNums) {
    const issuedSerialNumsArr = [...issuedSerialNums];

    for (let i=0; i < issuedSerialNumsArr.length; i++) {
        for (let returnedSerialNumobject of returnedSerialNums) {
            if (issuedSerialNumsArr[i].SerialNum === returnedSerialNumobject.SerialNum) {
                if (returnedSerialNumobject.MaterialDocNumber > issuedSerialNumsArr[i].MaterialDocNumber) { //if the Return happened after Issue then, it would have a higher MaterialDocNumber hence, remove this entry from array
                    issuedSerialNumsArr[i] = undefined;
                    break;
                }
            }
        }
    }

    return issuedSerialNumsArr;
}

function buildJsonObjectArray(context, serialNums) {

    let jsonResult = [];

    if (libCom.getStateVariable(context, 'PartReturnSerial')) {
        libCom.removeStateVariable(context, 'PartReturnSerial');
        for (let serialNum of serialNums) {
            if (serialNum) { //Create JSON for part return picker
                jsonResult.push(
                    {
                        ObjectCell: {
                            Title: `${serialNum.SerialNum}`,
                            Subhead: '/SAPAssetManager/Rules/Parts/Issue/SerialParts/SerialUUID.js',
                        },
                        ReturnValue: `${serialNum.SerialNum}`,
                        UniversalItemId: `${serialNum.UniversalItemId}`,
                    },
                );
            }
        }
    } else {
        for (let serialNum of serialNums) {
            if (serialNum) {
                jsonResult.push(
                    {
                        'ReturnValue': `${serialNum.SerialNum}`,
                        'UniversalItemId': `${serialNum.UniversalItemId}`,
                    },
                );
            }
        }
    }

    return jsonResult;
}
