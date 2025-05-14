import Logger from '../../Log/Logger';

/***
 * @param {IClientAPI} context
 * @returns {Promise<string>}
 */

export default function GetXSUAAToken(context) {
    let userInfoUrl = '/mobileservices/accesstoken/current';
    let params = { 'method': 'GET' };
    return context.sendRequest(userInfoUrl, params).then(response => {
        if (response && response.statusCode === 200 && response.content) {
            const token = JSON.parse(response.content.toString());
            if (token.access_token)
                return token.access_token;
        }
        return Promise.reject(`Invalid response code ${response.statusCode}`);
    },
    (error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), error.toString());
        return Promise.reject(`SendRequest for accesstoken failed ${error}`);
    });
}

