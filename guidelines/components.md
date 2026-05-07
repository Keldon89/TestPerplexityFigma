# PrimeReact Component Guidelines

This file documents the most used components and how to use them correctly in Figma Make.

---

## Button

### Usage
Use `Button` for all interactive actions. Never use a plain `<button>` HTML element.

### Variants
- **Primary** (default): main action on the page
- **Secondary**: `severity="secondary"` — supporting action
- **Success**: `severity="success"` — confirm or save
- **Warning**: `severity="warning"` — destructive but reversible
- **Danger**: `severity="danger"` — irreversible destructive action
- **Info**: `severity="info"` — informational action
- **Outlined**: `outlined` — low-emphasis action
- **Text**: `text` — ghost/inline action
- **Raised**: `raised` — elevated emphasis

### API
```tsx
<Button
  label="Save"
  icon="pi pi-check"
  severity="success"
  outlined
  text
  raised
  rounded
  loading={false}
  disabled={false}
  size="large"
  onClick={() => {}}
/>
```

---

## InputText

```tsx
<InputText
  id="field"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter value"
  invalid
  disabled
  fluid
  size="large"
/>
```

---

## Dropdown

```tsx
<Dropdown
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.value)}
  options={[{ label: 'Option 1', value: '1' }]}
  optionLabel="label"
  placeholder="Select an option"
  filter
  showClear
  invalid
  disabled
  fluid
/>
```

---

## DataTable

```tsx
<DataTable value={data} stripedRows paginator rows={10}>
  <Column field="name" header="Nome" sortable />
  <Column field="status" header="Stato" body={(row) => <Tag value={row.status} />} />
</DataTable>
```
