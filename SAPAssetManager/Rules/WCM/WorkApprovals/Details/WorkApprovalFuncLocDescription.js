import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function WorkApprovalFuncLocDescription(context) {
    const funcLocIdIntern = context.binding.FuncLoc;

    if (funcLocIdIntern) {
        return CommonLibrary.getEntityProperty(context, `MyFunctionalLocations('${funcLocIdIntern}')`, 'FuncLocDesc').then(FuncLocDesc => {
            return FuncLocDesc;
        });
    }

    return '-';
}
