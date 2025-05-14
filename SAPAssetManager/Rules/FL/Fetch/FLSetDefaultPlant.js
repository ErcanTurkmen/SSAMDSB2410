import libCom from '../../Common/Library/CommonLibrary';

export default function FLSetDefaultPlant() {
    return libCom.getDefaultUserParam('USER_PARAM.WRK');
}
