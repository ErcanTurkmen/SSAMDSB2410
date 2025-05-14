import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {IClientAPI} context */
export default function NotificationHistoryLongText(context) {
    /** @type {NotificationHistory} */
    const notificationHistory = context.binding;
    return Promise.resolve(context.binding.HistoryLongText_Nav || context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationHistoryTexts', [], `$filter=NotificationNumber eq '${notificationHistory.NotificationNumber}'`).then(result => ValidationLibrary.evalIsEmpty(result) ? '' : result.getItem(0)))
        .then((/** @type {NotificationHistoryText} */ historyLongText) => ValidationLibrary.evalIsEmpty(historyLongText) ? '-' : historyLongText.TextString);
}
