import { SafetyCertificateEventTypes } from './SafetyCertificatesOnCustomEventDataReceived';

/** @param {IPageProxy & {binding: WCMDocumentHeader}} context  */
export default function SafetyCertificatesOnReturning(context) {
    // in case we return from a page where we changed this cert's mobilestatus. e.g. we tagged the last operational item
    return context.executeCustomEvent(SafetyCertificateEventTypes.MobileStatusChanged);
}
