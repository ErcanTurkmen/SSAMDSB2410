import CommonLibrary from '../../Common/Library/CommonLibrary';
import ProgressTrackerOnDataChanged from '../../TimelineControl/ProgressTrackerOnDataChanged';
import Caption from './Details/Caption';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export const OperationalCycleSpec = Object.freeze({
    TaggingCycleWithTemporaryUntaggingPhase: '',
    TestCycle: '1',
    TaggingCycleWithoutTemporaryUntaggingPhase: '2',
    NoItems: 'X',
});

export const OpItemMobileStatusCodes = Object.freeze({
    Tag: 'TAG',  // TAG
    TagPrinted: 'TAGPRINT',  // PTAG
    InitialTaggingStatus: 'INITIALTAG',  // ITG
    Untag: 'UNTAG',  // BUG
    Tagged: 'TAGGED',  // ETG
    UnTagged: 'UNTAGGED',
    UntagTemporarily: 'UNTAGT', //BTUG
    TestTagPrinted: 'TAGPRINTT', //PTST
});

export const ItemCategories = Object.freeze({
    EquipmentCategory: 'E',
    FlocCategory: 'F',
    WithoutMasterData: 'N',
    Comment: 'C',
});

const StatusesForUntaggingCondition = Object.freeze([OpItemMobileStatusCodes.Tagged, OpItemMobileStatusCodes.UntagTemporarily, OpItemMobileStatusCodes.TestTagPrinted, OpItemMobileStatusCodes.Untag]);

function HasMobileStatus(operationalItem, mobileStatus) {
    return operationalItem.PMMobileStatus?.MobileStatus === mobileStatus;
}

function IsPrintTagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.PrintTag === 'X';
}

function IsTagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.Tag === 'X';
}

export async function IsTaggingActive(context, operationalItem) {
    const [tagPrintedStatus, initialTaggingStatus, tagStatus, printTagChecked, tagChecked, isDownlineSeqChecked] = [
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.TagPrinted),
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.InitialTaggingStatus),
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.Tag),
        IsPrintTagChecked(operationalItem),
        IsTagChecked(operationalItem),
        CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue()),
    ];
    if (await isDownlineSeqChecked) {
        return (tagPrintedStatus && !printTagChecked) || (initialTaggingStatus && tagChecked && printTagChecked) || (tagStatus && !tagChecked && printTagChecked);
    }

    return false;
}

function IsUntagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.Untag === 'X';
}

function IsAllRelatedWorkPermitClosed(context, operationalItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${operationalItem['@odata.readLink']}/WCMDocumentHeaders/WCMApplicationDocuments`, [], '$expand=WCMApplications')
        .then(wcmApplicationDocuments => Array.from(wcmApplicationDocuments, wcmApplicationDocument => wcmApplicationDocument.WCMApplications))
        .then(wcmApplications => {
            const closedStatus = context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Closed.global').getValue();
            return wcmApplications.every(wcmApplication => wcmApplication.ActualSystemStatus === closedStatus);
        });
}

export async function IsUntaggingActive(context, operationalItem) {
    const [untagStatus, taggedStatus, untagChecked, isAllRelatedWorkPermitClosed, isDownlineSeqChecked] = [
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.Untag),
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.Tagged),
        IsUntagChecked(operationalItem),
        IsAllRelatedWorkPermitClosed(context, operationalItem),
        CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/UntaggedParameterName.global').getValue()),
    ];

    if (await isDownlineSeqChecked) {
        return (untagStatus && !untagChecked) || (taggedStatus && untagChecked && await isAllRelatedWorkPermitClosed);
    }

    return false;
}

/**
 *  @param {IClientAPI} context
 *  @param {WCMDocumentItem} operationalItem
 *  @param {string} status */
export async function CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, status) {
    const isTaggedStatus = status === context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue();
    const seqProperty = isTaggedStatus ? 'TagSequence' : 'UntSequence';
    const currentSeqNumber = isTaggedStatus ? +operationalItem.TagSequence : +operationalItem.UntSequence;

    for (const seqNum of [...Array(currentSeqNumber).keys()].reverse()) {
        const downlineSeqString = String(seqNum).padStart(5, '0');
        const prevSeqItems = await context.read('/SAPAssetManager/Services/AssetManager.service', `${operationalItem['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, [], `$expand=PMMobileStatus&$filter=${seqProperty} eq '${downlineSeqString}'`);
        if (ValidationLibrary.evalIsEmpty(prevSeqItems) || prevSeqItems.every((/** @type {WCMDocumentItem} */ item) => item.ItemCategoryCC === '')) {  // '' == Comment, Comments aren't taggable
            continue;  // check next downline sequence if no operational items
        }
        return !prevSeqItems.filter(item => item.ItemCategoryCC !== '').some((/** @type {WCMDocumentItem} */ item) => item.PMMobileStatus?.MobileStatus !== status);
    }
    return true;  // there weren't any previous items that needed (un)tagging
}

function GetQueryOptionsForPrevNextItem(binding, next = true) {
    return `$orderby=Sequence ${next ? 'asc' : 'desc'}&$filter=Sequence ${next ? 'gt' : 'lt'} '${binding.Sequence}'`;
}

export function IsPrevNextButtonEnabled(context, next = true) {
    const binding = context.binding;
    const query = GetQueryOptionsForPrevNextItem(binding, next);
    return CommonLibrary.getEntitySetCount(context, `${binding['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, query)
        .then(count => !!count);
}

/*
    Handles Next/Previous toolbar button on press action
    @param {FioriToolbarItemButtonControlProxy} toolbarButtonProxy
    @returns {Promise}
**/
export function PrevNextItemButtonOnPress(toolbarButtonProxy) {
    const next = toolbarButtonProxy.getName() === 'NextItem';

    if (!toolbarButtonProxy.getEnabled()) {
        return Promise.reject();
    }

    const pageProxy = toolbarButtonProxy.getPageProxy();
    pageProxy.showActivityIndicator();
    const binding = pageProxy.binding;
    return GetAndUpdateOperationalItem(pageProxy, `${binding['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, GetQueryOptionsForPrevNextItem(binding, next));
}

export async function GetAndUpdateOperationalItem(context, entitySet, query = '') {
    const toolbar = context.getFioriToolbar();
    const pageProxy = context.getPageProxy();
    const sectionedTable = pageProxy.getControl('SectionedTable');

    const queryOptions = `${query}${query ? '&' : ''}$expand=WCMDocumentHeaders,WCMOpGroup_Nav,PMMobileStatus`;
    const result = await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions);

    // rewrite binding in current context, page level, sectioned table, toolbar and progress tracker extension
    const newBinding = result.getItem(0);
    context._context.binding = newBinding;
    pageProxy._context.binding = context._context.binding;
    sectionedTable._context.binding = pageProxy._context.binding;
    toolbar._context.binding = pageProxy._context.binding;

    // redraw controls with new binding
    await toolbar.reset();
    sectionedTable.redraw();
    ProgressTrackerOnDataChanged(context);

    pageProxy.setCaption(await Caption(context));
    context.dismissActivityIndicator();
}

export function IsOperationalItemInUntagging(context) {
    const binding = context.binding;
    return (ValidationLibrary.evalIsEmpty(binding.PMMobileStatus) ? context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/PMMobileStatus`, [], '').then(result => result.getItem(0)) : Promise.resolve(binding.PMMobileStatus)).then(status => {
        if (ValidationLibrary.evalIsEmpty(status)) {
            return false;
        }
        return StatusesForUntaggingCondition.includes(status.MobileStatus);
    });
}

/** @param {WCMDocumentItem} wcmDocumentItem  */
export function GetOperationalItemTechObjectId(context, wcmDocumentItem) {
    const itemCategory = wcmDocumentItem.ItemCategory || wcmDocumentItem.ItemCategoryCC;
    if (itemCategory === ItemCategories.EquipmentCategory) {
        return Promise.resolve(wcmDocumentItem.Equipment);
    } else if (itemCategory === ItemCategories.FlocCategory) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${wcmDocumentItem['@odata.readLink']}/MyFunctionalLocations`, ['FuncLocId'], '')
            .then(floc => ValidationLibrary.evalIsEmpty(floc) ? '' : floc.getItem(0).FuncLocId);
    } else if (itemCategory === ItemCategories.WithoutMasterData) {
        return Promise.resolve(wcmDocumentItem.TechObject);
    }

    return Promise.resolve('-');
}


export const WCMDocumentItemMobileStatusType = 'WCMDOCITEM';
