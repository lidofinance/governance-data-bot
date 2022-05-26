import { formatDate, VoteEntity } from '../vote.entity';

export class NotionTypes {
  static title(content: string | undefined) {
    return {
      title: [{ text: { content: content || '' } }],
    };
  }
  static select(name: string | undefined) {
    return { select: name ? { name } : null };
  }

  static rich_text(content: string | undefined, annotations) {
    return { rich_text: [{ text: { content: content || '' }, annotations }] };
  }

  static date(start: string | undefined) {
    return {
      date: start ? { start } : null,
    };
  }

  static link(url: string | undefined) {
    return { url: url || null };
  }

  static number(number: number | undefined) {
    return {
      number: number !== undefined ? number : null,
    };
  }
}

export class NotionRecordEntity {
  constructor(private vote: VoteEntity) {}

  properties() {
    return {
      Name: NotionTypes.title(this.vote.name),
      Source: NotionTypes.select(this.vote.source),
      Status: NotionTypes.select(this.vote.status),
      Type: NotionTypes.select(this.vote.type),
      Description: NotionTypes.rich_text(this.vote.description, { bold: true }),
      Date: NotionTypes.date(this.vote.startDate),
      'End Date': NotionTypes.date(this.vote.endDate),
      'Execution End Date': NotionTypes.date(this.vote.executionEndDate),
      Link: NotionTypes.link(this.vote.link),
      'Objections Amount': NotionTypes.number(this.vote.objectionsAmount),
      'Objections Threshold': NotionTypes.number(this.vote.objectionsThreshold),
      Res1: NotionTypes.number(this.vote.result1),
      Res2: NotionTypes.number(this.vote.result2),
      Res3: NotionTypes.number(this.vote.result3),
      ProposalType: NotionTypes.select(this.vote.proposalType),
      Discussion: NotionTypes.link(this.vote.discussion),
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
  'Res1',
  'Res2',
  'Res3',
  'ProposalType',
  'Discussion',
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
    type: properties.Type.select?.name,
    description: properties.Description.rich_text[0].text.content,
    startDate: formatDate(properties.Date.date.start),
    endDate: formatDate(properties['End Date'].date.start),
    executionEndDate:
      properties['Execution End Date'].date &&
      formatDate(properties['Execution End Date'].date.start),
    link: properties.Link.url,
    objectionsAmount: properties['Objections Amount'].number,
    objectionsThreshold: properties['Objections Threshold'].number,
    result1: properties.Res1.number,
    result2: properties.Res2.number,
    result3: properties.Res3.number,
    proposalType: properties.ProposalType.select?.name,
    discussion: properties.Discussion?.url,
  };
}
