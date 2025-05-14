import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function SetStartDateValue(context) {
    let date = new Date();
    
    if (!CommonLibrary.IsOnCreate(context) && context.binding && context.binding.RequestedStart) {
        date = context.binding.RequestedStart;
    }

    return date;
}
