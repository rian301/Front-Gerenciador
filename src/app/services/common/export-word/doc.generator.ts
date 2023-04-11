import {
  AlignmentType,
  ColumnBreak,
  Document,
  HeadingLevel,
  LineNumberRestartFormat,
  Packer,
  Paragraph,
  SectionType,
  Spacing,
  TabStop,
  TabStopPosition,
  TabStopType,
  TextRun,
  TextWrappingSide,
} from "docx";
import { CustomerListModel } from "src/app/models/customer-list.model";
import { CustomerModel } from "src/app/models/customer.model";

export class DocumentCreator {
  public create(customers: CustomerListModel[]): Document {
    const document = new Document({
      sections: [
        {
          properties: {
            column: {
                space: 900,
                count: 2,
            },
        },
          children: [
            // new Paragraph({
            //   text: "Etiquetas Alunos",
            //   heading: HeadingLevel.TITLE,
            // }),
            new Paragraph({}),
            ...customers
              .map((customer) => {
                const arr: Paragraph[] = [];
                arr.push(this.createHeading("Destinatário"));
                arr.push(this.createInstitutionHeader(customer.name));
                arr.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${customer?.street}, ${customer?.number}-${customer?.complement != null ? customer?.complement : ""}-${customer?.district}`,
                        bold: true,
                      }),
                    ],
                  })
                );
                arr.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${customer?.city}-${customer.state}`,
                        bold: true,
                      }),
                    ],
                  })
                );
                arr.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `CEP: ${customer.zipCode}`,
                        bold: true,
                      }),
                      new ColumnBreak(),// É esse cara
                    ],
                    thematicBreak: true,
                  })
                  );

                return arr;
              })
              .reduce((prev, curr) => prev.concat(curr), []),
          ],
        },
        
      ],
    });

    return document;
  }

  public createHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: false,
    });
  }

  public createSubHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
    });
  }

  public createInstitutionHeader(name: string): Paragraph {
    return new Paragraph({
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX,
        },
      ],
      children: [
        new TextRun({
          text: name,
          bold: true,
        }),
      ],
    });
  }
}
