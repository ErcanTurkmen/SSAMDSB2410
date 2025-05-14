import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Show the Chapter Picker Title
* @param {IClientAPI} clientAPI
*/
export default function ChapterPickerCaption(clientAPI) {
    const currentChapterIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    /** @type {[]} */
    const chapters = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    const chapter = chapters[chapters.findIndex((row) => row.index === currentChapterIndex)];

    const visibleChapters = chapters.filter(chap => chap.isVisible);
    let total = 0, current = 0;

    for (const element of visibleChapters) { //Currently displaying total = enabled chapters
        total++;
        if (chapter.id === element.id) {
            current = total;
        }
    }
    return clientAPI.localizeText('select_chapters', [current, total]);
}
