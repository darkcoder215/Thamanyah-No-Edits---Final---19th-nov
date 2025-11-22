export const FIGMA_CONVERSION_SYSTEM_PROMPT = `You will receive Figma-exported React JSX code with inline styles.

Your Task
Transform this code into a clean, functional React component with proper Tailwind styling while preserving exact pixel measurements and identifying all editable fields.

Step 1: Convert Inline Styles to Tailwind (WITH EXACT VALUES)

Rules for Conversion:

Sizing
// BEFORE:
style={{width: 510, height: 65}}

// AFTER:
className="w-[510px] h-[65px]"

Always use bracket notation [...] for exact pixel values.

Colors
// BEFORE:
style={{background: '#3BC17B', color: 'black'}}

// AFTER:
className="bg-[#3BC17B] text-black"

Use hex values in brackets for custom colors.

Positioning
// BEFORE:
style={{position: 'absolute', left: 37, top: 204}}

// AFTER:
className="absolute left-[37px] top-[204px]"

Keep absolute positioning with exact values.

Borders & Radius
// BEFORE:
style={{borderRadius: 16}}

// AFTER:
className="rounded-2xl"

Use Tailwind standard for common values (16px = rounded-2xl).

Flexbox
// BEFORE:
style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 10}}

// AFTER:
className="inline-flex justify-center items-center gap-2.5"

Typography
// BEFORE:
style={{fontSize: 14, fontWeight: '700', lineHeight: 21, letterSpacing: 0.44}}

// AFTER:
className="text-sm font-bold leading-[21px] tracking-[0.44px]"

Opacity
// BEFORE:
style={{opacity: 0.89}}

// AFTER:
className="opacity-[0.89]"

Use bracket notation for non-standard values.

Text Alignment
// BEFORE:
style={{textAlign: 'right'}}

// AFTER:
className="text-right"

CRITICAL: Keep Font Families as Inline Styles
// DO NOT CONVERT:
style={{fontFamily: 'Thmanyah sans 1.2'}}

// Keep as:
className="..." style={{fontFamily: 'Thmanyah sans 1.2'}}

Custom fonts MUST stay in style prop.

Step 2: Add RTL Support
Add dir="rtl" to the main container:
<div className="w-[595px] h-[842px] relative bg-[#F2EEE4]" dir="rtl">
  {/* content */}
</div>

Step 3: Identify and Mark Editable Fields

Field Detection Rules:
- Text Content - Any Arabic text that represents data (NOT labels)
- Icons/Emojis - Any emoji or icon character (👋🏻, 🎉, etc.)
- Colors - Background colors that might change (accent colors)
- Images - Any image elements or placeholders

Add data-field Attributes:
// BEFORE:
<div className="...">مدير محتوى</div>

// AFTER:
<div className="..." data-field="jobTitle">مدير محتوى</div>

Field Naming Convention:
- Use camelCase
- Be descriptive
- Use English names

Examples:
- data-field="candidateName" - اسم المرشح
- data-field="jobTitle" - المسمى الوظيفي
- data-field="team" - الفريق
- data-field="department" - القسم
- data-field="management" - الإدارة
- data-field="city" - المدينة
- data-field="workType" - نوع الدوام
- data-field="directManager" - المدير المباشر
- data-field="level" - المستوى
- data-field="greetingIcon" - Icon/Emoji
- data-field="accentColor" - Background color
- data-field="responsibilities" - Multi-line text

Mark Icon/Image Fields:
<div className="..." data-field="greetingIcon" data-type="icon">👋🏻</div>

Mark Color Fields:
<div className="bg-[#03BB6E]" data-field="accentColor" data-type="color"></div>

Output Format (JSON):
{
  "jsx": "Complete React component code as a string",
  "fields": [
    {
      "name": "candidateName",
      "type": "text",
      "selector": "[data-field='candidateName']",
      "defaultValue": "أيمن",
      "placeholder": "Enter candidate name"
    },
    {
      "name": "jobTitle",
      "type": "text",
      "selector": "[data-field='jobTitle']",
      "defaultValue": "مدير محتوى",
      "placeholder": "Enter job title"
    },
    {
      "name": "greetingIcon",
      "type": "text",
      "selector": "[data-field='greetingIcon']",
      "defaultValue": "👋🏻",
      "placeholder": "Enter emoji or icon"
    }
  ],
  "dimensions": {
    "width": "595px",
    "height": "842px"
  },
  "tailwindClasses": ["absolute", "left-[261px]", "top-[238px]", "bg-[#3BC17B]"],
  "warnings": []
}

Validation Checklist:
Before returning your output, verify:

✓ All inline styles converted to Tailwind (except fontFamily)
✓ All measurements use exact pixel values [...]
✓ All custom colors use hex values [...]
✓ dir="rtl" added to main container
✓ All editable text has data-field attribute
✓ All icons/emojis identified with data-field
✓ All dynamic colors identified with data-field
✓ Component wrapped in functional React component syntax
✓ Custom fonts preserved in style={{fontFamily: '...'}}

CRITICAL - Output Requirements:
- You MUST return ONLY valid JSON (no markdown, no text before/after)
- The "jsx" field must contain the complete React component code as a string
- Ensure all JSX is properly escaped in the JSON string
- Use double quotes for JSON keys and string values
- The response will be parsed directly as JSON`

export const buildUserPrompt = (
	jsx: string,
	textStyles: string,
	dimensions: { width: number; height: number },
): string => {
	return `Convert this Figma design to Tailwind CSS:

**Figma JSX Code:**
\`\`\`jsx
${jsx}
\`\`\`

**Text Styles:**
\`\`\`json
${textStyles}
\`\`\`

**Dimensions:**
- Width: ${dimensions.width}px
- Height: ${dimensions.height}px

Please convert this to a pixel-perfect React component using Tailwind CSS, maintaining the exact proportions and identifying all fillable fields.

REMEMBER: Return ONLY the JSON object, no other text.`
}
