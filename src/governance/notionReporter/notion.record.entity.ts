import { VoteEntity } from '../vote.entity';
import { formatDate } from '../governance.utils';
import { TopicEntity } from '../topic.entity';

export class NotionTypes {
  static title = {
    schema: { title: {} },
    value: (content: string | undefined) => {
      return { title: [{ text: { content: content || '' } }] };
    },
  };
  static select = {
    schema: { select: {} },
    value: (name: string | undefined) => {
      return { select: name ? { name } : null };
    },
  };

  static rich_text = {
    schema: { rich_text: {} },
    value: (content: string | undefined, annotations) => {
      return { rich_text: [{ text: { content: content || '' }, annotations }] };
    },
  };

  static date = {
    schema: { date: {} },
    value: (start: string | undefined) => {
      return {
        date: start ? { start } : null,
      };
    },
  };

  static link = {
    schema: { url: {} },
    value: (url: string | undefined) => {
      return { url: url || null };
    },
  };

  static number = {
    schema: { number: {} },
    value: (number: number | undefined) => {
      return {
        number: number !== undefined ? number : null,
      };
    },
  };
}

export class NotionEntity {
  public static readonly propertiesNames;
  constructor(private _: any) {}
  public static schema() {
    return Object.fromEntries(
      Object.keys(this.propertiesNames).map((key) => [key, this.propertiesNames[key].schema]),
    );
  }
  properties() {
    return {};
  }
}

export class NotionVoteEntity extends NotionEntity {
  public static readonly propertiesNames = <const>{
    Name: NotionTypes.title,
    Source: NotionTypes.select,
    Status: NotionTypes.select,
    Type: NotionTypes.select,
    Description: NotionTypes.rich_text,
    Date: NotionTypes.date,
    'End Date': NotionTypes.date,
    'Execution End Date': NotionTypes.date,
    Link: NotionTypes.link,
    'Additional Link': NotionTypes.link,
    'Objections Amount': NotionTypes.number,
    'Objections Threshold': NotionTypes.number,
    Res1: NotionTypes.number,
    Res2: NotionTypes.number,
    Res3: NotionTypes.number,
    Choice1: NotionTypes.rich_text,
    Choice2: NotionTypes.rich_text,
    Choice3: NotionTypes.rich_text,
    ProposalType: NotionTypes.select,
    Discussion: NotionTypes.link,
    'Voters number': NotionTypes.number,
  };
  constructor(private vote: VoteEntity) {
    super(vote);
  }

  properties() {
    return {
      Name: NotionVoteEntity.propertiesNames.Name.value(this.vote.name),
      Source: NotionVoteEntity.propertiesNames.Source.value(this.vote.source),
      Status: NotionVoteEntity.propertiesNames.Status.value(this.vote.status),
      Type: NotionVoteEntity.propertiesNames.Type.value(this.vote.type),
      Description: NotionVoteEntity.propertiesNames.Description.value(this.vote.description, {}),
      Date: NotionVoteEntity.propertiesNames.Date.value(this.vote.startDate),
      'End Date': NotionVoteEntity.propertiesNames['End Date'].value(this.vote.endDate),
      'Execution End Date': NotionVoteEntity.propertiesNames['Execution End Date'].value(
        this.vote.executionEndDate,
      ),
      Link: NotionVoteEntity.propertiesNames.Link.value(this.vote.link),
      'Additional Link': NotionVoteEntity.propertiesNames['Additional Link'].value(
        this.vote.additionalLink,
      ),
      'Objections Amount': NotionVoteEntity.propertiesNames['Objections Amount'].value(
        this.vote.objectionsAmount,
      ),
      'Objections Threshold': NotionVoteEntity.propertiesNames['Objections Threshold'].value(
        this.vote.objectionsThreshold,
      ),
      Res1: NotionVoteEntity.propertiesNames.Res1.value(this.vote.result1),
      Res2: NotionVoteEntity.propertiesNames.Res2.value(this.vote.result2),
      Res3: NotionVoteEntity.propertiesNames.Res3.value(this.vote.result3),
      Choice1: NotionVoteEntity.propertiesNames.Choice1.value(this.vote.choice1, {}),
      Choice2: NotionVoteEntity.propertiesNames.Choice2.value(this.vote.choice2, {}),
      Choice3: NotionVoteEntity.propertiesNames.Choice3.value(this.vote.choice3, {}),
      ProposalType: NotionVoteEntity.propertiesNames.ProposalType.value(this.vote.proposalType),
      Discussion: NotionVoteEntity.propertiesNames.Discussion.value(this.vote.discussion),
      'Voters number': NotionVoteEntity.propertiesNames['Voters number'].value(
        this.vote.votersNumber,
      ),
    };
  }
}

export class NotionTopicEntity extends NotionEntity {
  public static readonly propertiesNames = <const>{
    ID: NotionTypes.number,
    Name: NotionTypes.title,
    Link: NotionTypes.link,
    'Creation Date': NotionTypes.date,
    'Last Reply Date': NotionTypes.date,
  };

  constructor(private topic: TopicEntity) {
    super(topic);
  }

  properties() {
    return {
      ID: NotionTopicEntity.propertiesNames.ID.value(this.topic.id),
      Name: NotionTopicEntity.propertiesNames.Name.value(this.topic.name),
      Link: NotionTopicEntity.propertiesNames.Link.value(this.topic.link),
      'Creation Date': NotionTopicEntity.propertiesNames['Creation Date'].value(
        this.topic.creationDate,
      ),
      'Last Reply Date': NotionTopicEntity.propertiesNames['Last Reply Date'].value(
        this.topic.lastReplyDate,
      ),
    };
  }
}

export function voteFromNotionProperties(properties): VoteEntity {
  return {
    source: properties.Source.select?.name,
    status: properties.Status.select?.name,
    name: properties.Name.title[0].text.content,
    type: properties.Type.select?.name,
    description: properties.Description.rich_text[0].text.content,
    startDate: formatDate(properties.Date.date.start),
    endDate: formatDate(properties['End Date'].date.start),
    executionEndDate:
      properties['Execution End Date'].date &&
      formatDate(properties['Execution End Date'].date.start),
    link: properties.Link.url,
    additionalLink: properties['Additional Link'].url,
    objectionsAmount: properties['Objections Amount'].number,
    objectionsThreshold: properties['Objections Threshold'].number,
    result1: properties.Res1.number,
    result2: properties.Res2.number,
    result3: properties.Res3.number,
    choice1: properties.Choice1.rich_text[0]?.text.content,
    choice2: properties.Choice2.rich_text[0]?.text.content,
    choice3: properties.Choice3.rich_text[0]?.text.content,
    proposalType: properties.ProposalType.select?.name,
    discussion: properties.Discussion?.url,
    votersNumber: properties['Voters number'].number,
  };
}

export function topicFromNotionProperties(properties): TopicEntity {
  return {
    id: properties.ID.number,
    name: properties.Name.title[0].plain_text,
    link: properties.Link.url,
    creationDate: formatDate(properties['Creation Date'].date.start),
    lastReplyDate: formatDate(properties['Last Reply Date'].date.start),
  };
}
