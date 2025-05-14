import appSettings from '../Common/Library/ApplicationSettings';
import personaLib from '../Persona/PersonaLibrary';

export default class {
     
      /**
      * Sets the flags for all features enable by the the backend
      * @param {*} context 
      * @param {*} userFeatures
      */
   static setUserFeatures(context, userFeatures) {
        //enable only the most recent ones comming from the backend one by one
        let features = [];
        userFeatures.forEach(function(userFeature) {
                appSettings.setBoolean(context, `${userFeature.UserPersona}-${userFeature.UserFeature}`, true);
                features.push(`${userFeature.UserPersona}-${userFeature.UserFeature}`);
        });
        if (features.length>0) {
            ///Convert the features array to string and save it to persistent storage
            appSettings.setString(context,'CurrentFeaturesEnable',features.toString());
        }
    }

    /**
     * Deletes all feature flags on the persistent storage
     * @param {*} context 
     */
    static disableAllFeatureFlags(context) {
        ///convert the string of all features back to an array
        let allEnabledFeatures = appSettings.getString(context, 'CurrentFeaturesEnable').split(',');
        ///remove all the flags
        allEnabledFeatures.forEach(function(feature) {
            appSettings.remove(context,feature);
        });
        appSettings.remove(context,'CurrentFeaturesEnable');
    }
    /**
     * Checks if a particular feature is enabled for the active persona 
     * @param {*} context 
     * @param {*} key  name of the feature 
     */
    static isFeatureEnabled(context, key, persona = personaLib.getActivePersona(context)) {
        return appSettings.getBoolean(context, `${persona}-${key}`);
    }

    /**
     * Checks if features were fetched for the active persona 
     * @param {*} context 
     */
    static isUserFeaturesReceived(context) {
        const allFeatures = appSettings.getString(context, 'CurrentFeaturesEnable');
        return allFeatures !== '';
    }

    /**
     * Removes user features from the store
     * @param {*} context 
     */
    static removeSavedUserFeatures(context) {
        appSettings.remove(context,'CurrentFeaturesEnable');
    }
}
