import { GetNotifPartnerDetProcsCount, IsPartnerPicker1Visible, IsPartnerPicker2Visible } from './PartnerPickerVisible';

export default function PartnerPickerSectionVisible(context) {
    return GetNotifPartnerDetProcsCount(context).then(notifPartnerDetProcsCount => IsPartnerPicker1Visible(notifPartnerDetProcsCount) || IsPartnerPicker2Visible(notifPartnerDetProcsCount));
}
