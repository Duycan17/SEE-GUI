# Migration Guide: SEE Attributes → China Dataset Attributes

## Overview
This migration replaces the old SEE (Software Effort Estimation) attributes with China Dataset attributes for more accurate effort prediction based on function points and project metrics.

## Database Migration

### Step 1: Run the SQL Migration
Execute the migration file to add new columns to your database:

```bash
# If using Supabase CLI
supabase db push migrations/add_china_attributes.sql

# Or run directly in Supabase SQL Editor
```

The migration adds these new columns to the `tasks` table:
- `attr_afp` (Adjusted Function Points) - Default: 200
- `attr_input` (Input Transactions) - Default: 30
- `attr_output` (Output Transactions) - Default: 40
- `attr_enquiry` (Enquiry Transactions) - Default: 20
- `attr_file` (Internal Files) - Default: 15
- `attr_interface` (External Interfaces) - Default: 10
- `attr_resource` (Resource Constraints) - Default: 5
- `attr_duration` (Project Duration in months) - Default: 12

### Step 2: Optional - Remove Old Attributes
If you want to fully migrate and remove old SEE attributes, uncomment the DROP COLUMN statements in the migration file.

**Warning**: This will permanently delete old attribute data!

## Changes Made

### New Files Created
1. **`lib/china-model.ts`** - China dataset estimation model
2. **`components/china-attribute-slider.tsx`** - UI component for China attributes
3. **`app/api/explain/china/route.ts`** - API endpoint for predictions
4. **`hooks/use-china-prediction.ts`** - React hook for API calls
5. **`components/china-effort-predictor.tsx`** - Standalone predictor UI
6. **`migrations/add_china_attributes.sql`** - Database migration

### Files Updated
1. **`components/task-dialog.tsx`** - Now uses China attributes instead of SEE
2. **`lib/supabase/database.types.ts`** - Added China attribute types

## Attribute Comparison

### Old SEE Attributes (COCOMO-based)
| Attribute | Description | Range |
|-----------|-------------|-------|
| RELY | Reliability requirements | 0.75 - 1.40 |
| CPLX | Complexity | 0.70 - 1.65 |
| ACAP | Analyst Capability | 0.71 - 1.46 |
| PCAP | Programmer Capability | 0.70 - 1.42 |
| TOOL | Tool Support | 0.83 - 1.24 |
| SCED | Schedule Constraint | 1.00 - 1.23 |

### New China Dataset Attributes (Function Point-based)
| Attribute | Description | Range |
|-----------|-------------|-------|
| AFP | Adjusted Function Points | 50 - 1000 |
| Input | Input Transactions | 0 - 200 |
| Output | Output Transactions | 0 - 200 |
| Enquiry | Enquiry Transactions | 0 - 100 |
| File | Internal Files | 0 - 100 |
| Interface | External Interfaces | 0 - 50 |
| Resource | Resource Constraints | 1 - 10 |
| Duration | Project Duration (months) | 1 - 48 |

## Effort Calculation

### Old Formula (SEE/COCOMO)
```
Effort (PM) = 2.94 × (Size_KLOC ^ 1.1) × EAF
where EAF = RELY × CPLX × ACAP × PCAP × TOOL × SCED
```

### New Formula (China Dataset)
```
Effort (hours) = 1200 + Σ(coefficient_i × feature_i) × 50
Effort (PM) = Effort (hours) / 160
```

Coefficients:
- AFP: -1.041
- Input: -2.293
- Output: 0.674
- Enquiry: -0.344
- File: 1.247
- Interface: 2.156
- Resource: 3.892
- Duration: 8.467

## Usage

### Creating a New Task
When you create a new task, you'll now see:
- 8 China dataset attribute sliders
- Real-time effort prediction in both hours and person-months
- Descriptive labels (Very Low, Low, Medium, High, Very High)

### Viewing Existing Tasks
Tasks will display their China attributes with:
- Progress bars showing relative values
- Numeric values and descriptive labels
- Estimated effort in person-months

### Using the API
```typescript
const response = await fetch('/api/explain/china', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    AFP: 200,
    Input: 30,
    Output: 40,
    Enquiry: 20,
    File: 15,
    Interface: 10,
    Resource: 5,
    Duration: 12
  })
});

const { explanation } = await response.json();
console.log(`Effort: ${explanation.prediction} hours`);
console.log(`Effort: ${explanation.prediction_pm} person-months`);
```

## Testing

### 1. Test Database Migration
```sql
-- Check if new columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'tasks'
AND column_name LIKE 'attr_%';
```

### 2. Test Task Creation
1. Navigate to your project dashboard
2. Click "Create New Task"
3. Verify you see 8 China dataset attributes
4. Adjust sliders and watch effort update in real-time
5. Create the task and verify it saves correctly

### 3. Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/explain/china \
  -H "Content-Type: application/json" \
  -d '{
    "AFP": 200,
    "Input": 30,
    "Output": 40,
    "Enquiry": 20,
    "File": 15,
    "Interface": 10,
    "Resource": 5,
    "Duration": 12
  }'
```

Expected: ~7354 person-hours (45.96 person-months)

### 4. Test Standalone Predictor
Navigate to: `http://localhost:3000/china-predictor`

## Rollback Plan

If you need to rollback:

1. **Revert code changes**:
```bash
git revert <commit-hash>
```

2. **Remove new columns** (if migration was applied):
```sql
ALTER TABLE public.tasks
  DROP COLUMN IF EXISTS attr_afp,
  DROP COLUMN IF EXISTS attr_input,
  DROP COLUMN IF EXISTS attr_output,
  DROP COLUMN IF EXISTS attr_enquiry,
  DROP COLUMN IF EXISTS attr_file,
  DROP COLUMN IF EXISTS attr_interface,
  DROP COLUMN IF EXISTS attr_resource,
  DROP COLUMN IF EXISTS attr_duration;
```

3. **Restore old components**:
- Revert `components/task-dialog.tsx`
- Revert `lib/supabase/database.types.ts`

## Benefits of China Dataset Model

1. **More Granular**: 8 attributes vs 6, capturing more project dimensions
2. **Function Point Based**: Industry-standard metric for sizing
3. **Concrete Metrics**: Counts of inputs/outputs vs subjective multipliers
4. **Better for Modern Apps**: Captures API complexity (interfaces, transactions)
5. **Transparent**: Linear model easier to understand than exponential COCOMO
6. **API Integration**: Ready for ML model integration

## Support

For issues or questions:
1. Check the `CHINA_PREDICTOR_README.md` for API details
2. Review `lib/china-model.ts` for calculation logic
3. Inspect `components/task-dialog.tsx` for UI implementation
