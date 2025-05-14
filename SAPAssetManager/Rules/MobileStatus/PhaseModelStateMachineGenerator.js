import StateMachineGenerator from './StateMachineGenerator';

export default class PhaseModelStateMachineGenerator extends StateMachineGenerator {

    /**
    *
    * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context
    * @param {PMMobileStatus} currentStatus
    * @param {string} objectType
    */
    constructor(context, currentStatus, objectType, binding) {
        super(context, currentStatus, objectType, binding);
    }

    async _addToEAMOverallStatusProfileFilter() {
        const orderTypeRecord = await this._getOrderTypeInfo();
        const { EAMOverallStatusProfile, PhaseModelActive } = orderTypeRecord;
        const phaseModelRelevant = PhaseModelActive === 'X' ? 'X' : '';

        const filter = EAMOverallStatusProfile
        ? `((ToEAMOverallStatusProfile eq '${EAMOverallStatusProfile}') or (PhaseModelRelevant eq '${phaseModelRelevant}' and ToEAMOverallStatusProfile eq ''))`
        : `PhaseModelRelevant eq '${phaseModelRelevant}' and ToEAMOverallStatusProfile eq ''`;

        this._filters.push(filter);

    }

    async _getOrderTypeInfo() {
        return this._context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['EAMOverallStatusProfile', 'PhaseModelActive'], `$filter=OrderType eq '${this._binding.WOHeader.OrderType}'`).then(orderTypeArray => {
            if (orderTypeArray.length > 0) {
                return orderTypeArray.getItem(0);
            }
            return '';
        });
    }


}
