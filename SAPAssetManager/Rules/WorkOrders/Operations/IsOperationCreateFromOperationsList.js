import libCommon from '../../Common/Library/CommonLibrary';

export default function IsOperationCreateFromOperationsList(context) {
     let binding = context.binding || {};
     return (libCommon.getWorkOrderAssnTypeLevel(context) === 'Operation' && !libCommon.isDefined(binding['@odata.readLink']) && libCommon.getStateVariable(context,'FromOperationsList'));
}
