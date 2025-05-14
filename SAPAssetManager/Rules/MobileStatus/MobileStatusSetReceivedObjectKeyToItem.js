import GenerateLocalID from '../Common/GenerateLocalID';

/**
* Get Mobile Status Object key with offset
* @param {IClientAPI} context
*/
export default function MobileStatusSetReceivedObjectKeyToItem(context) {   
    return GenerateLocalID(context, 'PMMobileStatuses', 'ObjectKey', '000000', "$filter=startswith(ObjectKey, 'LOCAL') eq true", 'LOCAL_MS', 'ObjectKey', 1).then(myLocalMobileStatusID => {
        return myLocalMobileStatusID;
    });
}
