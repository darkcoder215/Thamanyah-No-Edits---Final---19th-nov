# Job Offer PDF Generation - Complete Technical Guide

## Overview

This document provides a comprehensive step-by-step explanation of how the Job Offer PDF generation system works, from user input to final PDF delivery.

**Tech Stack Summary:**
- React 19 + TypeScript
- Next.js 16 (App Router)
- Ant Design 5 (Form components)
- Tailwind CSS 4 (Styling)
- CSS Print Media (PDF generation)
- Make.com Webhook (Email delivery)

---

## Step 1: Entry Point & Route Navigation

### Technology: Next.js App Router

**Files:**
- `src/app/(HR)/job-offer/page.tsx`
- `src/components/JobOffer/JobOfferForm.tsx`

**How it works:**

1. User navigates to `/job-offer` route
2. Next.js App Router renders the page component
3. Page imports and renders `JobOfferForm` component

```typescript
// src/app/(HR)/job-offer/page.tsx
import JobOfferForm from "@/components/JobOffer/JobOfferForm"

export default function JobOfferPage() {
  return <JobOfferForm />
}
```

**Tech Details:**
- Route group `(HR)` organizes HR-related pages
- Client-side component with `"use client"` directive
- Lazy loading via Next.js code splitting

---

## Step 2: State Initialization

### Technology: React useState Hook + TypeScript

**Files:**
- `src/components/JobOffer/JobOfferForm.tsx`
- `src/components/Form/JobOfferFormTypes.ts`

**How it works:**

1. Component initializes state with default values
2. TypeScript interface ensures type safety
3. All 30+ form fields stored in single state object

```typescript
// State initialization
const [formData, setFormData] = useState<JobOfferFormData>({
  // Document Configuration
  offerType: "general",           // Career track type
  theme: "general",               // Visual theme
  contractType: "collaboration",  // Employment or collaboration

  // Personal Information
  name: "",
  email: "",
  jobTitle: "",
  jobTitleEn: "",

  // Organizational Structure
  directManager: "",
  directManagerJobTitle: "",
  team: "",
  department: "",
  level: 1,

  // Employment Details
  workTypeParent: "employee",
  workType: "كامل",
  saudiLocation: "inSaudi",

  // Responsibilities
  expectations: [],
  targets: [],

  // Compensation
  isSaudi: false,
  monthlySalary: 0,
  basicSalary: 0,
  housingAllowance: 0,
  transportAllowance: 0,
  additionalAllowances: 0,
  netSalary: 0,
  salaryType: "withAllowances",

  // Authorization
  managerSignName: "",
})

// Additional state
const [currentStep, setCurrentStep] = useState(0)
const [isSubmitted, setIsSubmitted] = useState(false)
const [form] = useForm()  // Ant Design form instance
```

**Tech Details:**
- Single source of truth pattern
- Immutable state updates via spread operator
- Form instance for validation control

---

## Step 3: Career Level System

### Technology: TypeScript Object Mapping

**File:** `src/components/JobOffer/JobOfferForm.tsx:80-116`

**How it works:**

Dynamic level options based on offer type (general/technical/managerial):

```typescript
const levelsMap = {
  managerial: [
    { roleEN: "", level: 0, roleAR: "بدون مستوى" },
    { roleEN: "Lead", level: 4, roleAR: "قائد" },
    { roleEN: "Manager", level: 5, roleAR: "مدير" },
    { roleEN: "Director", level: 6, roleAR: "مدير قسم" },
    { roleEN: "Vice President", level: 7, roleAR: "نائب رئيس" },
    { roleEN: "CXO", level: 8, roleAR: "رئيس الـ" },
  ],
  technical: [
    { roleEN: "Junior", level: 1, roleAR: "مبتدئ" },
    { roleEN: "Level I", level: 2, roleAR: "مستوى I" },
    { roleEN: "Level II", level: 3, roleAR: "مستوى II" },
    { roleEN: "Senior", level: 4, roleAR: "أول" },
    { roleEN: "Staff", level: 5, roleAR: "كبير" },
    { roleEN: "Expert", level: 6, roleAR: "خبير" },
  ],
  general: [
    { roleEN: "Associate", level: 1, roleAR: "مساعد" },
    { roleEN: "Officer", level: 2, roleAR: "مسؤول" },
    { roleEN: "Specialist", level: 3, roleAR: "أخصائي" },
    { roleEN: "Sr. Specialist", level: 4, roleAR: "أخصائي أول" },
    { roleEN: "Staff", level: 5, roleAR: "كبير" },
  ],
}

// Dynamic update when offerType changes
const [levels, setLevels] = useState(levelsMap["general"])

useEffect(() => {
  setLevels(levelsMap[formData.offerType || "general"])
}, [formData.offerType])
```

**Tech Details:**
- Lookup table pattern for career tracks
- useEffect syncs levels with offer type
- Bilingual labels (Arabic + English)

---

## Step 4: Multi-Step Form Navigation

### Technology: Ant Design Steps + React State

**File:** `src/components/JobOffer/JobOfferForm.tsx:137-206`

**How it works:**

3-step wizard with validation between steps:

```typescript
// Step navigation
const nextStep = () => {
  form.validateFields()
    .then(() => {
      if (currentStep < 2) {
        setCurrentStep((prev) => Math.min(prev + 1, 2))
      } else {
        handleSubmit()  // Final step triggers preview
      }
    })
    .catch((errorInfo: Error) => {
      console.log("Validation Failed:", errorInfo)
    })
}

const prevStep = () => {
  if (currentStep === 0) {
    router.push("/offer")  // Go back to selection
    return
  }
  setCurrentStep((prev) => Math.max(prev - 1, 0))
}

// UI Rendering
<Steps current={currentStep}>
  <Step title="معلومات أساسية" />
  <Step title="المتوقعات والمستهدفات" />
  <Step title="معلومات الراتب" />
</Steps>

{currentStep === 0 && <BasicInfo ... />}
{currentStep === 1 && <ExpectationsAndTargets ... />}
{currentStep === 2 && <SalaryInfo ... />}
```

**Tech Details:**
- Ant Design Steps component for visual progress
- Form validation gates step progression
- Conditional rendering based on currentStep
- Router navigation for back to selection

---

## Step 5: Form Input Components

### Technology: Ant Design Form + Controlled Components

### Step 5a: Basic Info (Step 1)

**File:** `src/components/Form/BasicInfo.tsx`

**Input Groups:**

```typescript
// Group 1: Document Configuration
<Form.Item label="نوع العقد" name="contractType">
  <Radio.Group
    value={formData.contractType}
    options={[
      { value: "employment", label: "توظيف" },
      { value: "collaboration", label: "تعاون" },
    ]}
    onChange={(e) => setFormData({
      ...formData,
      contractType: e.target.value
    })}
  />
</Form.Item>

// Group 2: Theme Selection with Image Upload
{formData.theme === "league" && (
  <Upload.Dragger
    beforeUpload={(file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({
          ...formData,
          leagueCoverImage: e.target?.result as string  // Base64
        })
      }
      reader.readAsDataURL(file)
      return false  // Prevent actual upload
    }}
  />
)}

// Group 3: Employee Information
<Form.Item label="الاسم" name="name" rules={[{ required: true }]}>
  <Input onChange={(e) => setFormData({
    ...formData,
    name: e.target.value
  })} />
</Form.Item>

// Group 4: Conditional Fields
{formData.workTypeParent === "contract" && (
  <Form.Item label="مدة التعاقد" name="contractDuration">
    <Input onChange={...} />
  </Form.Item>
)}

// Group 5: Level Selection
<Form.Item label="المستوى" name="level">
  <Select
    value={formData.level}
    onChange={(value) => setFormData({ ...formData, level: value })}
  >
    {levels.map((level) => (
      <Option key={level.level} value={level.level}>
        {level.roleAR} | {level.roleEN}
      </Option>
    ))}
  </Select>
</Form.Item>
```

**Tech Details:**
- Controlled components with value binding
- FileReader API for image to Base64 conversion
- Conditional rendering for dependent fields
- Ant Design validation rules

### Step 5b: Expectations & Targets (Step 2)

**File:** `src/components/Form/ExpectationsAndTargets.tsx`

**Dynamic List Inputs:**

```typescript
// Refs for auto-focus
const expectationRefs = useRef<(InputRef | null)[]>([])

// Add item
const addExpectation = () => {
  setFormData({
    ...formData,
    expectations: [...formData.expectations, ""],
  })
}

// Remove item
const removeExpectation = (index: number) => {
  const newExpectations = formData.expectations.filter((_, i) => i !== index)
  setFormData({ ...formData, expectations: newExpectations })
}

// Update item
const handleExpectationChange = (index: number, value: string) => {
  const newExpectations = [...formData.expectations]
  newExpectations[index] = value
  setFormData({ ...formData, expectations: newExpectations })
}

// Multi-line paste handling
const onPaste = (event, index, inputName) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData("text")
  const newItems = pastedData.split("\n")  // Split by lines

  setFormData((prev) => ({
    ...prev,
    [inputName]: [
      ...prev[inputName].slice(0, index),
      ...newItems,
      ...prev[inputName].slice(index + 1),
    ],
  }))
}

// UI with keyboard shortcuts
<Input
  ref={(el) => expectationRefs.current[index] = el}
  value={expectation}
  onChange={(e) => handleExpectationChange(index, e.target.value)}
  onPaste={(e) => onPaste(e, index, "expectations")}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      addExpectation()
      setTimeout(() => {
        expectationRefs.current[index + 1]?.focus()
      }, 0)
    }
  }}
/>
```

**Tech Details:**
- useRef for input focus management
- Array immutability with filter/spread
- Clipboard API for paste handling
- Auto-split pasted multi-line text
- Enter key adds new item + auto-focus

### Step 5c: Salary Info (Step 3)

**File:** `src/components/Form/SalaryInfo.tsx`

**Auto-Calculation System:**

```typescript
const calculateSalary = useCallback(
  (monthly: number, isSaudi: boolean, deductionPercent: number) => {
    // Base calculation
    const notSaudiBasicSalary = monthly / 1.28

    // Apply deduction for Saudi
    const baseSalary = isSaudi
      ? notSaudiBasicSalary * ((100 - deductionPercent) / 100)
      : notSaudiBasicSalary

    // Allowances as percentages
    const housingAllowance = baseSalary * 0.25      // 25%
    const transportAllowance = baseSalary * 0.03   // 3%

    // Insurance deduction (Saudi only)
    const insurance = (baseSalary + housingAllowance) * 0.0975  // 9.75%
    const netSalary = monthly - insurance

    // Additional allowances (remainder)
    const additionalAllowances =
      monthly - housingAllowance - transportAllowance - baseSalary

    // Update form fields
    form.setFields([
      { name: "basicSalary", value: Math.round(baseSalary) },
      { name: "housingAllowance", value: Math.round(housingAllowance) },
      { name: "transportAllowance", value: Math.round(transportAllowance) },
      { name: "netSalary", value: isSaudi ? Math.round(netSalary) : 0 },
      { name: "additionalAllowances", value: isSaudi ? Math.round(additionalAllowances) : 0 },
    ])

    // Update state
    setFormData((prev) => ({
      ...prev,
      basicSalary: Math.round(baseSalary),
      housingAllowance: Math.round(housingAllowance),
      transportAllowance: Math.round(transportAllowance),
      netSalary: isSaudi ? Math.round(netSalary) : 0,
      additionalAllowances: isSaudi ? Math.round(additionalAllowances) : 0,
    }))
  },
  [form, setFormData]
)

// Trigger calculation on input
<Input
  type="number"
  onChange={(e) => {
    const monthlySalary = parseInt(e.target.value)
    if (!isNaN(monthlySalary)) {
      setFormData({ ...formData, monthlySalary })
      if (monthlySalary > 0 &&
          formData.salaryType !== "netOnly" &&
          formData.contractType !== "collaboration") {
        calculateSalary(monthlySalary, formData.isSaudi, formData.deductionPercent ?? 40)
      }
    }
  }}
/>
```

**Salary Calculation Formula:**
```
Basic Salary = Monthly / 1.28 * (100 - deduction%) / 100
Housing = Basic * 25%
Transport = Basic * 3%
Insurance = (Basic + Housing) * 9.75%
Net = Monthly - Insurance
Additional = Monthly - Basic - Housing - Transport
```

**Tech Details:**
- useCallback for memoized calculation
- Ant Design form.setFields for controlled updates
- Conditional calculation based on contract type
- Three deduction tiers: 30% (stars), 40% (<39K), 60% (>40K)

---

## Step 6: Form Submission & Preview Mode

### Technology: React Conditional Rendering

**File:** `src/components/JobOffer/JobOfferForm.tsx:129-161`

**How it works:**

```typescript
const handleSubmit = () => {
  setIsSubmitted(true)
}

const handleEdit = () => {
  setIsSubmitted(false)
}

// Conditional rendering based on submission state
if (isSubmitted) {
  return (
    <JobOfferPreview
      formData={formData}
      onEdit={handleEdit}
      levels={levels}
    />
  )
}

// Otherwise render the form
return (
  <Form ...>
    {/* Multi-step form */}
  </Form>
)
```

**Tech Details:**
- Boolean toggle switches between form and preview
- Full formData passed to preview
- Edit callback allows returning to form
- No data persistence to backend (client-side only)

---

## Step 7: Preview Component Structure

### Technology: React Component Composition

**File:** `src/components/JobOffer/JobOfferPreview.tsx`

**How it works:**

```typescript
const JobOfferPreview: React.FC<JobOfferPreviewProps> = ({
  formData,
  levels,
  onEdit
}) => {
  // Dynamic page title
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.title = `العرض الوظيفي - ${formData.name}`
    }
  }, [formData.name])

  // Manager lookup
  const selectedManager = formData.managerSignName
    ? managers.find((m) => m.value === formData.managerSignName)
    : null

  return (
    <>
      {/* Theme wrapper */}
      <div className={`overflow-x-auto ${
        formData.theme === "league" ? "theme-league" : ""
      }`}>

        {/* Page 1: Cover */}
        <Cover
          forLeague={formData.theme === "league"}
          name={formData.name}
          cover={formData.leagueCoverImage}
          title={formData.contractType === "employment"
            ? "عرض وظيفي"
            : "عرض تعاوني"}
        />

        {/* Pages 2-3: Content (varies by contract type) */}
        {formData.contractType === "employment" ? (
          <>
            <BasicInfoPage formData={formData} levels={levels} />
            <SalaryPage formData={formData} />
          </>
        ) : (
          <TempBasicInfoPage formData={{
            name: formData.name,
            jobTitle: formData.jobTitle,
            // ... mapped fields for collaboration template
          }} />
        )}

        {/* Page 4: Outro */}
        <Outro />
      </div>

      {/* Action buttons */}
      <PreviewActions
        onEdit={onEdit}
        onFileUpload={handleFileUpload}
        email={formData.email}
      />
    </>
  )
}
```

**Tech Details:**
- Component composition pattern
- Conditional page rendering based on contract type
- Theme class applied to wrapper
- Manager data lookup from predefined list

---

## Step 8: A4 Page Rendering

### Technology: CSS Size Units + Tailwind CSS

**Files:**
- `src/app/globals.css`
- Page components (`Cover.tsx`, `BasicInfoPage.tsx`, etc.)

**How it works:**

### CSS Page Definition

```css
/* globals.css */
.page {
  /* A4 dimensions */
  size: A4;
  height: 297mm;
  width: 210mm;

  /* Styling */
  --background: #f2eee4;
  --foreground: #171717;
  background: var(--background);
  color: var(--foreground);
  border-top: 18px solid var(--full-green);

  /* Spacing */
  padding-top: 120px;
  padding-bottom: 120px;
  padding-inline: 42px;
  margin-bottom: 1rem;

  /* Prevent overflow */
  overflow-y: hidden;
  position: relative;
}
```

### Page Component Structure

```jsx
// BasicInfoPage.tsx
<div className="page font-8-sans text-[14pt] font-light">
  {/* Content sections */}

  <PageFooter />  {/* Absolute positioned at bottom */}
</div>
```

### Footer Positioning

```jsx
// PageFooter.tsx
<footer className="absolute right-0 bottom-[55px]
                   flex w-[210mm] items-end justify-between px-[55px]">
  <p>{showToday && formatToday()}</p>
  <svg>{/* Thmanyah logo */}</svg>
</footer>
```

**Tech Details:**
- CSS `size: A4` for print sizing
- Fixed mm dimensions ensure exact A4
- Absolute positioning for footer
- Overflow hidden prevents content spill
- CSS variables for theme colors

---

## Step 9: Template Data Binding

### Technology: JSX Interpolation + Conditional Rendering

**Files:** All Preview components

**Binding Patterns:**

### Direct Interpolation
```jsx
<h1>أهلًا {formData.name.split(" ")[0]} 👋🏼</h1>
<strong>{formData.jobTitle}</strong>
```

### Number Formatting
```typescript
// helpers.ts
export const formatNumbers = (number: number) => {
  return new Intl.NumberFormat("ar").format(number)
}

// Usage
<strong>({formatNumbers(formData.monthlySalary)}) ر.س</strong>
// Output: (١٦٬٠٠٠) ر.س
```

### Array Mapping
```jsx
{formData.expectations.map((item, index) => (
  <li key={index}>{item}</li>
))}
```

### Conditional Sections
```jsx
{formData.expectations.length > 0 && (
  <section>
    <h2>في هذه الوظيفة نتوقع منك التالي:</h2>
    <UL list={formData.expectations} />
  </section>
)}
```

### Ternary Rendering
```jsx
{formData.saudiLocation === "inSaudi" ? (
  <div>التأمين الطبي (بوبا أعلى فئة)</div>
) : (
  <div>التأمين الطبي (بدل مادي)</div>
)}
```

### Dynamic Classes
```jsx
className={`${forLeague ? "bg-green-light" : "bg-green-full"}`}
```

### Dynamic Font Sizing
```jsx
<strong className={(() => {
  const len = formData.jobTitle.length
  if (len < 52) return "text-[13pt]"
  if (len < 55) return "text-[12pt]"
  if (len < 62) return "text-[11pt]"
  return "text-[9pt]"
})()}>
  {formData.jobTitle}
</strong>
```

**Tech Details:**
- Intl.NumberFormat for Arabic numerals
- IIFE for inline computed classes
- Defensive rendering with && operator
- Key prop for list rendering optimization

---

## Step 10: Theme System

### Technology: CSS Custom Properties + Conditional Classes

**File:** `src/app/globals.css:165-212`

**How it works:**

### Standard Theme
```css
:root {
  --background: #f2eee4;      /* Cream */
  --foreground: #171717;      /* Dark gray */
  --full-green: #54b974;      /* Primary green */
  --light-green: #afe4b6;     /* Secondary green */
}
```

### League Theme Override
```css
/* Applied when .theme-league wrapper present */
body:has(.theme-league) {
  --background: #000;
  --foreground: #fff;
}

.theme-league .page {
  --foreground: #fff;
  --color-green-light: rgba(255, 255, 255, 0.08);
  border: 0 !important;
}

/* Gradient backgrounds */
.theme-league .page:nth-child(odd) {
  --background: linear-gradient(to bottom, #000000, #003f24);
}

.theme-league .page:nth-child(even) {
  --background: linear-gradient(to top, #000000, #003f24);
}

/* Corner decorations */
.theme-league .page:not(.no-corners)::before,
.theme-league .page:not(.no-corners)::after {
  content: "";
  position: absolute;
  width: 45px;
  height: 45px;
  background-image: url("/icons/frame-white.svg");
}
```

### Theme-Specific Icons
```typescript
const featuresIcons = {
  league: {
    plane: "airplane-green.svg",
    arrow: "arrow-green.svg",
    // ... green-tinted versions
  },
  general: {
    plane: "airplane.png",
    arrow: "arrow.png",
    // ... standard versions
  }
}

// Usage
<Image src={`/icons/${featuresIcons[formData.theme || "general"].plane}`} />
```

**Tech Details:**
- CSS `:has()` selector for body styling
- `nth-child` for alternating gradients
- Pseudo-elements for decorative corners
- Icon path switching based on theme

---

## Step 11: Typography System

### Technology: CSS @font-face + Tailwind Custom Classes

**File:** `src/layout/AntdLayout.tsx` (font loading)

**Custom Font Classes:**

```css
/* globals.css */
.font-8-sans {
  font-family: var(--thmanyah-sans);
}

.font-8-display {
  font-family: var(--thmanyah-display);
}

.font-8-serif {
  font-family: var(--thmanyah-serif);
}

/* Stylistic alternates */
.styled-font {
  font-feature-settings: "ss01" 1;
}
```

**Font Usage:**
```jsx
<h1 className="font-8-serif text-[30pt] font-bold">Title</h1>
<h2 className="font-8-display text-[25pt]">Name</h2>
<p className="font-8-sans text-[14pt] font-light">Body text</p>
```

**Font Files:**
```
public/fonts/thmanyah/
├── display/
│   ├── Light.woff2
│   ├── Regular.woff2
│   ├── Medium.woff2
│   ├── Bold.woff2
│   └── Black.woff2
├── serif-text/
└── sans/
```

**Tech Details:**
- Three Thmanyah brand fonts
- Point sizes for print accuracy
- Font weights: 300, 400, 500, 700, 900
- OpenType features enabled

---

## Step 12: Print Optimization

### Technology: CSS Print Media Queries

**File:** `src/app/globals.css:76-108`

**How it works:**

```css
@media print {
  /* Hide interactive elements */
  .hide-print {
    display: none !important;
  }

  /* Page styling for print */
  .page-2,
  .page {
    outline: 1px solid #000;
    border: 0;
    margin: 0;
    -webkit-print-color-adjust: exact;  /* Preserve colors */
  }

  /* Remove unnecessary padding */
  .p-5,
  .p-10 {
    padding: 0 !important;
  }

  /* Page size configuration */
  @page {
    size: A4;
    border: 0;
    margin: 0;
    -webkit-print-color-adjust: exact;
  }
}
```

**Color Preservation:**
```css
body {
  color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
```

**Hidden Elements:**
```jsx
// PreviewActions.tsx
<div className="hide-print fixed ...">
  {/* Action buttons hidden when printing */}
</div>
```

**Tech Details:**
- `@page` rule sets print page size
- `-webkit-print-color-adjust: exact` forces background printing
- `hide-print` class removes UI from print
- Zero margins for edge-to-edge printing

---

## Step 13: PDF Generation via Browser Print

### Technology: Browser Print API + window.print()

**File:** `src/components/Shared/PreviewActions.tsx:52-57`

**How it works:**

```typescript
<Button
  type="primary"
  onClick={() => {
    window.print()
    isSendDisabled(false)  // Enable send button after printing
  }}
>
  1. حمّل العرض
</Button>
```

**Process:**
1. User clicks "حمّل العرض" button
2. `window.print()` opens browser print dialog
3. Print CSS media queries activate
4. User selects "Save as PDF" destination
5. Browser renders HTML/CSS as PDF
6. PDF saved to user's device

**Print Dialog Settings:**
- Destination: Save as PDF
- Paper size: A4
- Margins: None
- Background graphics: Enabled

**Tech Details:**
- No external PDF library required
- Browser handles PDF rendering
- CSS ensures pixel-perfect A4 output
- Works in all modern browsers

---

## Step 14: Design Mode for Quick Edits

### Technology: Browser contentEditable API

**File:** `src/components/Shared/PreviewActions.tsx:16-21`

**How it works:**

```typescript
const [designMode, setDesignMode] = useState(false)

const toggleDesignMode = (checked: boolean) => {
  setDesignMode(checked)
  if (typeof document !== "undefined") {
    document.designMode = checked ? "on" : "off"
  }
}

// UI
<Checkbox
  checked={designMode}
  onChange={(e) => toggleDesignMode(e.target.checked)}
>
  🪄 تعديل سريع؟
</Checkbox>
```

**Behavior:**
- When enabled: All text on page becomes editable
- User can click and type to modify content
- Changes are temporary (not saved to state)
- Print captures the edited content

**Tech Details:**
- `document.designMode` is a browser API
- Enables WYSIWYG editing of any page
- Useful for last-minute text adjustments
- Changes lost on page refresh

---

## Step 15: PDF Upload & Email Delivery

### Technology: FormData API + Make.com Webhook

**File:** `src/components/JobOffer/JobOfferPreview.tsx:18-30`

**How it works:**

### Upload Handler
```typescript
const handleFileUpload = async (file: File) => {
  // Create multipart form data
  const data = new FormData()
  data.append("pdf", file)
  data.append("offerData", JSON.stringify(formData))

  // Send to webhook
  const response = await fetch(
    "https://hook.eu1.make.com/y7agyrr6d16y57vrcnuz1qv1h16e8j80",
    {
      method: "POST",
      body: data,
    }
  )

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
}
```

### Upload UI
```typescript
// PreviewActions.tsx:65-79
<Button
  onClick={() => document.getElementById("pdf-upload")?.click()}
  loading={loading}
  disabled={sendDisabled || !email}
>
  2. أرسله لبريد الموظف
</Button>

<input
  id="pdf-upload"
  type="file"
  accept="application/pdf"
  style={{ display: "none" }}
  onChange={handleFileUpload}
/>
```

### Workflow
1. User saves PDF from print dialog
2. User clicks "أرسله لبريد الموظف"
3. Hidden file input triggers
4. User selects saved PDF
5. PDF + form data sent to Make.com webhook
6. Make.com sends email with PDF attachment to `formData.email`

**Tech Details:**
- FormData for multipart/form-data encoding
- Hidden input triggered programmatically
- Webhook URL points to Make.com (Integromat)
- Form data included for email personalization
- Loading state prevents double submission

---

## Step 16: Export/Import Feature

### Technology: JSON Serialization + File Download API

**File:** `src/components/Form/ExportImportBtn.tsx`

**How it works:**

### Export
```typescript
const handleExport = () => {
  const dataStr = JSON.stringify(formData, null, 2)
  const blob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `job-offer-${formData.name || "draft"}.json`
  link.click()

  URL.revokeObjectURL(url)
}
```

### Import
```typescript
const handleImport = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const imported = JSON.parse(e.target?.result as string)
    setFormData(imported)
  }
  reader.readAsText(file)
}
```

**Use Cases:**
- Save draft for later
- Share form data with colleagues
- Backup before making changes
- Template for similar offers

**Tech Details:**
- JSON.stringify for serialization
- Blob API for file creation
- URL.createObjectURL for download
- FileReader for import parsing

---

## Complete Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    JOB OFFER PDF FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. NAVIGATION                                              │
│     Next.js Router → /job-offer → JobOfferForm              │
│                                                             │
│  2. STATE INIT                                              │
│     useState(JobOfferFormData) → 30+ fields                 │
│                                                             │
│  3. FORM INPUT (3 Steps)                                    │
│     Step 1: BasicInfo → Ant Design Form                     │
│     Step 2: ExpectationsAndTargets → Dynamic Lists          │
│     Step 3: SalaryInfo → Auto-Calculate                     │
│                                                             │
│  4. VALIDATION                                              │
│     Ant Design form.validateFields() → next step            │
│                                                             │
│  5. SUBMIT                                                  │
│     setIsSubmitted(true) → Conditional Render               │
│                                                             │
│  6. PREVIEW RENDER                                          │
│     JobOfferPreview → Page Components                       │
│     ├── Cover (Page 1)                                      │
│     ├── BasicInfoPage (Page 2)                              │
│     ├── SalaryPage (Page 3)                                 │
│     └── Outro (Page 4)                                      │
│                                                             │
│  7. DATA BINDING                                            │
│     formData → JSX Interpolation → HTML                     │
│                                                             │
│  8. STYLING                                                 │
│     CSS A4 Pages + Tailwind + Custom Fonts                  │
│                                                             │
│  9. PRINT OPTIMIZATION                                      │
│     @media print → hide UI, preserve colors                 │
│                                                             │
│  10. PDF GENERATION                                         │
│      window.print() → Browser Print Dialog → Save as PDF    │
│                                                             │
│  11. DELIVERY                                               │
│      Upload PDF → Make.com Webhook → Email to Employee      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Summary Table

| Step | Technology | Purpose |
|------|------------|---------|
| Routing | Next.js App Router | Page navigation |
| State | React useState | Form data management |
| Forms | Ant Design Form | Input components, validation |
| Lists | React useRef | Dynamic input arrays |
| Calculation | JavaScript | Salary breakdown |
| Rendering | React JSX | Template population |
| Styling | Tailwind CSS | Utility classes |
| Layout | CSS (mm units) | A4 page sizing |
| Typography | Custom @font-face | Thmanyah fonts |
| Themes | CSS Custom Properties | Color schemes |
| Print | CSS @media print | Print optimization |
| PDF | Browser Print API | PDF generation |
| Editing | document.designMode | Quick text edits |
| Upload | FormData API | PDF transmission |
| Webhook | Make.com | Email delivery |
| Export | JSON + Blob API | Data backup |

---

*This guide serves as a complete technical reference for understanding and maintaining the Job Offer PDF generation system.*
