import {FDCSectionHelper} from '../../../FDC/DynamicPageGenerator';
import InspectionPointUpdateValidation from './InspectionPointUpdateValidation';
import InspectionPointsChangeSetOnSuccess from './InspectionPointsChangeSetOnSuccess';
import libVal from '../../../Common/Library/ValidationLibrary';
export default function InspectionPointsFDCUpdateDone(context) {
    let fdcHelper = new FDCSectionHelper(context);
    // Validate all sections first
    //eslint-disable-next-line no-unused-vars
    return fdcHelper.run((sectionBinding, section) => {
        return InspectionPointUpdateValidation(context, section);
    }).then(validationPass => {
        if (validationPass.every(value => value === true)) {
            return fdcHelper.run(async sectionBinding => {
                let createLinks = [];
                const isInspCodeNavEmpty = checkIsInspCodeNavEmpty(sectionBinding);
                if (isInspCodeNavEmpty) {
                    createLinks.push({
                        'Property': 'InspCode_Nav',
                        'Target': {
                            'EntitySet': 'InspectionCodes',
                            'ReadLink': `InspectionCodes(Plant='${sectionBinding.ClientData.Plant}',SelectedSet='${sectionBinding.ClientData.ValSelectedSet}',Catalog='${sectionBinding.ClientData.ValCatalog}',CodeGroup='${sectionBinding.ClientData.ValCodeGroup}',Code='${sectionBinding.ClientData.ValCode}')`,
                        },
                    });
                }
                const isInspValuationNavExist = checkIsInspValuationNavExist(sectionBinding);
                if (isInspValuationNavExist) {
                    createLinks.push({
                        'Property': 'InspValuation_Nav',
                        'Target': {
                            'EntitySet': 'InspectionCatalogValuations',
                            'ReadLink': `InspectionCatalogValuations('${sectionBinding.ClientData.Valuation}')`,
                        },
                    });
                }

                let updateLinks = [];
                if (Object.prototype.hasOwnProperty.call(sectionBinding,'InspCode_Nav') && !libVal.evalIsEmpty(sectionBinding.InspCode_Nav)) {
                    updateLinks.push({
                        'Property': 'InspCode_Nav',
                        'Target': {
                            'EntitySet': 'InspectionCodes',
                            'ReadLink': `InspectionCodes(Plant='${sectionBinding.ClientData.Plant}',SelectedSet='${sectionBinding.ClientData.ValSelectedSet}',Catalog='${sectionBinding.ClientData.ValCatalog}',CodeGroup='${sectionBinding.ClientData.ValCodeGroup}',Code='${sectionBinding.ClientData.ValCode}')`,
                        },
                    });
                }
                if (Object.prototype.hasOwnProperty.call(sectionBinding,'InspCode_Nav') && !libVal.evalIsEmpty(sectionBinding.InspValuation_Nav)) {
                    updateLinks.push({
                        'Property': 'InspValuation_Nav',
                        'Target': {
                            'EntitySet': 'InspectionCatalogValuations',
                            'ReadLink': `InspectionCatalogValuations('${sectionBinding.ClientData.Valuation}')`,
                        },
                    });
                }

                return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointValuationUpdate.action', 'Properties': {
                    'Target':
                    {
                        'EntitySet' : 'InspectionPoints',
                        'Service' : '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': sectionBinding['@odata.readLink'],
                    },
                    'Properties':
                    {
                        'ValSelectedSet': sectionBinding.ClientData.ValSelectedSet,
                        'ValCatalog': sectionBinding.ClientData.ValCatalog,
                        'ValCode': sectionBinding.ClientData.ValCode,
                        'ValCodeGroup': sectionBinding.ClientData.ValCodeGroup,
                        'ValuationStatus': sectionBinding.ClientData.Valuation,
                        'Plant': sectionBinding.ClientData.Plant,
                    },
                    'Headers':
                    {
                        'OfflineOData.TransactionID': '{{#Property:InspectionLot}}',
                    },
                    'ValidationRule': '',
                    'CreateLinks': createLinks,
                    'UpdateLinks': updateLinks,
                }}).catch(() => {
                    return Promise.resolve();
                });
            });
        }
        return Promise.resolve();
    }).then(() => {
        return InspectionPointsChangeSetOnSuccess(context);
    });

}

function checkIsInspCodeNavEmpty(sectionBinding) {
    return Object.prototype.hasOwnProperty.call(sectionBinding,'InspCode_Nav') && libVal.evalIsEmpty(sectionBinding.InspCode_Nav);
}

function checkIsInspValuationNavExist(sectionBinding) {
    return Object.prototype.hasOwnProperty.call(sectionBinding,'InspValuation_Nav') && (libVal.evalIsEmpty(sectionBinding.InspValuation_Nav) || libVal.evalIsEmpty(sectionBinding.InspValuation_Nav.Valuation));
}
