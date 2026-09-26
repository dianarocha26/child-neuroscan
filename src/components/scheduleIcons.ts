import {
  Activity, Apple, ArrowRight, Backpack, Bath, Bed, Bike, Book, BookOpen, Brain, Car, Circle, Cookie,
  Droplets, Dumbbell, Gamepad2, Hand, Heart, MessageCircle, Moon, Music, Palette, Pill, Puzzle, School,
  Shirt, Smile, Stethoscope, Sun, Sunrise, Trees, Tv, User, Users, Utensils, UtensilsCrossed, Zap,
  type LucideIcon
} from 'lucide-react';

/**
 * Icons a schedule activity can show. Keys are stored in `icon_name`; the seeded
 * activity templates use a subset of these. Unknown names fall back to Circle.
 */
export const SCHEDULE_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  Sunrise: { icon: Sunrise, label: 'Wake up' },
  Sun: { icon: Sun, label: 'Morning' },
  Bath: { icon: Bath, label: 'Bath' },
  Droplets: { icon: Droplets, label: 'Wash' },
  Shirt: { icon: Shirt, label: 'Get dressed' },
  Utensils: { icon: Utensils, label: 'Meal' },
  UtensilsCrossed: { icon: UtensilsCrossed, label: 'Eat' },
  Apple: { icon: Apple, label: 'Snack' },
  Cookie: { icon: Cookie, label: 'Treat' },
  Pill: { icon: Pill, label: 'Medicine' },
  Backpack: { icon: Backpack, label: 'Get ready' },
  School: { icon: School, label: 'School' },
  Car: { icon: Car, label: 'Car ride' },
  Book: { icon: Book, label: 'Book' },
  BookOpen: { icon: BookOpen, label: 'Reading' },
  Brain: { icon: Brain, label: 'Learning' },
  MessageCircle: { icon: MessageCircle, label: 'Talking' },
  Hand: { icon: Hand, label: 'Hands-on' },
  Puzzle: { icon: Puzzle, label: 'Puzzle' },
  Palette: { icon: Palette, label: 'Art' },
  Music: { icon: Music, label: 'Music' },
  Gamepad2: { icon: Gamepad2, label: 'Games' },
  Tv: { icon: Tv, label: 'Screen time' },
  Trees: { icon: Trees, label: 'Outside' },
  Bike: { icon: Bike, label: 'Bike' },
  Dumbbell: { icon: Dumbbell, label: 'Exercise' },
  Activity: { icon: Activity, label: 'Activity' },
  Zap: { icon: Zap, label: 'Energy break' },
  Stethoscope: { icon: Stethoscope, label: 'Doctor' },
  User: { icon: User, label: 'Me time' },
  Users: { icon: Users, label: 'Friends' },
  Heart: { icon: Heart, label: 'Calm down' },
  Smile: { icon: Smile, label: 'Happy' },
  Moon: { icon: Moon, label: 'Bedtime' },
  Bed: { icon: Bed, label: 'Sleep' },
  ArrowRight: { icon: ArrowRight, label: 'Next' },
  Circle: { icon: Circle, label: 'Other' }
};

export const scheduleIcon = (name: string | null | undefined): LucideIcon =>
  (name && SCHEDULE_ICONS[name]?.icon) || Circle;
