import IsOnlineFunctionalLocation from '../FunctionalLocation/IsOnlineFunctionalLocation';

/**
   * Get count for the of the classes belong to particular entity set
   * 
   * @param {simplePropertyCell} context
   * 
   * @returns {number} get the count of classes
   * 
   */
export default function OnlineClassificationCount(context) {
    let classLink = 'Class';
    if (IsOnlineFunctionalLocation(context)) {
        classLink = 'FuncLocClass';
    }
    return context.count('/SAPAssetManager/Services/OnlineAssetManager.service',context.getPageProxy().binding['@odata.readLink'] + '/' + classLink, '');
}
