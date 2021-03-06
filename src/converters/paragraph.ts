namespace ParagraphConverter {
  const PARAGRAPH_CHILD_PROCESSORS = {
    [DocumentApp.ElementType.TEXT]: (element: GoogleAppsScript.Document.Element) => TextConverter.convert(element.asText())
  };

  const getParagraphHeadingPrefix = (paragraph: GoogleAppsScript.Document.Paragraph) => {
    let headingPrefix = '';

    switch (paragraph.getHeading()) {
      case DocumentApp.ParagraphHeading.TITLE:
        headingPrefix += "# ";
        break;
      case DocumentApp.ParagraphHeading.HEADING6: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING5: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING4: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING3: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING2: headingPrefix += "#";
      case DocumentApp.ParagraphHeading.HEADING1: headingPrefix += "# ";
      default:
    }

    if (paragraph.getHeading() === DocumentApp.ParagraphHeading.TITLE) {
    }

    return headingPrefix;
  }

  const getParagraphHeadingSuffix = (paragraph: GoogleAppsScript.Document.Paragraph) => paragraph.getHeading() === DocumentApp.ParagraphHeading.TITLE ? " #" : "";

  export const convert = (paragraph: GoogleAppsScript.Document.Paragraph) => {
    if (paragraph.getNumChildren() === 0) {
      return '';
    }
    let paragraphOutput = getParagraphHeadingPrefix(paragraph);

    for (let i = 0; i < paragraph.getNumChildren(); i++) {
      const currentParagraphElement = paragraph.getChild(i);
      Logger.log("Processing paragraph element of type %s", currentParagraphElement.getType());

      const paragraphChildProcessor = PARAGRAPH_CHILD_PROCESSORS[currentParagraphElement.getType()];
      if (paragraphChildProcessor) {
        paragraphOutput += paragraphChildProcessor(currentParagraphElement);
      } else {
        Logger.log("TODO: Implement paragraph child processor for type: %s", currentParagraphElement.getType());
      }
    }

    paragraphOutput += getParagraphHeadingSuffix(paragraph);
    paragraphOutput += '\n\n';
    return paragraphOutput;
  }
}