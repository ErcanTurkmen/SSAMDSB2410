import ApplicationSettings from './Library/ApplicationSettings';

export default function SetAppLaunchStarted(context) {
    return ApplicationSettings.setBoolean(context, 'onAppLaunch', true);
}
