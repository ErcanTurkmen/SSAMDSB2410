import IsServiceItemCategory from './IsServiceItemCategory';

export default function IsNonServiceItemCategory(context) {
    return !IsServiceItemCategory(context); 
}
