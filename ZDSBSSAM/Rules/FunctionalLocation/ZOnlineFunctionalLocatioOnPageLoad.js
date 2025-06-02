import CommonLib from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function ZOnlineFunctionalLocatioOnPageLoad(context)
{
    CommonLib.setStateVariable(context, 'ZOnlineSearch', true);
}