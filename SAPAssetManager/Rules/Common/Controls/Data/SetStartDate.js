import ODataDate from '../../Date/ODataDate';

export default function SetStartDate(context) {
    const binding = context.binding || {};
    const startDate = binding.StartDate;

    if (startDate) {
        return new ODataDate(startDate).toLocalDateString();
    }

    return new Date();
}
