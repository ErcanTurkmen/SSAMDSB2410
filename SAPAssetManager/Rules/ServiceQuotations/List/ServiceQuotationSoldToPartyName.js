import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceQuotationSoldToPartyName(context) {
    return ValueIfExists(context.binding?.Customer_Nav?.OrgName1);
}
