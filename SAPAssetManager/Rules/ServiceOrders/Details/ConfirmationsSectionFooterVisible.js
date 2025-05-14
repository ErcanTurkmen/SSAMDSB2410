import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
 *  @param {ISectionedTableProxy} context
 * @returns {Promise<boolean>} */
export default function ConfirmationsSectionFooterVisible(context) {
    return CommonLibrary.getEntitySetCount(context, `${context.binding['@odata.readLink']}/S4ServiceConfirmationTranHistory_Nav`, '$filter=sap.entityexists(S4ServiceConfirmation_Nav)')
        .then(count => 2 < count);
}
