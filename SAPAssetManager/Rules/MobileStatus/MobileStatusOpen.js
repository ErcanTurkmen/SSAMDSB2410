import libCommon from '../Common/Library/CommonLibrary';

export default function MobileStatusOpen(context) {
    return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OpenParameterName.global').getValue()) || 'OPEN';    
}
