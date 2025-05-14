import CommonLibrary from '../../Common/Library/CommonLibrary';
// eslint-disable-next-line no-unused-vars
export default function SetDefaultPlant(context) {
    return CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
}
