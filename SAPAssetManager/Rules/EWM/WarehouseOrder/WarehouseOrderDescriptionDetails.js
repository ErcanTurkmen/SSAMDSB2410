export default function WarehouseOrderDescriptionDetails(context) {
    // `context.binding.CreationTime` is in UTC timezone
    let creationTimestamp = context.binding.CreationTime; // "24.07.2018 08:16:35"
    let creationDate = creationTimestamp.split(' ')[0]; // "24.07.2018"
    let creationTime = creationTimestamp.split(' ')[1]; // "08:16:35"
    let cdElements = creationDate.split('.'); // ["24", "07", "2018"]
    // `date` will be in local timezone 
    let date = new Date(cdElements[2]+'-'+cdElements[1]+'-'+cdElements[0]+'T'+creationTime+'Z'); // "2018-07-24T08:16:35Z"
    return context.formatDatetime(date);
}
