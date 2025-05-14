import libThis from './StatusUIGenerator';

/**
 * @typedef ObjectCardActionItem
 * @prop {string} Status
 * @prop {string} Title
 * @prop {string} TransitionType
 */

/**
 * @typedef FioriToolbarItem
 * @prop {string} _Name
 * @prop {string} _Type
 * @prop {string} Title
 * @prop {string} OnPress Common rule reference
 * @prop {FIORI_TOOLBAR_BUTTON_TYPE} ButtonType
 * @prop {FIORI_TOOLBAR_BUTTON_SEMANTIC} Semantic
 */

/**
 * @typedef ContextMenuItem
 * @prop {string} _Name
 * @prop {string} Image
 * @prop {string} Text
 * @prop {string} Mode
 * @prop {string} Style
 * @prop {string} [OnSwipe] Common rule reference
 */

/**
 * @enum {string}
 */
const FIORI_TOOLBAR_BUTTON_TYPE = {
    PRIMARY: 'Primary',
    SECONDARY: 'Secondary',
    TEXT: 'Text',
};

/**
 * @enum {string}
 */
const FIORI_TOOLBAR_BUTTON_SEMANTIC = {
    NORMAL: 'Normal',
    TINT: 'Tint',
    NEGATIVE: 'Negative',
};

export default class StatusUIGenerator {

    /**
     * Get transition text for status UI item
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {Object} statusOption 
     * @returns {string}
     */
    static getTransitionText(context, statusOption) {
        // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
        return statusOption.TransitionTextKey ?
            context.localizeText(statusOption.TransitionTextKey) :
            statusOption.OverallStatusLabel;
    }

    /**
     * Creates object for toolbar item
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {Object} statusOption 
     * @param {import('./MobileStatusGenerator').StatusOverride} override
     * @returns {FioriToolbarItem}
     */
    static createToolbarItem(context, statusOption, override) {
        const Title = override.TransitionText || libThis.getTransitionText(context, statusOption);
        
        // If option is not data driven, get all props from override
        if (override.ExtraOption) {
            return {
                _Name: `${override.TransitionType}_${override.Status}`,
                _Type: 'FioriToolbarItem.Type.Button',
                Title,
                OnPress: '/SAPAssetManager/Rules/MobileStatus/RunMobileStatusUpdateSequence.js',
                ButtonType: libThis.getFioriToolbarButtonType(override.TransitionType),
                Semantic: libThis.getFioriToolbarButtonSemantic(override.TransitionType),
            };
        }

        return {
            _Name: `${statusOption.TransitionType}_${statusOption.MobileStatus}`,
            _Type: 'FioriToolbarItem.Type.Button',
            Title,
            OnPress: '/SAPAssetManager/Rules/MobileStatus/RunMobileStatusUpdateSequence.js',
            ButtonType: libThis.getFioriToolbarButtonType(statusOption.TransitionType),
            Semantic: libThis.getFioriToolbarButtonSemantic(statusOption.TransitionType),
        };
    }
    
    /**
     * Creates object for context menu item
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {Object} statusOption 
     * @param {import('./MobileStatusGenerator').StatusOverride} override
     * @returns {ContextMenuItem}
     */
    static createContextMenuItem(context, statusOption, override) {
        const transitionText = override.TransitionText || libThis.getTransitionText(context, statusOption);
        
        // If option is not data driven, get all props from override
        if (override.ExtraOption) {
            return {
                _Name: `${override.TransitionType}_${override.Status}`,
                Image: override.ContextMenu_Icon || '',
                Text: transitionText,
                Mode: 'Normal',
                TransitionType: override.TransitionType,
            };
        }

        return {
            _Name: `${statusOption.TransitionType}_${statusOption.MobileStatus}`,
            Image: override.ContextMenu_Icon || '',
            Text: transitionText,
            Mode: override.ContextMenu_Mode || 'Normal',
            Style: override.ContextMenu_Style || '',
            TransitionType: statusOption.TransitionType,
        };
    }

    /**
     * Creates object for object card button
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {Object} statusOption 
     * @param {import('./MobileStatusGenerator').StatusOverride} override
     * @returns {ObjectCardActionItem}
     */
    static createObjectCardActionItem(context, statusOption, override) {
        const Title = override.TransitionText || libThis.getTransitionText(context, statusOption);
        
        // If option is not data driven, get all props from override
        if (override.ExtraOption) {
            return {
                Status: override.Status,
                Title,
                TransitionType: override.TransitionType,
            };
        }

        return {
            Status: statusOption.MobileStatus,
            Title,
            TransitionType: statusOption.TransitionType,
        };
    }
    
    /**
     * Creates UI item based on current proxy type
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {...*} params 
     * @returns {FioriToolbarItem | ObjectCardActionItem | ContextMenuItem}
     */
    static createUIItem(context, ...params) {
        const proxyName = context.constructor.name;

        switch (proxyName) {
            case 'PageProxy':
                return libThis.createToolbarItem(context, ...params);
            case 'ObjectCardActionItemProxy':
            case 'ObjectCardOverflowButtonProxy':
            case 'ObjectCardCollectionSectionProxy':
            case 'SectionedTableProxy':
                return libThis.createObjectCardActionItem(context, ...params);
            case 'SelectableSectionProxy':
                return libThis.createContextMenuItem(context, ...params);
            default:
                return libThis.createToolbarItem(context, ...params);
        }
    }
    
    /**
     * Get Fiori Toolbar button type based on TransitionType
     * @param {string} transitionType 
     * @returns {FIORI_TOOLBAR_BUTTON_TYPE}
     */
    static getFioriToolbarButtonType(transitionType) {
        switch (transitionType) {
            case 'P':
                return FIORI_TOOLBAR_BUTTON_TYPE.PRIMARY;
            case 'N':
            case 'S':
                return FIORI_TOOLBAR_BUTTON_TYPE.SECONDARY;
            default:
                return FIORI_TOOLBAR_BUTTON_TYPE.TEXT;
        }
    }
    
    /**
     * Get Fiori Toolbar button semantic based on TransitionType
     * @param {string} transitionType 
     * @returns {FIORI_TOOLBAR_BUTTON_SEMANTIC}
     */
    static getFioriToolbarButtonSemantic(transitionType) {
        if (transitionType) {
            return transitionType === 'N' ?
                FIORI_TOOLBAR_BUTTON_SEMANTIC.NEGATIVE :
                FIORI_TOOLBAR_BUTTON_SEMANTIC.TINT;
        }

        return FIORI_TOOLBAR_BUTTON_SEMANTIC.NORMAL;
    }

    /**
     * Reorder status items based on TransitionType where Primary is first and Negative is last
     * @param {Array<FioriToolbarItem> | Array<ContextMenuItem>} items 
     */
    static orderItemsByTransitionType(items) {
        const transitionTypesOrder = ['P', 'S', 'T', 'N'];
        const getMenuItemIndex = (transitionType) => {
            let index = transitionTypesOrder.findIndex(orderItem => orderItem === transitionType);
            
            //If no transition type, let it be the last option
            if (index === -1) {
                index = transitionTypesOrder.length;
            }
            return index;
        };
    
        items.sort((a, b) => {
            const idxA = getMenuItemIndex(a._Name?.split('_')[0]);
            const idxB = getMenuItemIndex(b._Name?.split('_')[0]);
    
            return idxA - idxB;
        });
    }
}
