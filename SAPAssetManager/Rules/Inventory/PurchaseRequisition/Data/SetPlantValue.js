import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function SeePlantValue(context) {
    let data = context.binding;

    if (data && data.Plant) {
        return data.Plant;
    }

    return CommonLibrary.getUserDefaultPlant();
}
