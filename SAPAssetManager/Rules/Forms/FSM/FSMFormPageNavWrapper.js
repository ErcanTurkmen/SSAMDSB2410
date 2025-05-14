import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCom from '../../Common/Library/CommonLibrary';
import isWindows from '../../Common/IsWindows';
import fsmFormIOSAndroidImplementation from './FSMFormPageNav';
import fsmFormWindowsImplementation from './FSMFormPageNavWindows';

export default function FSMFormPageNavWrapper(context) {
    ApplicationSettings.remove(context, 'XMLTemplateParsed');
    libCom.removeStateVariable(context, ['FSMFormInstanceCurrentChapterIndex', 'OnLoaded', 'FSMFormInstanceChapters', 'FSMFormInstanceControls', 'FSMFormInstanceVisibilityRules', 'FSMFormInstanceControlsInVisibilityRules', 'FSMToastMessage', 'FSMFormInstanceControlsInCalculations', 'FSMFormInstanceCalculationRules']);
    return isWindows(context) ? fsmFormWindowsImplementation(context) : fsmFormIOSAndroidImplementation(context);
}
