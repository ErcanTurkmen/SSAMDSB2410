import libCommon from '../../../Common/Library/CommonLibrary';
import libEval from '../../../Common/Library/ValidationLibrary';

export default function IsValidFinalConfirmation(context) {
	const binding = context.getBindingObject();

	if (binding?.OrderID && binding?.Operation) {
		const operationQueryString = binding.SubOperation
				? `MyWorkOrderSubOperations(OrderId='${binding.OrderID}',OperationNo='${binding.Operation}',SubOperationNo='${binding.SubOperation}')`
				: `MyWorkOrderOperations(OrderId='${binding.OrderID}',OperationNo='${binding.Operation}')`;

		return context.read('/SAPAssetManager/Services/AssetManager.service', `${operationQueryString}/Confirmations`, [], '')
				.then(function(result) {
					const finalConfirmation = result._array.find(confirmation => confirmation.FinalConfirmation === 'X' && confirmation.SubOperation === binding.SubOperation);
					const hasFinalConfirmation = !libEval.evalIsEmpty(finalConfirmation);
					const isCurrentConfirmationSetAsFinal = libCommon.getControlProxy(context, 'IsFinalConfirmation').getValue();
					const isCreateConfirmation = binding.IsOnCreate;
					const checkFinalConfirmation = (hasFinalConfirmation && isCurrentConfirmationSetAsFinal && binding.ConfirmationNum !== finalConfirmation.ConfirmationNum);
					const shouldPreventConfirmation = isCreateConfirmation ? hasFinalConfirmation : checkFinalConfirmation;
					if (shouldPreventConfirmation) {
						return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidEntryAfterFinal.action').then(function() {
							return false;
						});
					}
					return true;
				})
				.catch(function() {
					return false;
				});
	}

	return Promise.resolve(true);
}
