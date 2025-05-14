import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import GetConfirmationObjectType from '../../ServiceConfirmations/CreateUpdate/Data/GetConfirmationObjectType';
import ServiceOrderObjectType from '../../ServiceOrders/ServiceOrderObjectType';

export default function CategoryValueChanged(control, childControls, parentControls, categoryType) {
    let pageProxy = control.getPageProxy();
    let pageName = CommonLibrary.getPageName(pageProxy);
    switch (pageName) {
        case 'ServiceRequestCreateUpdatePage': {
            let catalogType = '';
            //SubjectCategory or ReasonCategory
            if (categoryType === 'SubjectCategory') {
                catalogType = CommonLibrary.getAppParam(pageProxy, 'CATALOGTYPE', 'S4ServiceRequestSubject');
            } else {
                catalogType = CommonLibrary.getAppParam(pageProxy, 'CATALOGTYPE', 'S4ServiceRequestReason');
            }

            S4ServiceLibrary.getHeaderCategorySchemaGuid(pageProxy, 'SRVR', 'ServiceRequestCategory' + catalogType + 'SchemaGuid', catalogType).then(schemaGuid => {
                manageDependentConrols(control, childControls, parentControls, schemaGuid);
            });
            break;
        }
        case 'ServiceOrderCreateUpdatePage': {
            let bindingProcessType = pageProxy.binding ? pageProxy.binding.ProcessType : '';
            let processType = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(pageProxy, 'ProcessTypeLstPkr')) || bindingProcessType;
            S4ServiceLibrary.getHeaderCategorySchemaGuid(pageProxy, processType).then(schemaGuid => {
                manageDependentConrols(control, childControls, parentControls, schemaGuid);
            });
            break;
        }
        case 'CreateUpdateServiceItemScreen': {
            let itemCategory = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(pageProxy, 'ItemCategoryLstPkr'));
            let objectType = ServiceOrderObjectType(pageProxy);
            let bindingProcessType = pageProxy.binding ? pageProxy.binding.ProcessType : '';
            const orderProcessType = CommonLibrary.getAppParam(pageProxy, 'S4SERVICEORDER', 'ProcessType');

            S4ServiceLibrary.getItemCategorySchemaGuid(pageProxy, itemCategory, objectType, bindingProcessType || orderProcessType).then(schemaGuid => {
                manageDependentConrols(control, childControls, parentControls, schemaGuid);
            });
            break;
        }
        case 'CreateUpdateServiceConfirmationScreen': {
            S4ServiceLibrary.getHeaderCategorySchemaGuid(pageProxy, 'SRVC', 'ConfirmationCategorySchemaGuid').then(schemaGuid => {
                manageDependentConrols(control, childControls, parentControls, schemaGuid);
            });
            break;
        }
        //confirmation item and ad-hoc confrimation screens
        default: {
            let itemCategory = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(pageProxy, 'ItemCategoryLstPkr'));
            let objectType = GetConfirmationObjectType(pageProxy);
    
            S4ServiceLibrary.getItemCategorySchemaGuid(pageProxy, itemCategory, objectType, 'SRVC').then(schemaGuid => {
                manageDependentConrols(control, childControls, parentControls, schemaGuid);
            });
        }
    }
}

function manageDependentConrols(control, childControls, parentControls, schemaGuid) {
    let value = CommonLibrary.getControlValue(control);

    if (value) {
        control.read('/SAPAssetManager/Services/AssetManager.service', 'CategorizationSchemas', [], `$select=CategoryGuid,CategoryName,NodeLeaf,PareGuid&$filter=CategoryGuid eq guid'${value}'`).then(result => {
            if (result.length) {
                let category = result.getItem(0);
                
                if (parentControls && parentControls.length) {
                    if (CommonLibrary.getControlValue(parentControls[0].control) !== category.PareGuid) {
                        setQueryOptionsToParentControl(0, category.PareGuid, parentControls, schemaGuid);
                    }
                } 
                
                if (category.NodeLeaf === 'X') {
                    childControls.forEach(childControl => {
                        if (childControl) {
                            toggleControlAndResetValue(childControl.control, false);
                        }
                    });
                } else {
                    childControls.forEach(childControl => {
                        if (childControl && childControl.dependent) {
                            setQueryOptionsToChildControl(childControl.control, childControl.level, category.CategoryGuid, schemaGuid);
                        } else if (childControl) {
                            setQueryOptionsToChildControl(childControl.control, childControl.level, undefined, schemaGuid);
                        }
                    });
                }
            }
        });
    } else {
        childControls.forEach(childControl => {
            toggleControlAndResetValue(childControl.control, true);
        });
    }

    return Promise.resolve(value);
}

function toggleControlAndResetValue(control, editable) {
    control.setEditable(editable);
    control.setValue('');
}

function setQueryOptionsToParentControl(index, parentGuid, controls, schemaGuid) {
    if (controls[index] && controls[index].control) {
        let control = controls[index].control;
        let specifier = control.getTargetSpecifier();
        let orderBy = '$orderby=CategoryID';
        
        let filter = `$filter=CategoryLevel eq '${controls[index].level}' and SchemaGuid eq guid'${schemaGuid}'`;
        let query = orderBy + '&' + filter;
        specifier.setQueryOptions(query);
        control.setValue('', false);
        control.setTargetSpecifier(specifier).then(() => {
            control.setValue(parentGuid, false);

            control.read('/SAPAssetManager/Services/AssetManager.service', 'CategorizationSchemas', [], `$select=CategoryGuid,PareGuid&$filter=CategoryGuid eq guid'${parentGuid}'`).then(result => {
                if (result.length) {
                    let category = result.getItem(0);
                    if (category.CategoryGuid !== category.PareGuid) {
                        setQueryOptionsToParentControl(index + 1, category.PareGuid, controls, schemaGuid);
                    }
                }
            });
        });
    }
}

function setQueryOptionsToChildControl(control, categoryLevel, parentGuid, schemaGuid) {
    control.setValue('');

    let specifier = control.getTargetSpecifier();
    let orderBy = '$orderby=CategoryID';
    
    let filter = `$filter=CategoryLevel eq '${categoryLevel}' and SchemaGuid eq guid'${schemaGuid}'`;
    if (parentGuid) {
        filter += ` and PareGuid eq guid'${parentGuid}'`;
    }
    specifier.setQueryOptions(orderBy + '&' + filter);
    control.setTargetSpecifier(specifier);
}
