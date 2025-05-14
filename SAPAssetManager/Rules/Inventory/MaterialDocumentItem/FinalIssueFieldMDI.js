import libComm from '../../Common/Library/CommonLibrary';

/**
 * Provide display value for FinalIssue
 * @param {IClientAPI} context 
 * @returns 
 */
export default function FinalIssueFieldMDI(context) {
	return libComm.isFlagSet(context.binding?.FinalIssue) ? context.localizeText('yes') : '-';
}
