import { TopicConfig } from './types';
import { Coffee, MessageCircle, Plane, Briefcase, Home, Star } from 'lucide-react';

export const INITIAL_HEARTS = 5;

export const TOPICS: TopicConfig[] = [
  { id: 'greetings', name: 'التحيات (Greetings)', icon: 'hand', color: 'bg-green-500', level: 'Beginner' },
  { id: 'food', name: 'الطعام (Food)', icon: 'coffee', color: 'bg-yellow-500', level: 'Beginner' },
  { id: 'travel', name: 'السفر (Travel)', icon: 'plane', color: 'bg-blue-500', level: 'Intermediate' },
  { id: 'work', name: 'العمل (Work)', icon: 'briefcase', color: 'bg-purple-500', level: 'Intermediate' },
  { id: 'home', name: 'المنزل (Home)', icon: 'home', color: 'bg-pink-500', level: 'Beginner' },
];

export const SUCCESS_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'; // Placeholder
export const ERROR_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'; // Placeholder
