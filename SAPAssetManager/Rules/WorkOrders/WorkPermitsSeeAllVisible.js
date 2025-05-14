import WorkPermitsCount from '../WCM/WorkPermits/WorkPermitsCount';

export default function WorkPermitsSeeAllVisible(context) {
    return WorkPermitsCount(context.getPageProxy()).then(count => {
        return 2 < count;
    });
}
