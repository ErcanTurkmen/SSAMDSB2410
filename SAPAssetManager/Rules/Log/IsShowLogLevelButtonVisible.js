export default function IsShowLogLevelButtonVisible(context) {
    const logger = context.getLogger();

    return logger.isTurnedOn();
}
