export class PdfComponent {

  constructor() { }

  defaultImage: string = "data:image/png;base64,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";
  document: any = {
    compress: true,
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [20, 60, 20, 60],
    info: {
      title: `ProCard Agente - ${Date.now()}`,
      author: 'ProCard',
      subject: 'ProCard',
      keywords: 'ProCard',
    },
    content: [],
    styles: {
      title: {
        fontSize: 18,
        bold: true
      },
      subtitle: {
        fontSize: 15,
        bold: true
      },
      bold: {
        bold: true
      },
      normal: {
        fontSize: 8,
      },
      italic: {
        italics: true
      },
      small: {
        fontSize: 8
      },
      headerLine: {
        bold: true,
        fontSize: 14,
        color: 'black',
        margin: [5, 0, 0, 0]
      },
    }
  }

  insertTitle(image: string, title: string = "Procard Admin") {
    this.document.header = {
      table: {
        headerRows: 2,
        widths: [35, '*'],
        body: [[{
          image: image,
          width: 70,
          margin: [10, 5, 20, 5],
        }, { text: title, style: 'headerLine', margin: [40, 10, 0, 0], }], [{}, {}]],
      },
      layout: 'lightHorizontalLines',
    };
  }

  insertFooter(image: string, text: string = "") {
    this.document.footer = function (currentPage, pageCount) {
      return {
        columns: [
          text,
          currentPage.toString() + ' / ' + pageCount,
          {
            image: image,
            width: 50,
            margin: [0, 0, 0, 0],
          },
        ],
        margin: [20, 25, 20, 0],
      }
    };
  }

  insertText(title: string, titleFontType: FontTitleType, contentFontType: FontContentType, content: ContentNormal) {
    this.setTitle(title, titleFontType);
    this.document.content.push({
      text: content.text,
      style: [this.getFontContentType(contentFontType)]
    });
  }

  insertColumn(title: string, titleFontType: FontTitleType, contentFontType: FontContentType, content: ContentColumn) {
    this.setTitle(title, titleFontType);

    var cols = [];
    content.texts.forEach(col => {
      cols.push({
        width: '*',
        text: col
      })
    });
    this.document.content.push({
      columns: cols
    });
  }

  insertList(title: string, titleFontType: FontTitleType, contentFontType: FontContentType, content: ContentList) {
    this.setTitle(title, titleFontType);

    var subs = [];
    content.subtitles.forEach(sub => subs.push(sub));

    this.document.content.push({
      ol: [
        content[0],
        {
          ol: subs
        }
      ]
    });
  }

  insertImage(title: string, titleFontType: FontTitleType, contentFontType: FontContentType, content: ContentImage) {
    this.setTitle(title, titleFontType);

    this.document.content.push({
      image: content.base64,
      width: content.width,
      alignment: 'center',
      marginTop: 50
    });
  }

  insertTable(title: string, titleFontType: FontTitleType, contentFontType: FontContentType, content: ContentTable) {
    this.setTitle(title, titleFontType);
    this.insertTitle(this.defaultImage);
    this.insertFooter(this.defaultImage);

    var widths = [];
    var body = [];

    content.titles.forEach(item => content.titles.length > 2 && content.titles.indexOf(item) != content.titles.length - 1 ? widths.push((410 / content.titles.length)) : widths.push("*"));

    body.push(content.titles);
    content.values.forEach(values => body.push(values));

    this.document.content.push(
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: widths,
          body: body
        }
      }
    );
  }

  private setTitle(title: string, titleFontType: FontTitleType) {
    this.document.content.push({
      text: title,
      style: [this.getFontTitleType(titleFontType)]
    });
  }

  private getFontTitleType(font: FontTitleType) {
    switch (font) {
      case FontTitleType.Normal:
        return "normal";
      case FontTitleType.Bold:
        return "bold";
      case FontTitleType.Title:
        return "title";
      case FontTitleType.Subtitle:
        return "subtitle";
    }
  }

  private getFontContentType(font: FontContentType) {
    switch (font) {
      case FontContentType.Normal:
        return "normal";
      case FontContentType.Bold:
        return "bold";
      case FontContentType.Title:
        return "title";
      case FontContentType.Subtitle:
        return "subtitle";
    }
  }

  getDocument() { return this.document; }
}

export class ContentNormal {
  text: string;

  constructor(text: string) {
    this.text = text;
  }
}

export class ContentColumn {
  texts: string[] = [];

  constructor(texts: string[]) {
    this.texts = texts;
  }
}

export class ContentList {
  titles: string;
  subtitles: string[] = [];

  constructor(titles: string, subtitles: string[] = []) {
    this.titles = titles;
    this.subtitles = subtitles;
  }
}

export class ContentImage {
  base64: string;
  width: number;

  constructor(base64: string, width: number) {
    this.base64 = base64;
    this.width = width;
  }
}

export class ContentTable {
  titles: string[] = [];
  values: string[][] = [];

  constructor(titles: string[], values: string[][]) {
    this.titles = titles;
    this.values = values;
  }
}

export enum FontTitleType {
  Normal = 0,
  Title = 1,
  Subtitle = 2,
  Bold = 3
}

export enum FontContentType {
  Normal = 0,
  Title = 1,
  Subtitle = 2,
  Bold = 3
}
