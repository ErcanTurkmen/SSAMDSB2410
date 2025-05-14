import loadPersonaOverview from './LoadPersonaOverview';

/**
 * Used when application is restarted
 * Only navigate to overview if the new persona overview is different than current
 * @param {*} context 
 * @returns 
 */

export default function LoadPersonaOverviewAllowSkip(context) {
    return loadPersonaOverview(context, true);
}
