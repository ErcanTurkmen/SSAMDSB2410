
export default function ServiceContractContactPersonValue(context) {
    const contactPerson = context.binding.ContactPerson_Nav;
    if (contactPerson) {
        return contactPerson.FullName || contactPerson.FirstName + ' ' + contactPerson.LastName || '-';
    } else {
        return '-';
    }
}
