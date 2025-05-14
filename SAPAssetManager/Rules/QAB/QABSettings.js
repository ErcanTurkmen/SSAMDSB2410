import Logger from '../Log/Logger';
import libDoc from '../Documents/DocumentLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import MeasuringPointsTakeReadingsIsVisible from '../Measurements/Points/MeasuringPointsTakeReadingsIsVisible';
import IsPurchaseRequisitionVisible from '../Inventory/PurchaseRequisition/Technicians/IsPurchaseRequisitionVisible';
import IsGISEnabled from '../Maps/IsGISEnabled';
import IsS4Visible from '../S4RelatedHistories/IsS4Visible';
import IsOnlineSearchEnabled from '../OnlineSearch/IsOnlineSearchEnabled';
import NetworkLib from '../Common/Library/NetworkMonitoringLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import EnableWorkOrderCreate from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import ExpensesVisible from '../ServiceOrders/Expenses/ExpensesVisible';
import MileageIsEnabled from '../ServiceOrders/Mileage/MileageIsEnabled';
import MileageAddCheckIfObjectIsCompleted from '../ServiceOrders/Mileage/MileageAddCheckIfObjectIsCompleted';
import S4ErrorsLibrary from '../S4Errors/S4ErrorsLibrary';
import RelatedWorkOrdersAreVisible from '../Notifications/Details/WorkOrderHistoriesAreVisible';
import IsWCMSafetyCertificateEnabled from '../UserFeatures/IsWCMSafetyCertificateEnabled';
import EnableAttachment from '../UserAuthorizations/Attachments/EnableAttachment';

/**
 * @typedef ChipProps
 * @prop {string?} Label
 * @prop {string?} Icon
 * @prop {Boolean?} IsIconVisible
 * @prop {Boolean?} IsButtonVisible
 * @prop {Boolean?} IsButtonEnabled
 * @prop {string?} Action
 * @prop {Boolean?} IsButtonVisibleBySettings
 * @prop {string?} _Name
 * @prop {Boolean?} IsEnabled
 */

class QABSettingsHelpers {
    constructor(context) {
        this._context = context;
    }

    /**
     * Create QAB chip
     * @param {ChipProps?} props QAB chip properties
     * @param {String} props.Label Chip label. Used in QAB extension and as label on QAB settings page, must be set if it is not Settings button
     * @param {String} props.Icon Chip icon. Used in QAB extension only, must be set since all buttons displayed with icon
     * @param {Boolean} props.IsIconVisible Chip icon visibility. Used in QAB extension only, hardcoded as true since all buttons displayed with icon
     * @param {Boolean} props.IsButtonVisible Chip button visibility. Used in QAB extension only, determines if button is visible or not
     * @param {Boolean} props.IsButtonEnabled Chip button enabled. Used in QAB extension only, determines if button is enabled or not, hardcoded as true since all visbile buttons should be enabled
     * @param {String} props.Action Chip action. Used in QAB extension only, determines action to be executed on button press
     * @param {Boolean} props.IsButtonVisibleBySettings Chip button visibility by settings. Used only in purpose to determine button visiblity by settings
     * @param {String} props._Name Chip name. Used only for settings as unique key of button, must be unique per page
     * @param {Boolean} props.IsEnabled Chip enabled. Determines if chip is enabled or not by feature, app param and etc
     * @returns
     */
    _createChip(props = {}) {
        return {
            ...{
                'IsIconVisible': true,
                'IsButtonEnabled': true,
                'IsButtonVisibleBySettings': true,
                'IsButtonVisible': true,
                'IsEnabled': true,
            }, ...props,
        };
    }

    _createAddNotificationChip(/** @type {ChipProps?} */ props = {}) {
        const enableCreate = EnableNotificationCreate(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('create_notification'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddNotification.png,/SAPAssetManager/Images/QABAddNotification.android.png)',
                'IsEnabled': enableCreate,
                'IsButtonEnabled': enableCreate,
                'IsButtonVisible': enableCreate,
                'Action': '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateChangeSetNav.js',
                '_Name': 'ADD_NOTIFICATION',
            }, ...props,
        });
    }

    _createAddWorkOrderChip(/** @type {ChipProps?} */ props = {}) {
        const enableCreate = EnableWorkOrderCreate(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('create_workorder'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddWO.png,/SAPAssetManager/Images/QABAddWO.android.png)',
                'IsEnabled': enableCreate,
                'IsButtonEnabled': enableCreate,
                'IsButtonVisible': enableCreate,
                'Action': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateNav.js',
                '_Name': 'ADD_WORK_ORDER',
            }, ...props,
        });
    }

    _createAddNotificationChipWCMDetailsPage() {
        return this._createAddNotificationChip({
            'Label': this._context.localizeText('add_notification'),
            'Action': '/SAPAssetManager/Rules/WCM/QAB/WCMQABCreateNotification.js',
        });
    }

    _createViewMapChip(/** @type {ChipProps?} */ props = {}) {
        const isMapEnabled = IsGISEnabled(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('view_map'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABViewMap.png,/SAPAssetManager/Images/QABViewMap.android.png)',
                'IsButtonEnabled': isMapEnabled,
                'Action': '',
                '_Name': 'VIEW_MAP',
            }, ...props,
        });
    }

    async _createDownloadDocumentsChip(/** @type {ChipProps?} */ props = {}) {
        const documentsIsVisible = EnableAttachment(this._context);
        const enable = libCom.getAppParam(this._context, 'USER_AUTHORIZATIONS', 'Enable.MD.Create') === 'Y';
        const noAvailableDocuments = await libDoc.checkIfNoDocumentsAvailableForDownload(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('qab_download_documents'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABDonwloadAttachments.png,/SAPAssetManager/Images/QABDonwloadAttachments.android.png)',
                'IsEnabled': enable,
                'IsButtonEnabled': enable && documentsIsVisible && !noAvailableDocuments,
                'IsButtonVisible': enable,
                'Action': '/SAPAssetManager/Rules/Documents/DownloadDocuments/DownloadDocumentsNav.js',
                '_Name': 'DOWNLOAD_DOCUMENTS',
            }, ...props,
        });
    }

    _createRecordTimeChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('record_time'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddTime.png,/SAPAssetManager/Images/QABAddTime.android.png)',
                'Action': '',
                '_Name': 'RECORD_TIME',
            }, ...props,
        });
    }

    async _createTakeReadingsChip(/** @type {ChipProps?} */ props = {}) {
        const PMMeasurementEnabled = userFeaturesLib.isFeatureEnabled(this._context, this._context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue());
        const enable = libCom.getAppParam(this._context, 'USER_AUTHORIZATIONS', 'Enable.MD.Create') === 'Y' && ((PersonaLibrary.isMaintenanceTechnician(this._context) || PersonaLibrary.isFieldServiceTechnicianInCSMode(this._context)));
        return this._createChip({
            ...{
                'Label': this._context.localizeText('take_readings'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABTakeReadings.png,/SAPAssetManager/Images/QABTakeReadings.android.png)',
                'IsEnabled': enable && PMMeasurementEnabled,
                'IsButtonEnabled': enable && await MeasuringPointsTakeReadingsIsVisible(this._context),
                'IsButtonVisible': enable && PMMeasurementEnabled,
                'Action': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointsDataEntryNavWrapper.js',
                '_Name': 'TAKE_READINGS',
            }, ...props,
        });
    }

    _createAddServiceOrderChip(/** @type {ChipProps?} */ props = {}) {
        const enable = IsS4Visible(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('qab_create_service_order'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddWO.png,/SAPAssetManager/Images/QABAddWO.android.png)',
                'IsButtonVisible': enable,
                'IsButtonEnabled': enable,
                'IsEnabled': enable,
                'Action': '/SAPAssetManager/Rules/ServiceOrders/CreateUpdate/ServiceOrderCreateNav.js',
                '_Name': 'ADD_SERVICE_ORDER',
            }, ...props,
        });
    }

    _createAddServiceRequestChip(/** @type {ChipProps?} */ props = {}) {
        const enable = IsS4Visible(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('qab_create_service_request'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddNotification.png,/SAPAssetManager/Images/QABAddNotification.android.png)',
                'IsButtonVisible': enable,
                'IsButtonEnabled': enable,
                'IsEnabled': enable,
                'Action': '/SAPAssetManager/Rules/ServiceOrders/CreateUpdate/ServiceRequestCreateNav.js',
                '_Name': 'ADD_SERVICE_REQUEST',
            }, ...props,
        });
    }

    _createAddServiceConfirmationChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('qab_create_service_confirmation'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddConfirmation.png,/SAPAssetManager/Images/QABAddConfirmation.android.png)',
                'Action': '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/ServiceConfirmationCreateNav.js',
                '_Name': 'ADD_SERVICE_CONFIRMATION',
            }, ...props,
        });
    }

    _createAddWCMNoteChip(/** @type {ChipProps?} */ props = {}) {
        return this._createAddNoteChip({
            ...{
                'Action': '/SAPAssetManager/Rules/WCM/WCMNotes/WCMNoteAddNav.js',
                '_Name': 'ADD_WCM_NOTE',
            }, ...props,
        });
    }

    _createAddPurchaseRequisitionChip(props = {}) {
        const isEnabled = IsPurchaseRequisitionVisible(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('create_purchase_requisition'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddPurchaseReq.png,/SAPAssetManager/Images/QABAddPurchaseReq.android.png)',
                'IsButtonVisible': isEnabled,
                'IsEnabled': isEnabled,
                'Action': '/SAPAssetManager/Rules/Inventory/PurchaseRequisition/AddPurchaseRequisitionNav.js',
                '_Name': 'ADD_PURCHASE_REQUISITION',
            }, ...props,
        });
    }

    _onlineSearch(/** @type {ChipProps?} */ props = {}) {
        const enable = IsOnlineSearchEnabled(this._context) &&
            (PersonaLibrary.isFieldServiceTechnicianPro(this._context) ||
                PersonaLibrary.isMaintenanceTechnician(this._context));
        const isNetworkConnected = NetworkLib.isNetworkConnected(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('online_search'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABOnlineSearch.png,/SAPAssetManager/Images/QABOnlineSearch.android.png)',
                'IsEnabled': enable,
                'IsButtonEnabled': isNetworkConnected && enable,
                'IsButtonVisible': enable,
                'Action': '/SAPAssetManager/Rules/OnlineSearch/ExecuteNavToOnlineSearchPage.js',
                '_Name': 'ONLINE_SEARCH',
            }, ...props,
        });
    }

    _createAddPartChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('add_part'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddPart.png,/SAPAssetManager/Images/QABAddPart.android.png)',
                'Action': '/SAPAssetManager/Rules/Parts/CreateUpdate/PartCreateNav.js',
                '_Name': 'ADD_PART',
            }, ...props,
        });
    }

    _createAddNoteChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('add_note'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddNote.png,/SAPAssetManager/Images/QABAddNote.android.png)',
                'Action': '/SAPAssetManager/Rules/Notes/NoteCreateNav.js',
                '_Name': 'ADD_NOTE',
            }, ...props,
        });
    }

    _createAddReminderChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('add_reminder'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddReminder.png,/SAPAssetManager/Images/QABAddReminder.android.png)',
                'Action': '/SAPAssetManager/Rules/Reminders/ReminderCreateNav.js',
                '_Name': 'ADD_REMINDER',
            },
            ...props,
        });
    }

    async _createAddExpenseChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('add_expense'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddExpense.png,/SAPAssetManager/Images/QABAddExpense.android.png)',
                'Action': '/SAPAssetManager/Rules/Expense/CreateUpdate/ExpenseCreateNav.js',
                '_Name': 'ADD_EXPENSE',
                'IsEnabled': ExpensesVisible(this._context),
                'IsButtonEnabled': await MileageAddCheckIfObjectIsCompleted(this._context),
            },
            ...props,
        });
    }

    async _createAddMileageChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('add_mileage'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABMileage.png,/SAPAssetManager/Images/QABMileage.android.png)',
                'Action': '/SAPAssetManager/Rules/ServiceOrders/Mileage/MileageAddNavCheckOnlyUnsavedChanges.js',
                '_Name': 'ADD_MILEAGE',
                'IsEnabled': MileageIsEnabled(this._context),
                'IsButtonEnabled': await MileageAddCheckIfObjectIsCompleted(this._context),
            },
            ...props,
        });
    }

    _createS4ErrorsChip() {
        return this._createChip({
            'Label': this._context.localizeText('errors'),
            'IsEnabled': true,
            'IsButtonEnabled': S4ErrorsLibrary.isS4ObjectHasErrorsInBinding(this._context),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABS4Errors.png,/SAPAssetManager/Images/QABS4Errors.android.png)',
            'IsButtonVisible': true,
            'Action': '/SAPAssetManager/Actions/ServiceOrders/S4ErrorsListPageNav.action',
            '_Name': 'ERRORS',
        });
    }

    _createRefObjectsChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('reference_objects'),
                'IsButtonEnabled': true,
                'Icon': '$(PLT,/SAPAssetManager/Images/QABReferenceobject.ios.png,/SAPAssetManager/Images/QABReferenceobject.android.png)',
                'IsButtonVisibleBySettings': false,
                'Action': '/SAPAssetManager/Actions/ReferenceObjects/ReferenceObjectDetailsNav.action',
                '_Name': 'REFERENCE_OBJECT',
            },
            ...props,
        });
    }

    _createViewRelatedOrdersListChip(props = {}) {
        const isEnabled = RelatedWorkOrdersAreVisible(this._context);

        return this._createChip({
            ...{
                'Label': this._context.localizeText('related_work_orders'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABRelatedOrder.png,/SAPAssetManager/Images/QABRelatedOrder.android.png)',
                'IsEnabled': isEnabled,
                'Action': '/SAPAssetManager/Actions/WorkOrders/WorkOrderRelatedHistoriesListViewNav.action',
                '_Name': 'VIEW_RELATED_ORDERS_LIST',
            }, ...props,
        });
    }

    _createChipViewTaggingList() {
        return this._createChip({
            'Label': this._context.localizeText('tagging'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABTagging.png,/SAPAssetManager/Images/QABTagging.android.png)',
            'Action': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsTaggingListViewNav.js',
            'IsEnabled': IsWCMSafetyCertificateEnabled(this._context),
            '_Name': 'TAGGING',
        });
    }

    _createChipViewUntaggingList() {
        return this._createChip({
            'Label': this._context.localizeText('untagging'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABUntagging.png,/SAPAssetManager/Images/QABUntagging.android.png)',
            'Action': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsUntaggingListViewNav.js',
            'IsEnabled': IsWCMSafetyCertificateEnabled(this._context),
            '_Name': 'UNTAGGING',
        });
    }

    _createBusinessPartnersChip(props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('business_partners'),
                'IsButtonVisibleBySettings': false,
                'Icon': '$(PLT,/SAPAssetManager/Images/QABPartner.png,/SAPAssetManager/Images/QABPartner.android.png)',
                'Action': '/SAPAssetManager/Actions/BusinessPartners/BusinessPartnersListViewNav.action',
                '_Name': 'OPEN_BUSINESS_PARTNERS_LIST',
            }, ...props,
        });
    }

    _createAddBusinessPartnerChip(/** @type {ChipProps?} */ props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('add_business_partner'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddPartner.png,/SAPAssetManager/Images/QABAddPartner.android.png)',
                'Action': '/SAPAssetManager/Rules/BusinessPartners/S4/AddS4BusinessPartnerPageNav.js',
                'IsEnabled': true,
                'IsButtonEnabled': true,
                'IsButtonVisible': true,
                'IsButtonVisibleBySettings': false,
                '_Name': 'ADD_BUSINESS_PARTNER',
            },
            ...props,
        });
    }

    _createAddAttachmentChip(props = {}) {
        return this._createChip({
            ...{
                'Label': this._context.localizeText('add_attachment'),
                'IsEnabled': EnableAttachment(this._context),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAddAttachment.ios.png,/SAPAssetManager/Images/QABAddAttachment.android.png)',
                'Action': '/SAPAssetManager/Rules/Documents/Create/DocumentCreateBDSNav.js',
                'IsButtonVisibleBySettings': false,
                '_Name': 'ADD_ATTACHMENT',
            }, ...props,
        });
    }

    _createAddServiceQuotationChip() {
        return this._createChip({
            'Label': this._context.localizeText('create_service_quotation'),
            'IsButtonVisibleBySettings': false,
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddQuotation.png,/SAPAssetManager/Images/QABAddQuotation.android.png)',
            'Action': '/SAPAssetManager/Rules/ServiceQuotations/CreateUpdate/ServiceQuotationCreateNav.js',
            '_Name': 'ADD_SERVICE_QUOTATION',
        });
    }
}

export default class QABSettings extends QABSettingsHelpers {
    constructor(context, preferenceName, extensionName = 'QuickActionBarExtensionSection') {
        super(context.constructor.name === 'PageProxy' ? context : context.getPageProxy());

        this._extension = null;
        this._chips = [];
        this._extensionName = extensionName;
        this._preferenceName = preferenceName || this.getPreferenceName();

        this._saveInstance();
    }

    getExtension() {
        if (libVal.evalIsEmpty(this._extension)) {
            let extensionSection = libCom.getSectionByName(this._context, this._extensionName);
            if (libVal.evalIsEmpty(extensionSection)) {
                const pageContext = this._context.evaluateTargetPathForAPI(`#Page:${this._preferenceName.split('-')[1]}`);
                extensionSection = libCom.getSectionByName(pageContext, this._extensionName);
            }

            try {
                this._extension = extensionSection.getExtension();
            } catch (error) {
                Logger.error('QABSettings get extension error', error);
            }
        }
        return this._extension;
    }

    redrawExtension() {
        const extension = this.getExtension();
        if (!libVal.evalIsEmpty(extension)) {
            extension.onCreate();
        }
    }

    getPreferenceName() {
        if (libVal.evalIsEmpty(this._preferenceName)) {
            this._preferenceName = `${PersonaLibrary.getActivePersona(this._context)}-${libCom.getPageName(this._context)}`;
        }

        return this._preferenceName;
    }

    getQABSettings() {
        const preferenceGroup = this._context.getGlobalDefinition('/SAPAssetManager/Globals/QAB/PreferenceGroup.global').getValue();
        return this._context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], `$filter=PreferenceGroup eq '${preferenceGroup}' and PreferenceName eq '${this.getPreferenceName()}'`);
    }

    async generateChips(chips = []) {
        const defaultChips = [{
            'IsIconVisible': true,
            'Icon': '$(PLT,/SAPAssetManager/Images/QABSettings.png,/SAPAssetManager/Images/QABSettings.android.png)',
            'IsButtonVisible': true,
            'IsButtonEnabled': true,
            'Action': '/SAPAssetManager/Rules/QAB/QABSettingsPageNav.js',
            '_Name': 'SETTINGS',
        }];

        this._chips = chips.filter(chip => chip.IsEnabled);

        try {
            const result = await this.getQABSettings();
            const settingsRecord = result.getItem(0);
            const settingsNotCreated = libVal.evalIsEmpty(settingsRecord);
            const visibleChipsList = settingsNotCreated ? undefined : JSON.parse(settingsRecord.PreferenceValue).VISIBLE;

            this._chips = this._chips.map((chip) => {
                let isButtonVisibleBySettings = settingsNotCreated ? chip.IsButtonVisibleBySettings : visibleChipsList.includes(chip._Name);
                let isButtonVisible = isButtonVisibleBySettings && chip.IsButtonVisible;

                return { ...chip, IsButtonVisible: isButtonVisible, IsButtonVisibleBySettings: isButtonVisibleBySettings };
            });
        } catch (error) {
            this._chips = [];
            Logger.error('QABSettings generate chips error', error);
        }

        if (this._chips.every(item => !item.IsButtonVisible)) {
            defaultChips[0].Label = this._context.localizeText('qab_add_quick_actions');
        }

        return defaultChips.concat(this._chips);
    }

    navToSettingsPage() {
        this._context.setActionBinding({
            items: this._chips,
            selectedItemsMapping: this._chips.reduce((acc, item) => {
                if (item.IsButtonVisibleBySettings) {
                    acc[item._Name] = true;
                }

                return acc;
            }, {}),
            QABSettingsInstance: this,
        });
        return this._context.executeAction('/SAPAssetManager/Actions/QAB/QABSettingsPageNav.action');
    }

    _saveInstance() {
        this._context.getClientData().QABSettingsInstance = this;
    }

}
export class QABSettingsPage {
    static get typeVisible() {
        return 'VISIBLE';
    }

    static get typeNonVisible() {
        return 'NON_VISIBLE';
    }

    static pageOnLoaded(context) {
        context.getClientData().selectedItemsMapping = context.binding.selectedItemsMapping;
    }

    static getSelectedItemsMapping(context) {
        const pageProxy = context.getPageProxy();
        return pageProxy.getClientData().selectedItemsMapping || pageProxy.binding.selectedItemsMapping;
    }

    static getItems(context) {
        return context.getPageProxy().binding.items;
    }

    static getSectionTarget(context, type) {
        const selectedItemsMapping = this.getSelectedItemsMapping(context);

        let result = this.getItems(context).filter(item => {
            return type === this.typeVisible ? selectedItemsMapping[item._Name] : !selectedItemsMapping[item._Name];
        });

        if (context.searchString) {
            result = result.filter(item => {
                return item.Label.toLowerCase().includes(context.searchString.toLowerCase());
            });
        }

        this.setSectionItemsNames(context, type, result.map(item => item._Name));

        return result;
    }

    static getSectionItemsNames(context, type) {
        return context.getPageProxy().getClientData()[type];
    }

    static setSectionItemsNames(context, type, names) {
        context.getPageProxy().getClientData()[type] = names;
    }

    static getItemAccessoryType(context) {
        const selectedItemsMapping = this.getSelectedItemsMapping(context);
        return selectedItemsMapping[context.binding._Name] ? 'checkmark' : 'none';
    }

    static itemOnPress(context) {
        const pageProxy = context.getPageProxy();
        const selectedItemsMapping = this.getSelectedItemsMapping(context);
        const binding = pageProxy.getActionBinding();
        const name = binding._Name;

        if (selectedItemsMapping[name]) {
            delete selectedItemsMapping[name];
        } else {
            selectedItemsMapping[name] = true;
        }

        pageProxy.getClientData().selectedItemsMapping = selectedItemsMapping;
        context.redraw();
    }

    static isSectionVisible(context, type) {
        const selectedItemsMapping = this.getSelectedItemsMapping(context);

        return this.getItems(context).some(item => {
            return type === this.typeVisible ? selectedItemsMapping[item._Name] : !selectedItemsMapping[item._Name];
        });
    }

    static selectDeselectAllOnPress(context, type) {
        const pageProxy = context.getPageProxy();
        const pageClientData = pageProxy.getClientData();
        const names = this.getSectionItemsNames(context, type);

        if (!libVal.evalIsEmpty(names)) {
            pageClientData.selectedItemsMapping = names.reduce((acc, name) => {
                if (type === this.typeNonVisible) {
                    acc[name] = true;
                } else {
                    delete acc[name];
                }

                return acc;
            }, pageClientData.selectedItemsMapping || {});

            pageProxy.getControls()[0].redraw();
        }
    }

    static async onSaveOnPress(context) {
        const pageProxy = context.getPageProxy();
        const clientData = pageProxy.getClientData();
        const selectedItemsMapping = this.getSelectedItemsMapping(context);
        const QABSettingsInstance = pageProxy.binding.QABSettingsInstance;

        clientData.preferenceName = QABSettingsInstance.getPreferenceName();
        clientData.preferenceValue = JSON.stringify({ VISIBLE: Object.keys(selectedItemsMapping) });

        pageProxy.showActivityIndicator();

        try {
            const result = await QABSettingsInstance.getQABSettings();
            const settingsRecord = result.getItem(0);
            let promise;

            if (libVal.evalIsEmpty(settingsRecord)) {
                promise = pageProxy.executeAction('/SAPAssetManager/Actions/QAB/QABSettingsCreate.action');
            } else {
                clientData.readLink = settingsRecord['@odata.readLink'];
                promise = pageProxy.executeAction('/SAPAssetManager/Actions/QAB/QABSettingsUpdate.action');
            }

            await promise;
            await pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            QABSettingsInstance.redrawExtension();
        } catch (error) {
            Logger.error('QABSettings on save settings error', error);
            clientData.Error = pageProxy.localizeText('update_failed');
            pageProxy.executeAction({
                'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
                'Properties': {
                    'Message': pageProxy.localizeText('update_failed'),
                },
            });
        } finally {
            pageProxy.dismissActivityIndicator();
        }
    }
}
