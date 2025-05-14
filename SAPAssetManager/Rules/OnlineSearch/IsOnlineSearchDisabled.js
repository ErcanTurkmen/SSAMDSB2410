import IsOnlineSearchEnabled from './IsOnlineSearchEnabled';

/**
* Returns if Online Search is disabled based on user features and assignment type
* @param {IClientAPI} context
*/
export default function IsOnlineSearchDisabled(context) {
    return !IsOnlineSearchEnabled(context);
}
