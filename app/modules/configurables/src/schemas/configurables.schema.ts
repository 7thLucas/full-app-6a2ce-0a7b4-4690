/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "childName",
      type: "string",
      required: false,
      label: "Child's Name",
      maxLength: 50,
    },
    {
      fieldName: "alarmTime",
      type: "string",
      required: false,
      label: "Wake-up Alarm Time (HH:MM)",
    },
    {
      fieldName: "welcomeMessage",
      type: "string",
      required: false,
      label: "Wake-up Welcome Message",
      maxLength: 120,
    },
    {
      fieldName: "completionMessage",
      type: "string",
      required: false,
      label: "All Done! Celebration Message",
      maxLength: 120,
    },
    {
      fieldName: "routineSteps",
      type: "array",
      required: false,
      label: "Morning Routine Steps",
      item: {
        type: "object",
        fields: [
          { fieldName: "id", type: "string", required: true, label: "ID" },
          { fieldName: "emoji", type: "string", required: true, label: "Emoji Icon" },
          { fieldName: "title", type: "string", required: true, label: "Step Title" },
          { fieldName: "description", type: "string", required: false, label: "Step Description" },
          { fieldName: "durationMinutes", type: "number", required: false, label: "Duration (minutes)", min: 1, max: 60 },
        ],
      },
    },
    {
      fieldName: "enableSchoolDaysOnly",
      type: "boolean",
      required: false,
      label: "Enable on School Days Only (Mon–Fri)",
    },
    {
      fieldName: "parentPin",
      type: "string",
      required: false,
      label: "Parent Mode PIN (4 digits)",
      maxLength: 4,
    },
  ],
};
