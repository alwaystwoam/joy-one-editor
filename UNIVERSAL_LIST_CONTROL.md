# Universal List Control

A flexible, content-agnostic list editing component designed for managing diverse content types with a consistent user experience across schedule items, people, hotels, FAQs, travel information, and attractions.

## Overview

The Universal List Control provides a unified interface for CRUD operations, bulk actions, drag-and-drop reordering, and visual grouping across multiple content types. It separates the **data presentation logic** (Row Components) from the **editing logic** (Modal Components) while the core `UniversalListEditor` handles interaction modes, selection state, and list operations.

### Design Philosophy

- **Single component, multiple content types** — One interaction pattern for all list-based content
- **Mode-based interactions** — Clear separation between viewing, selecting, and reordering
- **Content-type agnostic** — Row and Modal components are pluggable
- **Relationship-aware** — Handles bi-directional links between content types (e.g., People ↔ Schedule)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App (Main)                              │
│  - Manages all data state (schedule, people, hotels, etc.)      │
│  - Handles cross-content relationships                          │
│  - Provides groupBy functions and delete checks                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   UniversalListEditor                           │
│  - Mode management (default, reorder, multiselect)              │
│  - Selection state                                              │
│  - Drag-and-drop context (via @dnd-kit)                         │
│  - CRUD orchestration                                           │
│  - Keyboard shortcuts                                           │
│  - Grouping/sectioning                                          │
└─────────────────────────────────────────────────────────────────┘
                    │                     │
                    ▼                     ▼
        ┌───────────────────┐   ┌───────────────────┐
        │   Row Component   │   │  Modal Component  │
        │   (per content)   │   │   (per content)   │
        │                   │   │                   │
        │  - Display logic  │   │  - Edit form      │
        │  - Visual layout  │   │  - Validation     │
        │  - Mode states    │   │  - Save/Delete    │
        └───────────────────┘   └───────────────────┘
```

---

## UniversalListEditor Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Section title (currently unused in header) |
| `items` | `array` | Yes | Array of data objects, each must have unique `id` |
| `setItems` | `function` | Yes | State setter for updating items array |
| `RowComponent` | `React.Component` | Yes | Component for rendering each list row |
| `ModalComponent` | `React.Component` | Yes | Component for add/edit modal |
| `emptyTitle` | `string` | Yes | Title shown when list is empty |
| `emptyText` | `string` | Yes | Description shown when list is empty |
| `addLabel` | `string` | Yes | Button text for adding new items |
| `modalProps` | `object` | No | Additional props passed to Modal (e.g., related data) |
| `rowProps` | `object` | No | Additional props passed to each Row (e.g., linked people) |
| `onDeleteCheck` | `function` | No | Callback before delete to handle relationships/confirmation |
| `groupBy` | `function` | No | Function to group items into sections |

### Example Usage

```jsx
<UniversalListEditor
  title="Schedule"
  items={schedule}
  setItems={setSchedule}
  RowComponent={ScheduleRow}
  ModalComponent={ScheduleModal}
  emptyTitle="No schedule items yet"
  emptyText="Start building your event timeline"
  addLabel="Add Schedule Item"
  modalProps={{ people }}
  rowProps={{ people }}
  groupBy={groupScheduleByDate}
  onDeleteCheck={checkScheduleDelete}
/>
```

---

## Interaction Modes

The list operates in three distinct modes, each with its own header UI and interaction behaviors:

### 1. Default Mode

The standard viewing/editing mode.

**Behaviors:**
- Click row → Opens edit modal
- Hover row → Shows inline delete button (trash icon)
- Click delete → Shows confirmation dialog, then removes item

**Header Actions:**
- "Select..." button (ghost style) → Switches to multiselect mode
- "Reorder" button (ghost style) → Switches to reorder mode  
- "Add [Item]" button (outline style) → Opens add modal

### 2. Reorder Mode

Drag-and-drop mode for manual ordering.

**Behaviors:**
- Drag handle appears on each row (grip icon)
- Items can be dragged to new positions
- Click anywhere except handle does nothing
- Delete buttons hidden
- Section headers fade but remain visible

**Header Actions:**
- "Done" button → Returns to default mode

**Implementation:**
Uses `@dnd-kit/core` and `@dnd-kit/sortable` with:
- `PointerSensor` (8px activation distance)
- `KeyboardSensor` (for accessibility)
- `verticalListSortingStrategy`

### 3. Multi-Select Mode

Bulk selection mode for batch operations.

**Behaviors:**
- Checkboxes appear on each row
- Click row → Toggles selection
- Delete buttons hidden
- Visual indication of selected items (blue background)

**Header Actions:**
- "Select All" / "Deselect All" toggle
- Selection count indicator
- "Delete" button (appears when items selected)
- "Cancel" button → Returns to default mode

**Keyboard Shortcuts:**
- `Cmd/Ctrl + A` → Select/deselect all
- `Escape` → Cancel selection and return to default

---

## Row Component Interface

Each content type requires a custom Row component that receives standardized props:

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `item` | `object` | The data item to display |
| `mode` | `string` | Current mode: `'default'` \| `'reorder'` \| `'multiselect'` |
| `isSelected` | `boolean` | Whether item is selected (multiselect mode) |
| `onSelect` | `function` | Callback when item is selected: `(id) => void` |
| `onDelete` | `function` | Direct delete callback: `(id) => void` (used by modals) |
| `onRequestDelete` | `function` | Request deletion with confirm dialog: `(id, itemName?) => void` |
| `onClick` | `function` | Callback when item is clicked: `(item) => void` |
| `listeners` | `object` | Drag listeners from `@dnd-kit/sortable` (spread on drag handle) |

### Additional Props (via `rowProps`)

Content-specific props can be passed through `rowProps`:
- `people` — Array of people for showing linked speakers on schedule items

### Row Component Pattern

```jsx
const ExampleRow = ({ item, mode, isSelected, onSelect, onDelete, onRequestDelete, onClick, listeners }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showLeadingAction = mode === 'reorder' || mode === 'multiselect';
  
  return (
    <div
      style={{
        ...styles.row,
        ...(isHovered && mode === 'default' ? styles.rowHover : {}),
        ...(isSelected ? styles.rowSelected : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (mode === 'multiselect') onSelect(item.id);
        else if (mode === 'default') onClick(item);
      }}
    >
      {/* Animated leading action (checkbox or drag handle) */}
      <div style={{
        ...styles.rowLeadingAction,
        width: showLeadingAction ? '32px' : '0px',
        opacity: showLeadingAction ? 1 : 0,
      }}>
        {mode === 'reorder' ? (
          <div style={styles.dragHandle} {...listeners}>
            <GripVertical size={18} />
          </div>
        ) : (
          <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxChecked : {}) }}>
            {isSelected && <Check size={14} color="#fff" />}
          </div>
        )}
      </div>
      
      {/* Row content */}
      <div style={styles.rowContent}>
        <div style={styles.rowPrimary}>{item.name}</div>
        <div style={styles.rowSecondary}>{item.description}</div>
      </div>
      
      {/* Delete button - uses custom confirm dialog */}
      <button
        className="btn-icon"
        style={{ 
          ...styles.deleteButton, 
          ...(isHovered && mode === 'default' ? styles.deleteButtonVisible : {}),
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onRequestDelete(item.id, item.name); // Shows custom confirm dialog
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
```

---

## Modal Component Interface

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `item` | `object \| null` | Item to edit, or `null` for creating new |
| `onSave` | `function` | Save callback: `(item) => void` |
| `onClose` | `function` | Close modal callback: `() => void` |
| `onDelete` | `function` | Delete callback: `(id) => void` |

### Additional Props (via `modalProps`)

Content-specific data needed for the form:
- `people` — For ScheduleModal to show linked speakers
- `schedule` — For PersonModal to allow session linking

### Modal Structure

```jsx
const ExampleModal = ({ item, onSave, onClose, onDelete }) => {
  const [form, setForm] = useState(item || {
    // Default values for new items
    name: '',
    description: '',
  });
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2>{item ? 'Edit Item' : 'Add Item'}</h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        {/* Body - Form fields */}
        <div style={styles.modalBody}>
          <input 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
          />
        </div>
        
        {/* Footer */}
        <div style={styles.modalFooter}>
          {item && <button onClick={() => onDelete(item.id)}>Delete</button>}
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSave({ 
            ...form, 
            id: form.id || generateId('prefix') 
          })}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## Grouping

Items can be visually grouped into sections using the `groupBy` prop.

### groupBy Function Signature

```typescript
(item: T) => { key: string; label: string } | null
```

- **key** — Unique identifier for the group (used to detect group boundaries)
- **label** — Display text shown in section header
- Return `null` to skip grouping for that item

### Example: Group by Date

```jsx
const groupScheduleByDate = (item) => {
  if (!item.dateTime?.start) return null;
  const date = new Date(item.dateTime.start);
  return {
    key: date.toISOString().split('T')[0], // YYYY-MM-DD
    label: date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  };
};
```

### Example: Group by Role

```jsx
const groupPeopleByRole = (item) => {
  const role = item.roleTypes?.[0];
  if (!role) return { key: 'other', label: 'Other' };
  const labels = {
    speaker: 'Speakers',
    panelist: 'Panelists', 
    vip: 'VIPs',
    host: 'Hosts'
  };
  return { key: role, label: labels[role] || role };
};
```

### Section Header Behavior

- Headers appear when group key changes from previous item
- First header has no top border
- In reorder mode, headers fade but remain visible
- Headers are not draggable (items can be dragged past them)

---

## Confirm Dialog Component

The `ConfirmDialog` is a built-in modal component for delete confirmations and other destructive actions.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | Controls dialog visibility |
| `title` | `string` | `'Confirm Delete'` | Dialog title |
| `message` | `string` | `'Are you sure...'` | Confirmation message |
| `confirmLabel` | `string` | `'Delete'` | Confirm button text |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button text |
| `variant` | `'danger' \| 'warning' \| 'default'` | `'danger'` | Button style variant |
| `onConfirm` | `function` | — | Called when user confirms |
| `onCancel` | `function` | — | Called when user cancels |

### Usage in UniversalListEditor

The `UniversalListEditor` manages the confirm dialog state internally and provides `onRequestDelete` to rows:

```jsx
// Row component calls onRequestDelete instead of directly deleting
onClick={(e) => { 
  e.stopPropagation(); 
  onRequestDelete(item.id, item.name); 
}}
```

The editor shows the confirm dialog and calls `handleDelete` only if the user confirms.

### Bulk Delete

When deleting multiple items in multi-select mode, the dialog shows:
- Title: "Delete X Items"
- Message: "Are you sure you want to delete X selected items? This action cannot be undone."
- Confirm button: "Delete X Items"

---

## Relationship Management

The system supports bi-directional relationships between content types, specifically People ↔ Schedule.

### Data Model

**Person** references sessions via `sessionIds`:
```javascript
{
  id: 'ppl-1',
  firstName: 'Sarah',
  lastName: 'Chen',
  sessionIds: ['sch-2', 'sch-5'] // Links to schedule items
}
```

**Schedule Item** does not store person references — the relationship is derived:
```javascript
// In ScheduleRow
const linkedPeople = people.filter(p => 
  (p.sessionIds || []).includes(item.id)
);
```

### Person Modal: Session Picker

When editing a person, they can be linked to multiple sessions:
- "Linked Sessions" section shows current links
- "Add More Sessions" opens a picker modal
- Sessions display date, time, and venue
- Checkboxes for multi-select

### Schedule Modal: Linked Speakers (Read-Only)

When viewing/editing a schedule item:
- Shows people linked to this session
- Display only (linking is done from Person side)
- Shows photo, name, title, and role

### Delete Confirmation Pattern

**All row deletions require confirmation.** When the user clicks the trash icon on a row, a custom styled confirmation dialog appears with:

- Title (e.g., "Delete Item")
- Message with item name (e.g., `Are you sure you want to delete "Opening Keynote"? This action cannot be undone.`)
- Cancel and Delete buttons

The confirmation dialog is managed at the `UniversalListEditor` level via a `ConfirmDialog` component, ensuring consistent styling across all delete operations.

**Dialog variants:**
- `danger` (default) — Red delete button for destructive actions
- `warning` — For cautionary confirmations
- `default` — For neutral confirmations

This prevents accidental deletions and ensures intentional action.

### Delete Confirmation with Relationships

For items with relationships (e.g., schedule items linked to people), an additional context-aware confirmation is shown:

```javascript
const checkScheduleDelete = (scheduleId) => {
  const linkedPeople = people.filter(p => 
    (p.sessionIds || []).includes(scheduleId)
  );
  
  if (linkedPeople.length > 0) {
    const confirmed = window.confirm(
      `This session is linked to ${linkedPeople.length} people. ` +
      `Deleting will remove it from their profiles. Continue?`
    );
    
    if (confirmed) {
      // Clean up references
      setPeople(people.map(p => ({
        ...p,
        sessionIds: (p.sessionIds || []).filter(id => id !== scheduleId)
      })));
    }
    return confirmed;
  }
  return true;
};
```

---

## Content Types

### Schedule

Event sessions with time blocks, venue information, and linked speakers.

**Data Schema:**
```javascript
{
  id: 'sch-1',
  name: 'Opening Keynote',
  description: 'Join CEO Sarah Chen...',
  dateTime: {
    start: '2025-03-18T09:00:00',
    end: '2025-03-18T10:30:00',
    timeZone: 'America/Los_Angeles'
  },
  eventMode: 'in-person' | 'virtual' | 'hybrid',
  privacy: { visibility: 'public' | 'private' },
  inPerson: {
    venue: 'Main Stage',
    address: '747 Howard St',
    dressCode: 'Business Casual'
  }
}
```

**Row Display:** Time block (start/end) + name + description + venue + linked speakers

**Grouping:** By date

### People

Speakers, VIPs, hosts, and other notable attendees.

**Data Schema:**
```javascript
{
  id: 'ppl-1',
  firstName: 'Sarah',
  lastName: 'Chen',
  title: 'CEO & Founder',
  company: 'EventTech Inc',
  bio: 'Pioneer in event technology...',
  photoUrl: 'https://...',
  roleTypes: ['speaker', 'vip'],
  links: [{ type: 'linkedin', url: 'https://...' }],
  sessionIds: ['sch-2'] // Linked schedule items
}
```

**Row Display:** Avatar + name + title/company + session count + role pill

**Grouping:** By role (Speakers, Panelists, VIPs, Hosts)

### Hotels

Accommodation recommendations for attendees.

**Data Schema:**
```javascript
{
  id: 'htl-1',
  name: 'San Francisco Marriott',
  notes: 'Official conference hotel...',
  photoUrl: 'https://...',
  starRating: 4,
  distanceKm: 0.1,
  address: '780 Mission Street',
  url: 'https://marriott.com'
}
```

**Row Display:** Thumbnail + name + star rating + distance + truncated notes

### FAQ

Frequently asked questions with categories.

**Data Schema:**
```javascript
{
  id: 'faq-1',
  question: 'What are the conference dates?',
  answer: 'The Event Innovation Summit runs...',
  category: 'General'
}
```

**Row Display:** Question + 2-line answer preview + category pill

### Travel

Transportation information and logistics.

**Data Schema:**
```javascript
{
  id: 'trv-1',
  itemType: 'airport' | 'rideshare' | 'transit' | 'taxi' | 'rental',
  title: 'San Francisco International Airport',
  notes: 'Primary airport, 14 miles south...',
  phone: '+1 650-821-8211',
  links: [{ label: 'Airport Website', url: 'https://...' }]
}
```

**Row Display:** Type badge + title + notes + phone

### Attractions

Local recommendations and points of interest.

**Data Schema:**
```javascript
{
  id: 'att-1',
  name: 'Golden Gate Bridge',
  category: 'Landmark',
  description: 'Iconic suspension bridge...',
  photoUrl: 'https://...',
  location: 'Golden Gate Bridge, SF',
  link: 'https://goldengatebridge.org',
  groupLabel: 'Must See'
}
```

**Row Display:** Thumbnail + name + category/location + description preview + group label pill

**Grouping:** By groupLabel (Must See, Local Favorites, Explore, Culture)

---

## Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| `Escape` | Modal open | Close modal |
| `Escape` | Reorder/Multiselect mode | Return to default mode |
| `Cmd/Ctrl + A` | Multiselect mode | Select/Deselect all items |

---

## Animations

### Row Interactions

- **Leading action (checkbox/drag handle):** Width and opacity transition (200ms)
- **Delete button (trash icon):** Opacity and scale transition on hover (200ms), turns red on hover
- **Row background:** Smooth transition on hover/select (150ms)

### Modal

- **Overlay:** Fade in (150ms)
- **Modal panel:** Slide up with scale (200ms)

### Drag & Drop

- **Dragging item:** Elevated shadow, border radius, z-index
- **Transform:** CSS transform via `@dnd-kit` utilities

---

## Styling

The component uses a centralized `styles` object with consistent design tokens.

### Button Styles

Buttons use CSS classes for consistent hover states across the application:

| Class | Usage | Style | Hover Effect |
|-------|-------|-------|--------------|
| `btn-ghost` | Select..., Reorder, Select All | Transparent, gray text | Light gray background (#f3f4f6) |
| `btn-outline` | Add, Done, Cancel | White with border | Light gray background, darker border |
| `btn-primary` | Save, Done (session picker) | Dark solid (#111827) | Slightly lighter (#374151) |
| `btn-danger` | Delete (bulk), Delete (modal) | Light red background | Deeper red (#fee2e2) |
| `btn-icon` | Row delete button | Transparent, icon only | Red tint background, red icon |
| `btn-close` | Modal close (X) | Gray background | Darker gray |
| `nav-btn` | Navigation (inactive) | Transparent | Light gray background |
| `nav-btn-active` | Navigation (active) | Dark solid | Slightly lighter |

All buttons include:
- 150ms transition on all properties
- Scale down to 0.98 on active/press
- Focus ring on inputs (3px shadow)

### Colors

- **Primary text:** `#111827`
- **Secondary text:** `#6b7280`
- **Tertiary text:** `#9ca3af`
- **Primary button:** `#111827` (dark)
- **Danger/delete:** `#dc2626` / `#fef2f2`
- **Selected row:** `#f0f9ff`
- **Hover row:** `#fafafa`
- **Borders:** `#f0f0f0` / `#e5e7eb`

### Typography

- **Font:** Inter, system-ui fallback
- **Primary text:** 16px / 500 weight
- **Secondary text:** 14px / 400 weight
- **Tertiary text:** 13px / 400 weight
- **Pills/badges:** 12px / 500 weight / uppercase

### Spacing

- **Row padding:** 18px vertical, 24px horizontal
- **Modal padding:** 24-28px
- **Section headers:** 20px top, 14px bottom
- **Button padding:** 11px vertical, 20px horizontal

---

## Dependencies

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "lucide-react": "^0.563.0",
  "react": "^19.2.0"
}
```

---

## Future Considerations

### Potential Enhancements

1. **Search/Filter** — Add search input and filter dropdowns
2. **Undo/Redo** — Track state history for reverting changes
3. **Keyboard Navigation** — Arrow keys to move between items, Enter to edit
4. **Bulk Edit** — Edit multiple selected items at once
5. **Import/Export** — CSV or JSON data import/export
6. **Virtualization** — Virtual scrolling for large lists (react-window)
7. **Optimistic Updates** — Immediate UI feedback before server confirmation
8. **Drag-to-group** — Drag items between groups to reclassify

### API Integration Points

The current implementation uses local state. For backend integration:

- Replace `useState` with data fetching (React Query, SWR, etc.)
- Add loading and error states to UniversalListEditor
- Implement optimistic updates with rollback
- Handle concurrent edit conflicts
- Add pagination or infinite scroll for large datasets
