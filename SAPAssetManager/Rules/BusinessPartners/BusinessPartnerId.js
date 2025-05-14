
export default function BusinessPartnerId(context) {
    return context.binding.PersonNum || context.binding.PartnerNum || context.binding.ObjectID || '-';
}
