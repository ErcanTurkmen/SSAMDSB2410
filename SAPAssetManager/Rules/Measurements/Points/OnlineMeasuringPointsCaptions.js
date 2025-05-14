import OnlineMeasuringPointsCount from './OnlineMeasuringPointsCount';

export default async function OnlineMeasuringPointsCaptions(context) {
    const count = await OnlineMeasuringPointsCount(context);
    return context.localizeText('measuring_points_x', [count]);
}
