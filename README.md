# Figma Template Converter

Convert Figma designs to editable PDF templates with auto-fill capabilities.

## Features

✅ **AI-Powered Conversion** - Uses Claude Sonnet 4.5 to convert Figma JSX to Tailwind CSS
✅ **Automatic Field Detection** - Identifies fillable fields in your design
✅ **Field Mapping** - Configure field types, validation, and defaults
✅ **Live Preview** - See your template with real data before exporting
✅ **PDF Export** - Print-perfect PDF generation using browser's native engine
✅ **Template Management** - Save templates for reuse (coming soon)
✅ **Batch Generation** - Generate multiple PDFs from Excel (coming soon)

---

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

New dependencies added:

- `openai` - OpenRouter API client
- `react-syntax-highlighter` - Code syntax highlighting

### 2. Get OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up/Login
3. Navigate to **API Keys**
4. Create new key
5. Copy the key (starts with `sk-or-...`)

### 3. Configure Environment Variables

Add to your `.env.local`:

```bash
# OpenRouter API (for Figma Converter)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
pnpm dev
```

Navigate to: `http://localhost:3000/figma-converter`

---

## Usage Guide

### Step 1: Input Figma Design

1. **Copy JSX from Figma Dev Mode:**
    - Open your Figma file
    - Select a frame/component
    - Go to Dev Mode (Shift + D)
    - Copy the JSX code

2. **Copy Text Styles:**
    - In Figma, select text elements
    - Copy style properties (font-family, font-size, etc.)
    - Paste as JSON or plain text

3. **Upload Screenshot:**
    - Take a screenshot of your Figma design
    - Upload PNG, JPG, or WebP (max 10MB)

4. **Enter Dimensions:**
    - Width and height in pixels (e.g., 1920×1080 or 210×297 for A4)

5. **Set Page Count:**
    - How many pages your template should have

### Step 2: AI Processing

The AI will:

- Analyze your JSX and screenshot
- Convert to Tailwind CSS classes
- Identify fillable fields automatically
- Generate optimized React component

**Wait time:** 10-30 seconds depending on complexity

### Step 3: Field Mapping

Configure detected fields:

| Field             | Description                                 |
| ----------------- | ------------------------------------------- |
| **Field Name**    | Variable name (e.g., `employeeName`)        |
| **Label**         | User-friendly label (e.g., "Employee Name") |
| **Type**          | text, number, date, email, array, image     |
| **Required**      | Toggle if field is mandatory                |
| **Placeholder**   | Hint text for input                         |
| **Default Value** | Pre-fill value                              |

### Step 4: Preview & Export

**Preview Tab:**

- Fill in the form with test data
- See live preview update
- Download as PDF

**Code Tab:**

- View generated JSX code
- Copy to use in your own project
- Syntax highlighted for readability

**PDF Export:**

- Click "Download as PDF"
- Browser print dialog opens
- Save as PDF (preserves fonts, colors, layout)

---

## How It Works

### Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER INPUT                                           │
│    - Figma JSX                                          │
│    - Text Styles                                        │
│    - Screenshot (base64)                                │
│    - Dimensions                                         │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 2. SERVER ACTION (convertFigmaToTailwind)               │
│    - Sends to OpenRouter API                            │
│    - Model: anthropic/claude-sonnet-4.5                 │
│    - Includes screenshot for visual reference           │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 3. AI PROCESSING                                        │
│    - Analyzes JSX structure                             │
│    - Converts to Tailwind utilities                     │
│    - Detects dynamic fields                             │
│    - Maintains pixel-perfect proportions                │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 4. RESPONSE PARSING                                     │
│    - Extracts JSX code                                  │
│    - Extracts field definitions                         │
│    - Validates syntax                                   │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 5. FIELD MAPPING                                        │
│    - User configures field properties                   │
│    - Set validation rules                               │
│    - Define field types                                 │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 6. PREVIEW & FILL                                       │
│    - Render JSX with form data                          │
│    - Live updates on data change                        │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 7. PDF GENERATION                                       │
│    - window.print() → Browser PDF engine                │
│    - Embeds fonts automatically                         │
│    - Preserves colors with print CSS                    │
└─────────────────────────────────────────────────────────┘
```

### PDF Generation Mechanism

**Technology:** Native Browser Print (No external PDF library)

```javascript
const downloadPDF = () => {
	window.print() // Browser handles everything
}
```

**Print CSS:**

```css
@media print {
	.no-print {
		display: none !important;
	}

	* {
		-webkit-print-color-adjust: exact !important;
		print-color-adjust: exact !important;
	}

	@page {
		size: A4;
		margin: 0;
	}
}
```

**Why it works:**

- ✅ Browser's native PDF engine
- ✅ Automatic font embedding
- ✅ Perfect text rendering
- ✅ Selectable text in PDF
- ✅ No external dependencies
- ✅ Works offline after generation

---

## File Structure

```
src/
├── app/
│   ├── figma-converter/
│   │   └── page.tsx                    # Main route
│   └── actions/
│       └── figma-converter.ts          # Server Actions
│
├── components/
│   └── FigmaConverter/
│       ├── FigmaConverterWizard.tsx    # Main wizard
│       └── steps/
│           ├── Step1_Input.tsx         # Input collection
│           ├── Step2_Processing.tsx    # AI processing
│           ├── Step3_FieldMapping.tsx  # Field configuration
│           └── Step5_Preview.tsx       # Preview & export
│
├── types/
│   ├── figma.ts                        # Figma input types
│   ├── template.ts                     # Template types
│   ├── field.ts                        # Field types
│   └── pdf.ts                          # PDF types
│
├── lib/
│   └── openrouter/
│       └── prompts.ts                  # AI prompts
│
└── utils/
    └── errorHandler.ts                 # Error handling
```

---

## Troubleshooting

### AI Processing Fails

**Problem:** "AI processing timed out" or "AI Error"

**Solutions:**

1. Check OpenRouter API key is correct
2. Ensure you have credits in OpenRouter account
3. Try with simpler design (less complex JSX)
4. Check internet connection

### Invalid JSX Error

**Problem:** "Invalid JSX Code"

**Solutions:**

1. Ensure JSX from Figma is complete (no truncated code)
2. Check for unclosed tags
3. Remove any Figma-specific syntax not valid in React

### PDF Export Issues

**Problem:** Fonts not showing / Colors missing

**Solutions:**

1. Ensure print CSS is loaded
2. In print dialog, enable "Background graphics"
3. Use Chrome/Edge for best results (Safari has limitations)

### No Fields Detected

**Problem:** AI didn't detect any fillable fields

**Solutions:**

1. Use clear placeholder patterns in Figma (e.g., {{name}}, [name])
2. Label text layers clearly in Figma
3. Manually proceed to preview (static template)

---

## Future Enhancements (Roadmap)

### Phase 2: Visual Editor

- ⏳ Drag & drop field positioning
- ⏳ Alignment guides
- ⏳ Resize elements
- ⏳ Layer management

### Phase 3: Batch Generation

- ⏳ Excel upload
- ⏳ Field mapping from columns
- ⏳ Generate multiple PDFs
- ⏳ Merge or ZIP output

### Phase 4: Template Library

- ⏳ Save templates to database
- ⏳ Template gallery
- ⏳ Duplicate/Edit templates
- ⏳ Share templates

### Phase 5: Advanced Features

- ⏳ Multi-page templates
- ⏳ Conditional rendering
- ⏳ Formula fields
- ⏳ Image uploads
- ⏳ Signature fields

---

## API Costs

**OpenRouter Pricing** (anthropic/claude-sonnet-4.5):

- ~$0.003 per conversion (input) + ~$0.015 per conversion (output)
- Average: ~$0.02 per template conversion
- 50 conversions ≈ $1.00

**Recommendations:**

- Cache successful conversions
- Use simpler designs to reduce token usage
- Set spending limits in OpenRouter dashboard

---

## Technical Notes

### Why OpenRouter?

1. **Single API** for multiple AI models
2. **Pay-per-use** (no subscriptions)
3. **Compatible** with OpenAI SDK
4. **Fallbacks** if Claude is unavailable

### Why Claude Sonnet 4.5?

1. **Vision capabilities** (can see screenshot)
2. **Code generation** expertise
3. **Long context** window (handles complex designs)
4. **Accuracy** in CSS/React conversion

### Why Browser Print?

1. **No PDF library** needed (smaller bundle)
2. **Perfect rendering** (what you see = what you get)
3. **Font embedding** automatic
4. **Cross-platform** consistent

---

## Contributing

To add new features:

1. **New Step:** Add to `src/components/FigmaConverter/steps/`
2. **Update Wizard:** Add step to `FigmaConverterWizard.tsx`
3. **Update Types:** Add types to `src/types/`
4. **Test:** Ensure wizard flow works end-to-end

---

## Support

For issues or questions:

1. Check troubleshooting section above
2. Review error messages in browser console
3. Check OpenRouter dashboard for API status
4. Open issue on GitHub repository

---

_Last Updated: November 2024_
