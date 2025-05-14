import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function ServiceQuotationItemSoldToPartyName(context) {
    return ValueIfExists(context.binding?.S4ServiceQuotation_Nav?.Customer_Nav?.OrgName1);
}
