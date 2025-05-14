import ValidationLibrary from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default class EPDVisualizationLibrary {

    static IsEPDVisualizationEnabled(context) {
        let featureEnabled = userFeaturesLib.isFeatureEnabled(context, 'EPD_VISUALIZATION');
        Logger.debug('EPD', 'EPD Visualization feature enabled = ' + featureEnabled);
        return featureEnabled;
    }

    static SaveVisualizations(context, visualizations) {
        Logger.debug('EPD', 'SaveVisualizations');
        let aPromises = [];
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], "$filter=PreferenceGroup eq 'EPD'").then(result => {
            if (result) {
                visualizations.forEach(visualization => {
                    let visId = visualization.id.toString();
                    let found = false;
                    for (let i = 0; i < result.length; i++) {
                        let resultItem = result.getItem(i);
                        if (resultItem.PreferenceName === visId) {
                            // found, update
                            Logger.debug('EPD', 'SaveVisualizations: record exists, updating visualization id:' + visId);
                            found = true;
                            let strVis = JSON.stringify(visualization);
                            aPromises.push(context.executeAction({
                                'Name': '/SAPAssetManager/Actions/EPD/UpdateVisualizationInUserPrefs.action',
                                'Properties': {
                                    'Target': {
                                        'EntitySet': 'UserPreferences',
                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        'ReadLink': resultItem['@odata.readLink'],
                                    },
                                    'Properties': {
                                        'PreferenceValue': strVis,
                                    },
                                },
                            }));
                            break;
                        }
                    }
                    if (!found) {
                        // create
                        Logger.debug('EPD', 'SaveVisualizations: record does not exist, creating new one, visualization id: ' + visId);
                        let strVis = JSON.stringify(visualization);
                        aPromises.push(context.executeAction({
                            'Name': '/SAPAssetManager/Actions/EPD/CreateVIsualizationInUserPrefs.action',
                            'Properties': {
                                'Properties': {
                                    'PreferenceName': visId,
                                    'PreferenceValue': strVis,
                                },
                            },
                        }));
                    }
                });
                return Promise.all(aPromises).then(() => {
                    return Promise.resolve(true);
                });
            } else {
                Logger.error('EPD', 'SaveVisualizations: odata read failed');
                return Promise.resolve(false);
            }
        });
    }

    static RemoveVisualizations(context) {
        Logger.debug('EPD', 'RemoveVisualizations');
        let aPromises = [];
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], "$filter=PreferenceGroup eq 'EPD' ").then(result => {
            if (result && result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    let resultItem = result.getItem(i);
                    Logger.debug('EPD', 'Deleting ' + resultItem['@odata.readLink']);

                    aPromises.push(context.executeAction({
                        'Name': '/SAPAssetManager/Actions/EPD/DeleteVisualizationInUserPrefs.action',
                        'Properties': {
                            'Target': {
                                'EntitySet': 'UserPreferences',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': resultItem['@odata.readLink'],
                            },
                        },
                    }));
                }
                return Promise.all(aPromises).then(() => {
                    Logger.debug('EPD', 'Deleted count = ' + aPromises.length);
                    return Promise.resolve(true);
                });
            }
            return Promise.resolve(true);
        });
    }

    static GetEntityType(context) {
        let entityType = context.binding['@odata.type'];
        if (entityType === '#sap_mobile.MyFunctionalLocation') {
            return 'USAGE_IFL';
        } else if (entityType === '#sap_mobile.MyEquipment') {
            return 'USAGE_IEQ';
        } else if (entityType === '#sap_mobile.MyWorkOrderComponent') {
            return 'USAGE_MAT';
        } else {
            return '';
        }
    }

    static GetVisualization(context) {
        return context.getClientData().Visualization;
    }

    // returns promise
    static IsVisualizationAvailable(context) {
        if (this.IsEPDVisualizationEnabled(context)) {
            if (context.getClientData().Visualization) {
                return Promise.resolve(true);
            }
            return Promise.all([
                context.read('/SAPAssetManager/Services/AssetManager.service', 'AppParameters', ['ParamGroup', 'ParamValue', 'ParameterName'], `$filter=ParamGroup eq '${this.GetEntityType(context)}'`),
                context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], "$filter=PreferenceGroup eq 'EPD' "),
            ]).then((/** @type {[ObservableArray<AppParam>, ObservableArray<UserPreference>,]} */[appParams, result]) => {
                if (ValidationLibrary.evalIsEmpty(appParams) || ValidationLibrary.evalIsEmpty(result)) {
                    return false;
                }
                const param = appParams.getItem(0);
                for (let i = 0; i < result.length; i++) {
                    let vis;
                    try {
                        vis = JSON.parse(result.getItem(i).PreferenceValue);
                    } catch (error) {
                        Logger.debug('EPD', 'JSON parse error');
                        continue;
                    }
                    // loop over all metadata in each visualization
                    if (vis && vis.metadata && vis.metadata.find(element => element.tag === param.ParameterName && context.binding[param.ParamValue] === element.value)) {
                        context.getClientData().Visualization = vis;
                        return true;
                    }
                }
                return false;
            });
        }
        return Promise.resolve(false);
    }
}
