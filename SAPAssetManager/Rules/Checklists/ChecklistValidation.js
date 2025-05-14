import common from '../Common/Library/CommonLibrary';

export default function ChecklistValidation(context, section) {
	let regex = /^([^~`%*|;'"<>](?!(\\.\\.))){0,5000}$/;
	let input = section.getControl('Comments').getValue();

	if (regex.test(input)) {
		return true;
	} else {
		common.executeInlineControlError(context, section.getControl('Comments'), context.localizeText('illegal_chars', ['~ ` % * | ; \' " < >']));
		return false;
	}
}
