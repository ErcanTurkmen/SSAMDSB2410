import IsAndroid from '../Common/IsAndroid';
import CommonLibrary from '../Common/Library/CommonLibrary';

/**
* Returning sync icon if entity is local
* @param {IClientAPI} clientAPI
*/
export default function RefObjectsIcons(clientAPI) {
    const iconImages = [];

    if (CommonLibrary.isEntityLocal(clientAPI.binding)) {
        iconImages.push(
            IsAndroid(clientAPI) 
                ? '/SAPAssetManager/Images/syncOnListIcon.android.png'
                : '/SAPAssetManager/Images/syncOnListIcon.png',
        );
    }

    return iconImages;
}

