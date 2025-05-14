export default function WorkPermitSubhead(context) {
    const {WCMApplication, WCMApplicationUsages} = context.binding;
    return `${WCMApplication}${WCMApplicationUsages ? ' - ' + WCMApplicationUsages.DescriptUsage : ''}`;
}
