import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function Location(context) {
    let location = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'LocationLstPkr')) || '';
    return CommonLibrary.parseReadLink(location, 'Location');
}
