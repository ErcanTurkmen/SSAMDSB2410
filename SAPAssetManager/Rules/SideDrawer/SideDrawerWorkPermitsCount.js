import WorkPermitsCount from '../WCM/WorkPermits/WorkPermitsCount';

export default function SideDrawerWorkPermitsCount(context) {
    return WorkPermitsCount(context).then(count => {
        return context.localizeText('wcm_work_permits_x', [count]);
    });
}
