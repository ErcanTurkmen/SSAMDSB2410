import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default class ServiceRequestControlsLibrary {
    /**
     * Priority getter
     * @param {IPageProxy} pageProxy
     */
    static getPriority(pageProxy) {
        let priority = libCommon.getTargetPathValue(pageProxy, '#Page:ServiceRequestCreateUpdatePage/#Control:PrioritySeg/#Value');
        return libCommon.getListPickerValue(priority);
    }

    /**
     * Urgency getter
     * @param {IPageProxy} pageProxy
     */
     static getUrgency(pageProxy) {
        let urgency = libCommon.getTargetPathValue(pageProxy, '#Page:ServiceRequestCreateUpdatePage/#Control:UrgencySeg/#Value');
        return libCommon.getListPickerValue(urgency);
    }

    /**
     * Impact getter
     * @param {IPageProxy} pageProxy
     */
     static getImpact(pageProxy) {
        let impact = libCommon.getTargetPathValue(pageProxy, '#Page:ServiceRequestCreateUpdatePage/#Control:ImpactSeg/#Value');
        return libCommon.getListPickerValue(impact);
    }

    /**
	 * Sold to Party getter
	 * @param {IPageProxy} pageProxy
	 */
	static getSoldToParty(pageProxy) {
		let soldToParty = libCommon.getTargetPathValue(pageProxy, '#Page:ServiceRequestCreateUpdatePage/#Control:SoldToPartyLstPkr/#Value');
		return libCommon.getListPickerValue(soldToParty);
	}

    /**
     * Category getter
     * @param {IPageProxy} pageProxy
     */
    static getCategory(pageProxy, controlName) {
        let category = libCommon.getTargetPathValue(pageProxy, `#Page:ServiceRequestCreateUpdatePage/#Control:${controlName}`);
        return libCommon.getControlValue(category);
    }

    /**
     * Priority getter
     * @param {IPageProxy} pageProxy
     */
     static getEmployeeResponsible(pageProxy) {
        let employee = libCommon.getTargetPathValue(pageProxy, '#Page:ServiceRequestCreateUpdatePage/#Control:EmployeeRespLstPkr/#Value');
        return libCommon.getListPickerValue(employee);
    }

	/**
     * FunctionalLocation getter
	 * @param {IPageProxy} pageProxy
	 */
	static getFunctionalLocationValue(pageProxy) {
		let funcLocControl = pageProxy.evaluateTargetPath('#Page:ServiceRequestCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl');
		if (funcLocControl !== undefined && funcLocControl.getValue() !== undefined) {
			let floc = funcLocControl.getValue();
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
	 */
	static getEquipmentValue(pageProxy) {
		let equipControl = pageProxy.evaluateTargetPath('#Page:ServiceRequestCreateUpdatePage/#Control:EquipHierarchyExtensionControl');
		if (equipControl !== undefined && equipControl.getValue() !== undefined) {
			let equipment = equipControl.getValue();
			if (libCommon.isCurrentReadLinkLocal(equipment)) {
				return libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
					return equipmentId;
				});
			}
			return equipment;
		}
		return '';
	}

	/**
	 * Update Equipment control
	 * @param {IPageProxy} pageProxy
	 */
	static updateEquipment(pageProxy) {
		try {
			let formCellContainer = pageProxy.getControl('FormCellContainer');
			let funcLocControlValue = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
			let equipmentControlValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
			let extension = formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension();
			return extension.reload().then(() => {
				if (funcLocControlValue && equipmentControlValue) {
					extension.setData(equipmentControlValue);
				}
				return Promise.resolve(true);
			});
		} catch (err) {
			/**Implementing our Logger class*/
			Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `UpdateEquipment Error: ${err}`);
			return Promise.resolve(false);
		}
	}

	/**
	 * Update Functional Location control
	 * @param {IPageProxy} pageProxy
	 */
	static updateFloc(pageProxy) {
		try {
			let formCellContainer = pageProxy.getControl('FormCellContainer');
			let equipmentControlValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
			let extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
			return extension.reload().then(() => {
				if (equipmentControlValue) {
					return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern'], `$filter=EquipId eq '${equipmentControlValue}'&$expand=FunctionalLocation&$orderby=EquipId`).then(results => {
						if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
							extension.setData(results.getItem(0).FuncLocIdIntern);
						}
						return Promise.resolve(true);
					});
				}
				return Promise.resolve(true);
			});

		} catch (err) {
			/**Implementing our Logger class*/
			Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `UpdateFloc Error: ${err}`);
			return Promise.resolve(false);
		}
	}

	/**
	 * Update Bill-to party control
	 * @param {IPageProxy} pageProxy
	 */
	static updateBillToParty(control) {
		const relTypes = libCommon.getAppParam(control, 'S4BPRELTYPE', control.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/BillToParty.global').getValue());
		let relTypesArray = relTypes.split(',');
		let relTypeFilterString = relTypesArray.map(type => `RelType eq '${type}'`).join(' or ');

		try {
			let formCellContainer = control.getPageProxy().getControl('FormCellContainer');
			if (libCommon.isDefined(formCellContainer)) {
				let soldToPartyLstPkrValue = libCommon.getListPickerValue(formCellContainer.getControl('SoldToPartyLstPkr').getValue());
				let billToPartyLstPkrControl = formCellContainer.getControl('BillToPartyLstPkr');
				let billToPartySpecifier = billToPartyLstPkrControl.getTargetSpecifier();

				if (libCommon.isDefined(soldToPartyLstPkrValue)) {
					billToPartySpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
					billToPartySpecifier.setEntitySet('S4BPRelationships');
					billToPartySpecifier.setQueryOptions(`$filter=BusinessPartnerFrom eq '${soldToPartyLstPkrValue}' and (${relTypeFilterString})&$expand=S4BusinessPartner_Nav`);
					billToPartyLstPkrControl.setEditable(true);
					billToPartyLstPkrControl.setValue('');
					billToPartyLstPkrControl.setTargetSpecifier(billToPartySpecifier);
				} else {
					billToPartyLstPkrControl.setValue('');
					billToPartyLstPkrControl.setTargetSpecifier(billToPartySpecifier);
				}
			}
		} catch (err) {		
			/**Implementing our Logger class*/		 
			Logger.error(control.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryServiceRequest.global').getValue(), `Update BillToParty Error: ${err}`);
		}
		return false;
	}

	/**
	 * Update SalesOrg control
	 * @param {IPageProxy} pageProxy
	 */
	static updateSalesOrg(control) {
		try {
			const defaultProcessType = control.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ServiceRequestDefaultProcessType.global').getValue();
			let formCellContainer = control.getPageProxy().getControl('FormCellContainer');
			if (libCommon.isDefined(formCellContainer)) {
				let soldToPartyLstPkrValue = libCommon.getListPickerValue(formCellContainer.getControl('SoldToPartyLstPkr').getValue());
				let salesOrgLstPkrControl = formCellContainer.getControl('SalesOrgLstPkr');
				let salesOrgSpecifier = salesOrgLstPkrControl.getTargetSpecifier();

				if (libCommon.isDefined(soldToPartyLstPkrValue)) {
					salesOrgSpecifier.setQueryOptions(`$expand=SalesOrg_Nav,DistributionChannel_Nav,Division_Nav&$filter=ProcessType eq '${defaultProcessType}' and BusinessPartner eq '${soldToPartyLstPkrValue}'`);
					salesOrgLstPkrControl.setValue('');
					salesOrgLstPkrControl.setTargetSpecifier(salesOrgSpecifier);
				} else {
					salesOrgSpecifier.setQueryOptions(`$expand=SalesOrg_Nav,DistributionChannel_Nav,Division_Nav&$filter=ProcessType eq '${defaultProcessType}'`);
					salesOrgLstPkrControl.setValue('');
					salesOrgLstPkrControl.setTargetSpecifier(salesOrgSpecifier);
				}
			}
		} catch (err) {		
			/**Implementing our Logger class*/		 
			Logger.error(control.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryServiceRequest.global').getValue(), `Update SalesOrg Error: ${err}`);
		}
		return false;
	}

	/**
	 * Update ServiceOrg control
	 * @param {IPageProxy} pageProxy
	 */
	static updateServiceOrg(control) {
		try {
			let formCellContainer = control.getPageProxy().getControl('FormCellContainer');
			if (libCommon.isDefined(formCellContainer)) {
				let soldToPartyLstPkrValue = libCommon.getListPickerValue(formCellContainer.getControl('SoldToPartyLstPkr').getValue());
				let serviceOrgLstPkrControl = formCellContainer.getControl('ServiceOrgLstPkr');
				let serviceOrgSpecifier = serviceOrgLstPkrControl.getTargetSpecifier();

				if (libCommon.isDefined(soldToPartyLstPkrValue)) {
					serviceOrgSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
					serviceOrgSpecifier.setEntitySet('S4BPOrgs');
					serviceOrgSpecifier.setDisplayValue('{{#Property:ServiceOrg_Nav/#Property:ServiceOrg}} - {{#Property:ServiceOrg_Nav/#Property:Description}}');
					serviceOrgSpecifier.setReturnValue('{OrgId}');
					serviceOrgSpecifier.setQueryOptions(`$expand=ServiceOrg_Nav&$filter=OrgType eq '2' and TransactionType eq 'SRVR' and BusinessPartner eq '${soldToPartyLstPkrValue}'`);
					serviceOrgLstPkrControl.setValue('');
					serviceOrgLstPkrControl.setTargetSpecifier(serviceOrgSpecifier);
				} else {
					serviceOrgSpecifier.setQueryOptions('$expand=ServiceOrg_Nav&$filter=OrgType eq "2" and TransactionType eq "SRVR"');
					serviceOrgLstPkrControl.setValue('');
					serviceOrgLstPkrControl.setTargetSpecifier(serviceOrgSpecifier);
				}
			}
		} catch (err) {		
			/**Implementing our Logger class*/		 
			Logger.error(control.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryServiceRequest.global').getValue(), `Update ServiceOrg Error: ${err}`);
		}
		return false;
	}

}
