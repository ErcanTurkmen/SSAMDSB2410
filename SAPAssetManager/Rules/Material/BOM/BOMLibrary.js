import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import IsOnlineFunctionalLocation from '../../FunctionalLocation/IsOnlineFunctionalLocation';
import ODataLibrary from '../../OData/ODataLibrary';

export default class {
    /**
     * BOM type code based on BoMFlag property
     */
    static get typeDirect() {
        return 'direct';
    }

    /**
     * BOM type code based on ConstType property
     */
    static get typeIndirect() {
        return 'indirect';
    }

    /**
     * Get BOM type
     * @param {object} binding FLOC/Equipment binding 
     * @returns {string} one of BOM types or empty string
     */
    static getBOMType(binding) {
        if (binding.BoMFlag === 'X') {
            return this.typeDirect;
        } else if (binding.ConstType) {
            return this.typeIndirect;
        } else {
            return '';
        }
    }

    /**
     * BOM facet visibility
     * @param {IClientAPI} context MDK context
     * @returns {boolean}
     */
    static isBOMVisible(context) {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/BOM.global').getValue())) {
            const bomType = this.getBOMType(context.binding);

            if (!libVal.evalIsEmpty(bomType)) {
                if (bomType === this.typeDirect) {
                    return true;
                } else if (bomType === this.typeIndirect) {
                    let service;
                    if (IsOnlineFunctionalLocation(context)) {
                        service = '/SAPAssetManager/Services/OnlineAssetManager.service';
                    }
                    return libCom.getEntitySetCount(context, 'Materials', `$filter=MaterialNum eq '${context.binding.ConstType}'`, service).then(count => {
                        return !!count;
                    });
                }
            }
            return false;
        }
        return false;
    }

    /**
     * Get BOM entity set and query options based on ODataType and BOM type
     * @param {IClientAPI} context MDK context 
     * @param {object} binding FLOC/Equipment binding 
     * @returns {object} object with entity set and query options
     */
    static getBOMEntitySetAndQueryOptions(context, binding) {
        const dataType = binding['@odata.type'];
        const isIndirectBOMType = this.getBOMType(binding) === this.typeIndirect;

        let bomEntitySet = isIndirectBOMType ? 'MaterialBOMs' : '';
        let bomFilter = isIndirectBOMType ? `MaterialNum eq '${binding.ConstType}'` : '';
        let bomQueryOptions = '$expand=BOMHeader_Nav/BOMItems_Nav&$filter=' + bomFilter;
        let bomItemsOnlineFilter = '';

        if (!isIndirectBOMType) {
            switch (dataType) {
                case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineEquipment.global').getValue():
                case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue():
                    bomEntitySet = 'EquipmentBOMs';
                    bomFilter = `EquipId eq '${binding.EquipId}'`;
                    break;
                case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineFunctionalLocation.global').getValue():
                case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue():
                    bomEntitySet = 'FunctionalLocationBOMs';
                    bomFilter = `FuncLocIdIntern eq '${binding.FuncLocIdIntern}'`;
                    break;
            }

            bomItemsOnlineFilter = bomFilter;
            bomQueryOptions += bomFilter;
        }

        return {
            bomEntitySet,
            bomQueryOptions,
            bomItemsOnlineFilter,
            bomFilter,
        };
    }

    /**
     * Nav action to offline/online BOM page based on ODataType, BOM type and existing BOM's data in local DB
     * @param {IClientAPI} context MDK context 
     * @returns {Promise} executeAction Promise
     */
    static BOMPageNav(context) {
        const self = this;
        const binding = context.binding;
        binding.Online = false;

        const {bomEntitySet, bomQueryOptions, bomItemsOnlineFilter} = this.getBOMEntitySetAndQueryOptions(context, binding);

        return context.read('/SAPAssetManager/Services/AssetManager.service', bomEntitySet, [], bomQueryOptions).then(bomResult => {
            if (!libVal.evalIsEmpty(bomResult)) {
                binding.HC_ROOT_CHILDCOUNT = bomResult.getItem(0).BOMHeader_Nav.BOMItems_Nav.length;
                context.getPageProxy().setActionBinding(context.binding);
                return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/BOMHierarchyControlPageNav.action');
            } else {
                binding.Online = true;
                binding.CreateOnlineODataAction = '/SAPAssetManager/Actions/OData/CreateOnlineOData.action';
                binding.OpenOnlineServiceAction = '/SAPAssetManager/Actions/OData/OpenOnlineService.action';
                context.showActivityIndicator(context.localizeText('online_search_activityindicator_text'));

                return ODataLibrary.initializeOnlineService(context).then(function() {
                    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', bomEntitySet, [], bomQueryOptions).then(onlineBOMResult => {
                        binding.HC_ROOT_CHILDCOUNT = 0;
                        if (!libVal.evalIsEmpty(onlineBOMResult)) {
                            const bomItemsOnlineFilterQuery = bomItemsOnlineFilter ? ` and ${bomItemsOnlineFilter}` : '';
                            return context.count('/SAPAssetManager/Services/OnlineAssetManager.service', 'BOMItems', 
                            `$filter=${self.getBOMItemsFilter(onlineBOMResult.getItem(0))}${bomItemsOnlineFilterQuery}`).then(count => {
                                binding.HC_ROOT_CHILDCOUNT = count;
                                context.getPageProxy().setActionBinding(binding);
                                context.dismissActivityIndicator();
                                return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/BOMHierarchyControlPageNavOnline.action');
                            });
                        }
                        context.getPageProxy().setActionBinding(binding);
                        context.dismissActivityIndicator();
                        return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/BOMHierarchyControlPageNavOnline.action');
                        
                    }).catch(function(err) {
                        Logger.error(`Failed to read BOMs with Online OData Service: ${err}`);
                        context.dismissActivityIndicator();
                    });
                }).catch(function(err) {
                    // Could not init online service
                    Logger.error(`Failed to initialize Online OData Service: ${err}`);
                    context.dismissActivityIndicator();
                    context.setValue(false);
                    context.setEditable(false);
                });
            }
        }).catch(function(err) {
            Logger.error(`Failed to get BOMItems count : ${err}`);
        });
    }

    /**
     * Get BOM Items filter string
     * @param {object} bom BOM data
     * @returns {string} filter string for BOM items
     */
    static getBOMItemsFilter(bom) {
        return `BOMId eq '${bom.BOMHeader_Nav.BOMId}' and BOMCategory eq '${bom.BOMHeader_Nav.BOMCategory}'`;
    }

    /**
     * Get BOM count
     * @param {IClientAPI} context MDK context 
     * @returns {Promise} BOM count
     */
    static getBOMCount(context) {
        const {bomEntitySet, bomFilter} = this.getBOMEntitySetAndQueryOptions(context, context.binding);

        return libCom.getEntitySetCount(context, bomEntitySet, `$filter=${bomFilter}`);
    }

    /**
     * Get BOM count with online service
     * @param {IClientAPI} context MDK context 
     * @returns {Promise} BOM count
     */
    static getBOMCountOnline(context) {
        const {bomEntitySet, bomFilter} = this.getBOMEntitySetAndQueryOptions(context, context.binding);

        return libCom.getEntitySetCountOnline(context, bomEntitySet, `$filter=${encodeURIComponent(bomFilter)}`);
    }

    /**
     * Get BOM Items query options
     * @param {IClientAPI} context MDK context 
     * @returns {string} BOM Items query options
     */
    static getBOMItemsQueryOptions(context) {
        const {bomEntitySet, bomQueryOptions} = this.getBOMEntitySetAndQueryOptions(context, context.binding.binding);
        const self = this;

        return context.read('/SAPAssetManager/Services/AssetManager.service', bomEntitySet, [], bomQueryOptions).then(function(results) {
            if (results.length > 0) {
                return `$filter=${self.getBOMItemsFilter(results.getItem(0))}&$orderby=ItemId`;
            }
            return '';
        });
    }

    /**
     * Get BOM Items query options with online service
     * @param {IClientAPI} context MDK context 
     * @returns {string} BOM Items query options
     */
    static getBOMItemsQueryOptionsOnline(context) {
        const {bomEntitySet, bomQueryOptions, bomItemsOnlineFilter} = this.getBOMEntitySetAndQueryOptions(context, context.binding.binding);
        const self = this;

        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
            return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', bomEntitySet, [], bomQueryOptions).then(function(results) {
                if (results.length > 0) {
                    const bomItemsOnlineFilterQuery = bomItemsOnlineFilter ? ` and ${bomItemsOnlineFilter}` : '';
                    const filter = `${self.getBOMItemsFilter(results.getItem(0))}${bomItemsOnlineFilterQuery}`;
                    return `$filter=${encodeURIComponent(filter)}`;
                }
                return '';
            });
        });
    }
} 
