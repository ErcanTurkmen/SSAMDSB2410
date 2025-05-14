import MeterSectionLibrary from './Common/MeterSectionLibrary';

export default async function MeterSectionQABAction(context) {
    const action = await MeterSectionLibrary.quickActionTargetValues(context, 'Action', context.getPageProxy()?.binding);
    return action && await context.executeAction(action);
}
