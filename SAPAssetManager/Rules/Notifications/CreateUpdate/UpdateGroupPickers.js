import NotificationItemTaskCreateUpdateCode from '../Item/Cause/CreateUpdate/NotificationItemCauseCreateUpdateCode';
import NotificationItemCreateUpdateDamage from '../Item/CreateUpdate/NotificationItemCreateUpdateDamage';
import NotificationItemCreateUpdatePart from '../Item/CreateUpdate/NotificationItemCreateUpdatePart';
import NotificationItemPartGroupPickerItems from '../Item/CreateUpdate/NotificationItemPartGroupPickerItems';
import notification from '../NotificationLibrary';
/**
* Update Part Group, Damage Group, and Cause Group pickers
* after Type, FLOC, or Equipment changes
* @param {IClientAPI} context
*/
export default function UpdateGroupPickers(context) {
	let partGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:PartGroupLstPkr');
	partGroupPicker.setValue('', false);
	NotificationItemPartGroupPickerItems(partGroupPicker).then(pickerItems => {
		partGroupPicker.setPickerItems(pickerItems);
		NotificationItemCreateUpdatePart(partGroupPicker);
	});

	let damageGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:DamageGroupLstPkr');
	damageGroupPicker.setValue('', false);
	NotificationItemPartGroupPickerItems(damageGroupPicker).then(pickerItems => {
		damageGroupPicker.setPickerItems(pickerItems);
		NotificationItemCreateUpdateDamage(damageGroupPicker);
	});

	let causeGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:CauseGroupLstPkr');
	causeGroupPicker.setValue('', false);
	NotificationItemPartGroupPickerItems(causeGroupPicker).then(pickerItems => {
		causeGroupPicker.setPickerItems(pickerItems);
		NotificationItemTaskCreateUpdateCode(causeGroupPicker);
	});

	//Set Failure Mode Query Options
	let failureModeQuery = notification.NotificationTaskActivityGroupQuery(context.getPageProxy(), 'CatTypeCoding');
	return Promise.all([failureModeQuery]).then(queryOpts => {
		let codingGroupPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:QMCodeGroupListPicker');
		let codingGroupSpecifier = codingGroupPicker.getTargetSpecifier();
		codingGroupSpecifier.setQueryOptions(queryOpts[0]);
		codingGroupPicker.setTargetSpecifier(codingGroupSpecifier);
	});
}
