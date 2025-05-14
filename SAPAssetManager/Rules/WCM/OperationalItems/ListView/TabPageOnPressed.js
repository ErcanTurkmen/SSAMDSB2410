import TabPageOnLoaded from './TabPageOnLoaded';

/** @param {ITabItemProxy} context */
export default function TabPageOnPressed(context) {
    const tab = context.evaluateTargetPathForAPI(`#Page:${context._control.definition()._pageMetadata._Name}`);  // need to get the pageproxy of the tab's page
    TabPageOnLoaded(tab);
}
