import { AnalyticsEventLogger } from 'extension-SAMFoundation';
import { GlobalVar } from '../Common/Library/GlobalCommon';

export default class {

     /**
     * Configure the app to use Analytic when systemSetting is Production
     * The paramters for Analytic are as follows
     * @async
     * @param {context} MDK context
     * @returns {Promise} Promise
     */
    static async init(context) {
        let licenseNo = GlobalVar.getUserSystemInfo().get(context.getGlobalDefinition('/SAPAssetManager/Globals/AnalyticsEventLogger/LicenseNumber.global').getValue());
        return AnalyticsEventLogger.getInstance().init(context, licenseNo);
    }

     /**
     * Operation is successfully completed. Done button is clicked after confirmation screen
     * Supported on assignment type 2, 4, 5, 6
     * @param {}
     * @returns {void}
     */
     static operationCompleteSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('operation.complete.success');
    }

    /**
     * Operation is cancelled on confirmation screen
     * Supported on assignment type 2, 4, 5, 6
     * @param {}
     * @returns {void}
     */
    static operationCompleteCancel() {
        AnalyticsEventLogger.getInstance().logEvent('operation.complete.cancel');
    }

    /**
     * Order is successfully completed. Done button is clicked after confirmation screen
     * Supported on assignment type 1, 7, 8
     * @param {}
     * @returns {void}
     */
    static orderCompleteSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('order.complete.success');
    }

    /**
     * Order is cancelled on confirmation screen
     * Supported on assignment type 1, 7, 8
     * @param {}
     * @returns {void}
     */
    static orderCompleteCancel() {
        AnalyticsEventLogger.getInstance().logEvent('order.complete.cancel');
    }

    /**
     * SubOperation is successfully completed. Done button is clicked after confirmation screen
     * Supported on assignment type 3
     * @param {}
     * @returns {void}
     */
    static suboperationCompleteSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('suboperation.complete.success');
    }

    /**
     * SubOperation is cancelled on confirmation screen
     * Supported on assignment type 3
     * @param {}
     * @returns {void}
     */
    static suboperationCompleteCancel() {
        AnalyticsEventLogger.getInstance().logEvent('suboperation.complete.cancel');
    }

    /**
     * Notification Created Successfully
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static notificationCreateSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('notification.create.success');
    }

    /**
     * Notification Create Cancelled
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static notificationCreateCancel() {
        AnalyticsEventLogger.getInstance().logEvent('notification.create.cancel');
    }

    /**
     * Notification Completed Successfully
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static notificationCompleteSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('notification.complete.success');
    }

    /**
     * Notification Completion Cancelled
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static notificationCompleteCancel() {
        AnalyticsEventLogger.getInstance().logEvent('notification.complete.cancel');
    }

    /**
     * App was lauched/loaded with MT persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static maintenanceTechnicaionAppLaunch() {
        AnalyticsEventLogger.getInstance().logEvent('mt.app.launch');
    }

    /**
     * App was lauched/loaded with MT STD persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static maintenanceTechnicaionSTDAppLaunch() {
        AnalyticsEventLogger.getInstance().logEvent('mt.std.app.launch');
    }

    /**
     * App was lauched/loaded with FST persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static fieldServiceTechnicaionAppLaunch() {
        AnalyticsEventLogger.getInstance().logEvent('fst.app.launch');
    }

    /**
     * App was lauched/loaded with FST Pro persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static fieldServiceTechnicaionProAppLaunch() {
        AnalyticsEventLogger.getInstance().logEvent('fst.pro.app.launch');
    }

    /**
     * App was lauched/loaded with IM persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static inventoryManagerAppLaunch() {
        AnalyticsEventLogger.getInstance().logEvent('im.app.launch');
    }

    /**
     * App was lauched/loaded with ST persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static safetyTechnicaionAppLaunch() {
        AnalyticsEventLogger.getInstance().logEvent('st.app.launch');
    }

    /**
     * Timesheet or PM Confirmation submitted
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static timeEntryCreateSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('timeentry.create.success');
    }

    /**
     * Timesheet or PM Confirmation cancelled
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static timeEntryCreateCancel() {
        AnalyticsEventLogger.getInstance().logEvent('timeentry.create.cancel');
    }

    /**
     * Operational item 'Set Tagged' clicked, optional lock number and signature added, done clicked
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static operationalItemLockSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('operationalitem.lock.success');
    }

    /**
     * Operational item 'Set UnTagged' clicked, optional signature added, done clicked
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static operationalItemUnlockSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('operationalitem.unlock.success');
    }

    /**
     * Work Permit page - Approvals modal 'Issue Approval' clicked, optional signature added
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static permitApprovalSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('permit.approval.success');
    }

    /**
     * Goods issue completed successfully
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static goodsIssueSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('Goods.issue.success');
    }

    /**
     * Goods issue completion cancelled
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static goodsIssueCancel() {
        AnalyticsEventLogger.getInstance().logEvent('Goods.issue.cancel');
    }

    /**
     * Goods receipt completed successfully
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static goodsReceiptSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('Goods.receipt.success');
    }

    /**
     * Goods receipt completion cancelled
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static goodsReceiptCancel() {
        AnalyticsEventLogger.getInstance().logEvent('Goods.receipt.cancel');
    }

    /**
     * Physical inventory completed successfully
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static inventoryCountSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('inventory.count.success');
    }

    /**
     * Service item is successfully completed
     * Supported on assignment type 2
     * @param {}
     * @returns {void}
     */
    static serviceItemCompleteSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('ServiceItem.complete.success');
    }

    /**
     * Service order is successfully completed
     * Supported on assignment type 1
     * @param {}
     * @returns {void}
     */
    static serviceOrderCompleteSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('ServiceOrder.complete.success');
    }

    /**
     * Service Confirmation Item is successfully Created
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static serviceConfirmationItemCreateSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('ServiceConfirmationItem.Create.success');
    }

    /**
     * Service Request is successfully Created
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static serviceRequestCreateSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('ServiceRequest.Create.success');
    }

    /**
     * Inspection is successfully Created
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static inspectionCreateSuccess() {
        AnalyticsEventLogger.getInstance().logEvent('inspection.create.success');
    }

    /**
     * Inspection is successfully Cancelled during creation
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static inspectionCreateCancel() {
        AnalyticsEventLogger.getInstance().logEvent('inspection.create.cancel');
    }

    /**
     * Search Completion
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static searchComplete() {
        AnalyticsEventLogger.getInstance().logEvent('Search.complete');
    }

    /**
     * App Launched
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static appLaunch() {
        AnalyticsEventLogger.getInstance().logEvent('app.launch');
    }

    /**
     * Return to Overview page with MT persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static maintenanceTechnicaionReturnOverview() {
        AnalyticsEventLogger.getInstance().logEvent('mt.overview.return');
    }

    /**
     * Return to Overview page with MT Std persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static maintenanceTechnicaionStdReturnOverview() {
        AnalyticsEventLogger.getInstance().logEvent('mt.std.overview.return');
    }

    /**
     * Return to Overview page with FST persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static fieldServiceTechnicaionReturnOverview() {
        AnalyticsEventLogger.getInstance().logEvent('fst.overview.return');
    }

    /**
     * Return to Overview page with FST pro persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static fieldServiceTechnicaionProReturnOverview() {
        AnalyticsEventLogger.getInstance().logEvent('fst.pro.overview.return');
    }

    /**
     * Return to Overview page with IM persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static inventoryManagerReturnOverview() {
        AnalyticsEventLogger.getInstance().logEvent('im.overview.return');
    }

    /**
     * Return to Overview page with ST/WCM persona
     * Supported on all assignment types
     * @param {}
     * @returns {void}
     */
    static safetyTechnicaionReturnOverview() {
        AnalyticsEventLogger.getInstance().logEvent('st.overview.return');
    }

    static systemLaunch(context) {
        let systemSetting = GlobalVar.getUserSystemInfo().get(context.getGlobalDefinition('/SAPAssetManager/Globals/AnalyticsEventLogger/SystemClientRole.global').getValue());
        if (systemSetting === 'P') {
            AnalyticsEventLogger.getInstance().logEvent('production.system.launch');
        } else if (systemSetting === 'T') {
            AnalyticsEventLogger.getInstance().logEvent('test.system.launch');
        }
    }
}
