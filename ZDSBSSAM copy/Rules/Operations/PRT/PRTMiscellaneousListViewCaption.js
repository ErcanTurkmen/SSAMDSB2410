import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function PRTMiscellaneousListViewCaption(context) {   
    //DSB customisations to show Miscellaneous PRT category as A instead of O as set in danish language 
    let queryString = '$filter=(PRTCategory eq \'A\')';
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Tools', queryString).then(count => {
        return context.localizeText('miscellaneous_x',[count]);
    });
}
