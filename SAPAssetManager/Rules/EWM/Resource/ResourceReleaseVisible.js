/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import GetResource from './GetResource';
export default function ResourceReleaseVisible(clientAPI) {
    return GetResource(clientAPI).then((resource) => {
        return !!resource;
    });
}


