import libCommon from '../Common/Library/CommonLibrary';

export default class S4ServiceQuotationControlsLibrary {

	/**
	 * Priority getter
	 * @param {IPageProxy} pageProxy
	 */
	static getPriority(pageProxy) {
		let priority = libCommon.getTargetPathValue(pageProxy, '#Page:ServiceQuotationCreateUpdatePage/#Control:PrioritySeg/#Value');
		return libCommon.getListPickerValue(priority);
	}
	
	/**
	 * Sold to Party getter
	 * @param {IPageProxy} pageProxy
	 */
	static getSoldToParty(pageProxy) {
		let soldToParty = libCommon.getTargetPathValue(pageProxy, '#Page:ServiceQuotationCreateUpdatePage/#Control:SoldToPartyLstPkr/#Value');
		return libCommon.getListPickerValue(soldToParty);
	}
	
	/**
	 * Bill to Party getter
	 * @param {IPageProxy} pageProxy
	 */
	static getBillToParty(pageProxy) {
		let billToParty = libCommon.getTargetPathValue(pageProxy, '#Page:ServiceQuotationCreateUpdatePage/#Control:BillToPartyLstPkr/#Value');
		return libCommon.getListPickerValue(billToParty);
	}

	/**
	 * Category getter
	 * @param {IPageProxy} pageProxy
	 */
	static getCategory(pageProxy, controlName) {
		let category = libCommon.getTargetPathValue(pageProxy, `#Page:ServiceQuotationCreateUpdatePage/#Control:${controlName}`);
		return libCommon.getControlValue(category);
	}

	/**
	 * FunctionalLocation getter
	 * @param {IPageProxy} pageProxy
	 * @param {string} pageName
	 */
	static getFunctionalLocationValue(pageProxy, pageName = 'ServiceQuotationCreateUpdatePage') {
		let funcLocControl = pageProxy.evaluateTargetPath(`#Page:${pageName}/#Control:FuncLocHierarchyExtensionControl`);
		if (funcLocControl) {
			let floc = funcLocControl.getValue() || '';
			if (libCommon.isCurrentReadLinkLocal(floc)) {
				return libCommon.getEntityProperty(pageProxy, `MyFunctionalLocations(${floc})`, 'FuncLocIdIntern').then(flocIdIntern => {
					return flocIdIntern;
				});
			}
			return floc;
		}
		return '';
	}

	/**
	 * Equipment getter
	 * @param {IPageProxy} pageProxy
	 * @param {string} pageName
	 */
	static getEquipmentValue(pageProxy, pageName = 'ServiceQuotationCreateUpdatePage') {
		let equipControl = pageProxy.evaluateTargetPath(`#Page:${pageName}/#Control:EquipHierarchyExtensionControl`);
		if (equipControl) {
			let equipment = equipControl.getValue() || '';
			if (libCommon.isCurrentReadLinkLocal(equipment)) {
				return libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
					return equipmentId;
				});
			}
			return equipment;
		}
		return '';
	}
}
