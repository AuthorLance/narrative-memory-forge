export type EntryType = 'character' | 'place' | 'plotpoint' | 'goal' | 'ability';

export interface BaseEntry {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Character extends BaseEntry {
  type: 'character';
  appearance?: string;
  personality?: string;
  background?: string;
  relationships?: string;
}

export interface Place extends BaseEntry {
  type: 'place';
  geography?: string;
  culture?: string;
  history?: string;
  significance?: string;
}

export interface PlotPoint extends BaseEntry {
  type: 'plotpoint';
  chapter?: string;
  consequence?: string;
  characters?: string;
  importance?: 'low' | 'medium' | 'high';
}

export interface Goal extends BaseEntry {
  type: 'goal';
  deadline?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'not_started' | 'in_progress' | 'completed';
  steps?: string;
}

export interface Ability extends BaseEntry {
  type: 'ability';
  power?: string;
  limitations?: string;
  cost?: string;
  users?: string;
}

export type WritingEntry = Character | Place | PlotPoint | Goal | Ability;

export const entryTypeConfig = {
  character: {
    name: 'Characters',
    singular: 'Character',
    icon: '👤',
    color: 'bg-purple-100 border-purple-200',
    fields: ['appearance', 'personality', 'background', 'relationships']
  },
  place: {
    name: 'Places',
    singular: 'Place',
    icon: '🏛️',
    color: 'bg-blue-100 border-blue-200',
    fields: ['geography', 'culture', 'history', 'significance']
  },
  plotpoint: {
    name: 'Plot Points',
    singular: 'Plot Point',
    icon: '📚',
    color: 'bg-green-100 border-green-200',
    fields: ['chapter', 'consequence', 'characters', 'importance']
  },
  goal: {
    name: 'Goals',
    singular: 'Goal',
    icon: '🎯',
    color: 'bg-amber-100 border-amber-200',
    fields: ['deadline', 'priority', 'status', 'steps']
  },
  ability: {
    name: 'Abilities',
    singular: 'Ability',
    icon: '⚡',
    color: 'bg-rose-100 border-rose-200',
    fields: ['power', 'limitations', 'cost', 'users']
  }
};