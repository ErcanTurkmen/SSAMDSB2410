import CommonLibrary from '../../Common/Library/CommonLibrary';
import RelatedSafetyCertificatesReadLink from './RelatedSafetyCertificatesReadLink';
import { GetSearchStringFilterTerm, ListPageGetCombinedQueryOptions } from '../Common/ListPageQueryOptionsHelper';
import libFilter from '../../Filter/FilterLibrary';
import ModifyListViewTableDescriptionField from '../../LCNC/ModifyListViewTableDescriptionField';

/**
 * @typedef FilterCriteriaData
 * @prop {string} field
 * @prop {string[]} values
 */

const OperationalCycleSpecification = Object.freeze({
    TaggingCycleWithTemporaryUntaggingPhase: '',
    TestCycle: '1',
    TaggingCycleWithoutTemporaryUntaggingPhase: '2',
    NoItems: 'X',
});

export default class SafetyCertificatesLibrary {

    static get LOTOCertificateUsageTypes() {
        return [
            OperationalCycleSpecification.TaggingCycleWithTemporaryUntaggingPhase,
            OperationalCycleSpecification.TestCycle,
            OperationalCycleSpecification.TaggingCycleWithoutTemporaryUntaggingPhase,
        ];
    }

    /** @returns {FilterCriteriaData[]} */
    static getLOTOCertificatesFiltersCriteria() {
        return [{
            field: 'WCMDocumentUsages/Specification',
            values: this.LOTOCertificateUsageTypes,
        }];
    }

    static getOTHERCertificatesFiltersCriteria() {
        return [{
            field: 'WCMDocumentUsages/Specification',
            values: [OperationalCycleSpecification.NoItems],
        }];
    }

    static GetOtherCertificateFilterTerm() {
        return this.createQueryStringFromCriterias(this.getOTHERCertificatesFiltersCriteria());
    }

    static GetLOTOCertificateFilterTerm() {
        return this.createQueryStringFromCriterias(this.getLOTOCertificatesFiltersCriteria());
    }

    /**
     * @param {FilterCriteriaData[]} filterCriterias
     * @returns {string} */
    static createQueryStringFromCriterias(filterCriterias) {
        return filterCriterias.map(filterCriteria => filterCriteria.values.map(value => `${filterCriteria.field} eq '${value}'`).join(' or '))
            .map(criteriaString => `(${criteriaString})`)
            .join(' and ');
    }

    static get LOTOCertificatesTranslationKeysWithCount() {
        return ['certificates_x', 'certificates_x_x'];
    }

    static get OtherCertificatesTranslationKeysWithCount() {
        return ['other_certificates_x', 'other_certificates_x_x'];
    }

    /**
     * Get certificates count
     * @param {clientAPI} context MDK context
     * @returns {Number} certificates count
     */
    static getCertificatesCount(context, filterQuery) {
        return CommonLibrary.getEntitySetCount(context, 'WCMDocumentHeaders', filterQuery && `$filter=${filterQuery}`);
    }

    /**
     * Get certificates label with count
     * @param {clientAPI} context MDK context
     * @returns {String} certificates label with count
     */
    static getCertificatesLabelWithCount(context, translations, filterQuery) {
        return this.getCertificatesCount(context, filterQuery).then(count => {
            return context.localizeText(translations[0], [count]);
        });
    }

    static getLOTOCertificatesCount(context) {
        return CommonLibrary.getEntitySetCount(context, 'WCMDocumentHeaders', `$filter=${this.createQueryStringFromCriterias(this.getLOTOCertificatesFiltersCriteria())}`);
    }

    /**
     * Get certificates list page caption with count
     * @param {clientAPI} context MDK context
     * @returns {String} certificates list page caption with count
     */
    static getCertificatesListCaption(context, translations, filterTerm) {
        const filterQueryStr = filterTerm && `$filter=${filterTerm}`;
        const totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', RelatedSafetyCertificatesReadLink(context.binding), filterQueryStr);
        const countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', RelatedSafetyCertificatesReadLink(context.binding), filterQueryStr);

        return Promise.all([totalCountPromise, countPromise]).then(([totalCount, count]) => {
            return count === totalCount ? context.localizeText(translations[0], [totalCount]) : context.localizeText(translations[1], [count, totalCount]);
        });
    }

    static getRelatedWorkPermitFilterTerm(context) {
        const binding = context.binding;
        return binding?.['@odata.type'] === '#sap_mobile.WCMApplication' ? `WCMApplicationDocuments/any(i:i/WCMApplication eq '${binding.WCMApplication}')` : '';
    }

    /**
     * Get certificates list page query options
     * @param {clientAPI} context MDK context
     * @returns {QueryBuilder} query builder with applied query options
     */
    static getCertificatesListQueryOptions(context, filterTerm) {
        const certificateListPageNames = ['EquipmentRelatedCertificateListViewPage', 'SafetyCertificatesListViewPage', 'FlocRelatedCertificateListViewPage', 'WorkPermitRelatedCertificateListViewPage'];
        const page = certificateListPageNames.includes(CommonLibrary.getPageName(context.getPageProxy())) ? context.getPageProxy() : undefined;

        // if navigated from work permit details page, filter by related work permit
        const relatedWorkPermitFilterTerm = this.getRelatedWorkPermitFilterTerm(context);

        // sectionedTable is undefined in case if page is undefined too
        const sectionedTable = page && context;
        const toExpand = ['WCMApplicationDocuments,WCMDocumentPartners,WCMDocumentPartners/Employee_Nav,WCMDocumentUsages'];
        const navigationRelatedFilterTerms = [relatedWorkPermitFilterTerm];
        const extraFilters = [GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['WCMDocument', 'ShortText'], 'WCMDocumentHeader')];

        if (filterTerm) {
            extraFilters.push(filterTerm);
        }

        if (page) {
            libFilter.setFilterActionItemText(context, context.evaluateTargetPath(`#Page:${CommonLibrary.getPageName(context.getPageProxy())}`), sectionedTable);
        }

        return ListPageGetCombinedQueryOptions(context, toExpand, navigationRelatedFilterTerms, extraFilters);
    }

    /**
     * Navigate to certificates list page with predefined rules for Caption, Filters and QueryOptions according to type
     * @param {clientAPI} context MDK context
     */
    static navigateToOtherCertificatesList(context) {
        const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WCM/SafetyCertificates/SafetyCertificatesListView.page');
        page.Caption = '$(L,other_certificates)';
        page._Name = 'OtherCertificatesListViewPage';
        const sectionedTable = page.Controls[0].Sections[0];
        sectionedTable.Target.QueryOptions = '/SAPAssetManager/Rules/WCM/SafetyCertificates/OtherCertificatesListViewQueryOption.js';
        sectionedTable.Header.Caption = '/SAPAssetManager/Rules/WCM/SafetyCertificates/OtherCertificatesListViewCountCaption.js';
        ModifyListViewTableDescriptionField(context.getPageProxy(), page, 'WCMDocumentHeader');
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/WCM/SafetyCertificatesListViewNav.action',
            'Properties': {
                'PageMetadata': page,
            },
        });
    }
}

export const WCMSystemStatuses = Object.freeze({
    InitialStatus: 'I0403',
    TagPrinted: 'I0405',
    Untag: 'I0407',
    Tag: 'I0404',
    Tagged: 'I0406',
    Created: 'I0098',
    Prepared: 'I0175',
    ChangeMode: 'I0445',
});

export const WCMCertificateMobileStatuses = Object.freeze({
    Prepared: 'PREPARED',
    Change: 'CHANGE',
    Tag: 'TAG',
    Tagged: 'TAGGED',
    Tagprint: 'TAGPRINT',
    Untag: 'UNTAG',
    Untagged: 'UNTAGGED',
});

export const WCMDocumentHeaderMobileStatusType = 'WCMDOCHEADER';
