import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
*/
export default function GetWarehouseNumber() {
    return libCom.getDefaultUserParam('USER_PARAM./SCWM/LGN');
}
