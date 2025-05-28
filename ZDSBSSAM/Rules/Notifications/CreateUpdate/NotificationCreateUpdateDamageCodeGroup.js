import notification from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

//Setting Damage code group based on Object part code group 
export default function NotificationCreateUpdateDamageCodeGroup(context) {
	var onCreate = libCom.IsOnCreate(context);

	var selection = context.getValue();
	var page = context.getPageProxy().getControl('FormCellContainer');
	let formCellContainer = context.getPageProxy().getControl('FormCellContainer');
	if (!page.isContainer()) {
		return null;
	}

	var targetList = page.getControl('DamageGroupLstPkr');
	var specifier = targetList.getTargetSpecifier();
	if (onCreate) {
		if (selection.length > 0) {
			let notif = context.getPageProxy().binding || {};

			if (notif['@odata.type'] === '#sap_mobile.MyNotificationItem') {
				notif = notif.Notification;
			} else if (notif['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
				notif = {
					// eslint-disable-next-line brace-style
					'NotificationType': (function () {
						try {
							return context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue');
						} catch (e) {
							return '';
						}
					})(),
					// eslint-disable-next-line brace-style
					'HeaderEquipment': formCellContainer.getControl('EquipHierarchyExtensionControl').getValue(),
					// eslint-disable-next-line brace-style
					'HeaderFunctionLocation': formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue()
				};
			}

			return notification.CatalogCodeQuery(context, notif, 'CatTypeDefects').then(function (result) {
				selection = selection[0].ReturnValue;

				specifier.setDisplayValue('{{#Property:CodeGroup}} - {{#Property:Description}}');
				specifier.setReturnValue('{CodeGroup}');

				specifier.setEntitySet('PMCatalogProfiles');
				specifier.setService('/SAPAssetManager/Services/AssetManager.service');

				let queryString = "$filter=Catalog eq '" + result.Catalog + "' and CatalogProfile  eq '" + result.CatalogProfile +
					"' 	and endswith(CodeGroup, '" + selection + "') eq true & $orderby = CodeGroup ";
				specifier.setQueryOptions(queryString);

				return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogProfiles', ['CodeGroup'], queryString).then(results => {

					if (results.length > 0 && results.getItem(0).CodeGroup) {
						targetList.setValue(results.getItem(0).CodeGroup);

					}
					libCom.setEditable(targetList, true);
					return targetList.setTargetSpecifier(specifier);
				});

			});

		} else {
			libCom.setEditable(targetList, false);
			return targetList.setTargetSpecifier(specifier);
		}
	}
}