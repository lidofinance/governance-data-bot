import { formatDate, VoteEntity } from '../vote.entity';

export class NotionRecordEntity {
  constructor(private vote: VoteEntity) {}

  properties() {
    return {
      Name: {
        title: [{ text: { content: this.vote.name } }],
      },
      Source: {
        select: { name: this.vote.source },
      },
      Status: {
        select: { name: this.vote.status },
      },
      Type: {
        select: { name: this.vote.type },
      },
      Description: {
        rich_text: [
          {
            text: { content: this.vote.description },
            annotations: { bold: true },
          },
        ],
      },
      Date: { date: { start: this.vote.startDate } },
      'End Date': {
        date: { start: this.vote.endDate },
      },
      'Execution End Date': {
        date: this.vote.executionEndDate
          ? { start: new Date(this.vote.executionEndDate).toISOString() }
          : null,
      },
      Link: {
        url: this.vote.link,
      },
      'Objections Amount': {
        number: this.vote.objectionsAmount,
      },
      'Objections Threshold': {
        number: this.vote.objectionsThreshold,
      },
    };
  }
}

const propertiesNames = [
  'Name',
  'Source',
  'Status',
  'Type',
  'Description',
  'Date',
  'End Date',
  'Execution End Date',
  'Link',
  'Objections Amount',
  'Objections Threshold',
];

export function isValidProperties(properties) {
  return propertiesNames.every((name) => name in properties);
}

export function voteFromNotionProperties(properties): VoteEntity {
  if (!isValidProperties(properties))
    throw Error('Notion page has invalid properties');
  return {
    source: properties.Source.select.name,
    status: properties.Status.select.name,
    name: properties.Name.title[0].text.content,
    type: properties.Type.select.name,
    description: properties.Description.rich_text[0].text.content,
    startDate: formatDate(properties.Date.date.start),
    endDate: formatDate(properties['End Date'].date.start),
    executionEndDate:
      properties['Execution End Date'].date &&
      formatDate(properties['Execution End Date'].date.start),
    link: properties.Link.url,
    objectionsAmount: properties['Objections Amount'].number,
    objectionsThreshold: properties['Objections Threshold'].number,
  };
}
