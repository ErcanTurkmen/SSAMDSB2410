import CommonLibrary from '../../Common/Library/CommonLibrary';
import MeterLibrary from '../Common/MeterLibrary';

export default function GetStorageLocationValue(context) {
    const control = CommonLibrary.getControlProxy(context, 'StorageLocationLstPkr');
    return MeterLibrary.getControlValueIfVisible(control);
}
