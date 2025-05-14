/**
* @param {IClientAPI} clientAPI
* @returns {Promise<Object>}
*/
export default function InitialContext(clientAPI) {
    const obj = clientAPI.getBindingObject();
    if (obj) {
        return Promise.resolve(JSON.parse(JSON.stringify(obj)));
    }
    return Promise.resolve({});
}
