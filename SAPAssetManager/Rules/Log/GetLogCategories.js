import libCom from '../Common/Library/CommonLibrary';

export default function GetLogCategories(context) {
    const categories = libCom.getStateVariable(context.getPageProxy(), 'LogCategories');
    
    return categories || [];
}
