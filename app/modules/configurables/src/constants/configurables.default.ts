/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TRoutineStep = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  durationMinutes: number;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  childName?: string;
  alarmTime?: string;
  welcomeMessage?: string;
  completionMessage?: string;
  routineSteps?: TRoutineStep[];
  enableSchoolDaysOnly?: boolean;
  parentPin?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Morning Buddy",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#F59E0B",
    secondary: "#38BDF8",
    accent: "#22C55E",
  },
  childName: "Buddy",           // fill it here
  alarmTime: "06:30",           // fill it here — HH:MM format
  welcomeMessage: "Good morning! Time to rise and shine! ☀️",  // fill it here
  completionMessage: "Amazing! You are ready for school! 🎉",  // fill it here
  routineSteps: [
    {
      id: "bath",
      emoji: "🚿",
      title: "Bath & Wash Up",
      description: "Shower or wash your face and hands",
      durationMinutes: 10,
    },
    {
      id: "dressed",
      emoji: "👕",
      title: "Get Dressed",
      description: "Put on your school uniform",
      durationMinutes: 5,
    },
    {
      id: "breakfast",
      emoji: "🥣",
      title: "Eat Breakfast",
      description: "Have a healthy breakfast to start your day",
      durationMinutes: 15,
    },
    {
      id: "study",
      emoji: "📚",
      title: "Study Review",
      description: "Check your homework and pack your school bag",
      durationMinutes: 10,
    },
    {
      id: "school",
      emoji: "🏫",
      title: "Leave for School",
      description: "Shoes on, bag on — let's go!",
      durationMinutes: 5,
    },
  ],
  enableSchoolDaysOnly: true,   // fill it here
  parentPin: "1234",            // fill it here
};
