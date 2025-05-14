import Logger from '../Log/Logger';
import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';
import ApplicationSettings from './Library/ApplicationSettings';
import libCommon from './Library/CommonLibrary';

const MOBILE_STATUS_SEQS_SETTING_NAME = 'MobileStatusSeqs';

export default async function CacheMobileStatusSequences(context, statusSeqs) {
    const result = statusSeqs || await ReadMobileStatusSequencesFromOfflineProvider(context);

    if (result) {
        const jsonString = convertSequencesArrayToJSONString(result);
        ApplicationSettings.setString(context, MOBILE_STATUS_SEQS_SETTING_NAME, jsonString);
        Logger.info('EAMOverallStatusSeqs saved to app settings');
    }
}

export function GetCachedMobileStatusSequences(context) {
    // Read from app settings first
    const cachedValue = ApplicationSettings.getString(context, MOBILE_STATUS_SEQS_SETTING_NAME);

    return cachedValue ? convertJSONStringToSequencesArray(cachedValue) : null;
}

export async function ReadMobileStatusSequencesFromOfflineProvider(context) {
    try {
        const isGuidedFlowEnabled = UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GuidedFlow.global').getValue());
        const result = isGuidedFlowEnabled ?
            await context.read('/SAPAssetManager/Services/AssetManager.service', 'GuidedFlowStatusSeqs', [], '$expand=GuidedFlowToStatusConfig_Nav') :
            await context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusSeqs', [], '$expand=OverallStatusCfg_Nav,NextOverallStatusCfg_Nav');

        return libCommon.isDefined(result) ? Array.from(result) : [];
    } catch (error) {
        Logger.error('ReadMobileStatusSequencesFromOfflineProvider', error);
        return [];
    }
}

function convertSequencesArrayToJSONString(array) {
    try {
        return JSON.stringify(array);
    } catch (error) {
        Logger.error('convertSequencesArrayToJSONString', error);
        return '';
    }
}

function convertJSONStringToSequencesArray(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        Logger.error('convertJSONStringToSequencesArray', error);
        return null;
    }
}
