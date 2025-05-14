import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { OperationalItemCreateCodeBehind } from './OperationalItemCreateNav';

export default function AndroidBackButtonPressed(context) {
    CommonLibrary.cancelDefaultBackNavigationAndroid(context);
    return OperationalItemCreateCodeBehind.CancelPressed(context);
}
