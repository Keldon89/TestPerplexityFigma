import {
  PrimeReactProvider,
  Button,
  Card,
  TabView,
  TabPanel,
  DataTable,
  Column,
  InputText,
  Dropdown,
  MultiSelect,
  Tag,
  Badge,
  Avatar,
  Message,
  Dialog,
  Sidebar,
  Divider,
  ProgressBar,
  Chip,
  Tooltip,
  BreadCrumb,
  Checkbox,
  Accordion,
  AccordionTab,
  Panel,
  Toast,
  IconField,
  InputIcon,
} from '../components';
import { useState, useRef } from 'react';
import '../styles/index.css';
import '../styles/tailwind.css';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPartecipanti = [
  { id: 1, matricola: 'EN001', nome: 'Luca Ferretti', email: 'l.ferretti@enav.it', struttura: 'ACC Roma', provenienza: 'Interno', abilitazione: 'ADC', scadenzaAbil: '31/12/2025', stato: 'Disponibile' },
  { id: 2, matricola: 'EN002', nome: 'Sara Martini', email: 's.martini@enav.it', struttura: 'APP Napoli', provenienza: 'Interno', abilitazione: 'APP', scadenzaAbil: '15/06/2025', stato: 'Associato' },
  { id: 3, matricola: 'EXT001', nome: 'Marco Rossi', email: 'm.rossi@external.it', struttura: 'Esterno', provenienza: 'Esterno', abilitazione: 'TWR', scadenzaAbil: '01/03/2025', stato: 'Non associabile' },
  { id: 4, matricola: 'EN003', nome: 'Giulia Neri', email: 'g.neri@enav.it', struttura: 'TWR Fiumicino', provenienza: 'Interno', abilitazione: 'TWR', scadenzaAbil: '30/09/2026', stato: 'Disponibile' },
  { id: 5, matricola: 'EN004', nome: 'Paolo Verdi', email: 'p.verdi@enav.it', struttura: 'ACC Milano', provenienza: 'Interno', abilitazione: 'ADC', scadenzaAbil: '—', stato: 'Dimesso' },
];

const mockAssociati = [
  { id: 1, matricola: 'EN001', nome: 'Luca Ferretti', provenienza: 'Interno', abilitazione: 'ADC', statoAssoc: 'Associato', warning: '' },
  { id: 2, matricola: 'EN002', nome: 'Sara Martini', provenienza: 'Interno', abilitazione: 'APP', statoAssoc: 'Da verificare', warning: 'Abilitazione in scadenza' },
];

const mockIstruttori = [
  { id: 1, matricola: 'IS001', nome: 'Andrea Colombo', email: 'a.colombo@enav.it', struttura: 'CTC Roma', provenienza: 'Interno', ruolo: 'Istruttore teorico', abilitazione: 'ADC', scadenzaAbil: '31/12/2025', statoLicenza: 'Valida', disponibilita: 'Disponibile', tirocinio: '80h / Completato' },
  { id: 2, matricola: 'IS002', nome: 'Elena Bruno', email: 'e.bruno@enav.it', struttura: 'CTC Napoli', provenienza: 'Interno', ruolo: 'Istruttore pratico', abilitazione: 'APP', scadenzaAbil: '01/06/2025', statoLicenza: 'In scadenza', disponibilita: 'Disponibile', tirocinio: '120h / Completato' },
  { id: 3, matricola: 'IS003', nome: 'Carlo Ricci', email: 'c.ricci@enav.it', struttura: 'CTC Fiumicino', provenienza: 'Interno', ruolo: 'Docente', abilitazione: 'TWR', scadenzaAbil: '30/09/2024', statoLicenza: 'Scaduta', disponibilita: 'Non disponibile', tirocinio: '—' },
];

const mockMaterie = [
  { id: 1, codice: 'MAT01', nome: 'Meteorologia', descrizione: 'Elementi di meteorologia aeronautica', origine: 'Training Plan', stato: 'Completa', ore: 20 },
  { id: 2, codice: 'MAT02', nome: 'Normativa ATC', descrizione: 'Regolamentazione ICAO e ENAC', origine: 'Training Plan', stato: 'Incompleta', ore: 15 },
  { id: 3, codice: 'MAT03', nome: 'Radiotelefonia', descrizione: 'Procedure RT standard', origine: 'Manuale', stato: 'Da verificare', ore: 10 },
];

const mockSimulazioni = [
  { id: 1, data: '10/06/2025', orario: '09:00–11:00', room: 'Simulatore A1', istruttore: 'Andrea Colombo', partecipanti: 'Ferretti, Martini', fase: 'Fase 1', esercizio: 'ES-01', stato: 'Completa', tipoScheda: 'Didattica' },
  { id: 2, data: '11/06/2025', orario: '14:00–16:00', room: 'Simulatore B2', istruttore: 'Elena Bruno', partecipanti: 'Neri', fase: 'Fase 2', esercizio: 'ES-03', stato: 'Incompleta', tipoScheda: 'Valutativa' },
  { id: 3, data: '12/06/2025', orario: '10:00–12:00', room: 'Simulatore A1', istruttore: '—', partecipanti: '—', fase: 'Fase 3', esercizio: 'ES-05', stato: 'Da validare', tipoScheda: 'Esame finale' },
];

const checklistItems = [
  { label: 'Partecipanti associati', done: true },
  { label: 'Numero partecipanti coerente con Training Plan', done: true },
  { label: 'Istruttori associati', done: true },
  { label: 'Licenze istruttori valide', done: false },
  { label: 'Disponibilità istruttori verificata', done: true },
  { label: 'Materie configurate', done: false },
  { label: 'Ore/unità didattiche ripartite', done: false },
  { label: 'Simulazioni configurate', done: false },
  { label: 'Obiettivi e comportamenti osservabili', done: false },
  { label: 'Sistemi valutativi configurati', done: false },
  { label: 'Ponderi configurati', done: false },
  { label: 'Esami configurati', done: false },
  { label: 'Commissione configurata', done: false },
  { label: 'Nessun errore bloccante', done: false },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function StatoBadge({ stato }: { stato: string }) {
  const map: Record<string, string> = {
    Disponibile: 'success',
    Associato: 'info',
    'Non associabile': 'danger',
    Dimesso: 'secondary',
    'Da verificare': 'warning',
    'Valida': 'success',
    'In scadenza': 'warning',
    'Scaduta': 'danger',
    'Non disponibile': 'danger',
    'Completa': 'success',
    'Incompleta': 'warning',
    'Da validare': 'warning',
  };
  const sev = (map[stato] || 'secondary') as any;
  return <Tag value={stato} severity={sev} />;
}

function OrigineChip({ origine }: { origine: string }) {
  return origine === 'Training Plan'
    ? <Chip label="Training Plan" icon="pi pi-link" style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-800)', fontSize: '0.75rem' }} />
    : <Chip label="Manuale" icon="pi pi-pencil" style={{ backgroundColor: 'var(--purple-100)', color: 'var(--purple-800)', fontSize: '0.75rem' }} />;
}

// ─── Tab Components ───────────────────────────────────────────────────────────

function TabAssociaPartecipanti() {
  const [searchVal, setSearchVal] = useState('');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<any>(null);

  const filtered = mockPartecipanti.filter(p =>
    p.nome.toLowerCase().includes(searchVal.toLowerCase()) ||
    p.matricola.toLowerCase().includes(searchVal.toLowerCase())
  );

  const statoBodyTemplate = (row: any) => <StatoBadge stato={row.stato} />;
  const provenienzaBodyTemplate = (row: any) => (
    <Tag value={row.provenienza} severity={row.provenienza === 'Interno' ? 'info' : 'warning'} />
  );
  const azioniTemplate = (row: any) => (
    <div className="flex gap-2">
      <Button icon="pi pi-eye" text size="small" tooltip="Dettaglio" onClick={() => { setDrawerRecord(row); setDrawerVisible(true); }} />
      <Button icon="pi pi-user-plus" text size="small" severity="success" tooltip="Associa" disabled={row.stato === 'Dimesso' || row.stato === 'Non associabile'} />
    </div>
  );
  const assocAzioniTemplate = (row: any) => (
    <div className="flex gap-2">
      <Button icon="pi pi-eye" text size="small" tooltip="Dettaglio" onClick={() => { setDrawerRecord(row); setDrawerVisible(true); }} />
      <Button icon="pi pi-times" text size="small" severity="danger" tooltip="Rimuovi" />
    </div>
  );
  const assocWarningTemplate = (row: any) => row.warning
    ? <span className="text-orange-500 flex items-center gap-1"><i className="pi pi-exclamation-triangle" />{row.warning}</span>
    : <span className="text-green-500">—</span>;

  return (
    <div className="flex flex-col gap-5">
      {/* Header funzionale */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Associa partecipanti</h3>
        <p className="text-sm" style={{ color: 'var(--text-color-secondary)' }}>Seleziona e associa i partecipanti al corso, verificando il limite massimo previsto dal Training Plan.</p>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--surface-section)' }}>
            <i className="pi pi-users text-blue-500" />
            <span className="font-semibold">Associati: <strong>14 / 16</strong></span>
            <Divider layout="vertical" />
            <span className="text-green-600 font-medium">Posti disponibili: 2</span>
          </div>
          <ProgressBar value={87} style={{ width: '200px', height: '8px' }} />
        </div>
        <Message severity="warn" text="Attenzione: il numero di partecipanti si sta avvicinando al massimo previsto dal Training Plan." />
      </div>

      <Divider />

      {/* Ricerca */}
      <div className="flex flex-wrap gap-3 items-end">
        <IconField iconPosition="left" className="flex-1">
          <InputIcon className="pi pi-search" />
          <InputText
            placeholder="Cerca per nome, matricola, e-mail o struttura"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            fluid
          />
        </IconField>
        <Dropdown options={[{label:'Tutti',value:''},{label:'Interno',value:'Interno'},{label:'Esterno',value:'Esterno'}]} placeholder="Provenienza" />
        <Dropdown options={[{label:'Tutti gli stati',value:''},{label:'Disponibile',value:'Disponibile'},{label:'Dimesso',value:'Dimesso'}]} placeholder="Stato" />
        <Button label="Aggiungi" icon="pi pi-user-plus" severity="success" />
        <Button label="Importa" icon="pi pi-upload" outlined />
        <Button icon="pi pi-refresh" text tooltip="Reset filtri" />
      </div>

      {/* Tabella disponibili */}
      <Panel header="Partecipanti disponibili" toggleable>
        <DataTable
          value={filtered}\n          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
          dataKey="id"
          stripedRows
          paginator
          rows={5}
          emptyMessage="Nessun partecipante trovato."
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column field="matricola" header="Matricola" sortable />
          <Column field="nome" header="Nominativo" sortable />
          <Column field="email" header="E-mail" />
          <Column field="struttura" header="Struttura" />
          <Column field="provenienza" header="Provenienza" body={provenienzaBodyTemplate} />
          <Column field="abilitazione" header="Abilitazione" />
          <Column field="scadenzaAbil" header="Scad. abilit." />
          <Column field="stato" header="Stato" body={statoBodyTemplate} />
          <Column header="Azioni" body={azioniTemplate} />
        </DataTable>
      </Panel>

      {/* Partecipanti associati */}
      <Panel header="Partecipanti associati al corso" toggleable>
        <DataTable value={mockAssociati} stripedRows emptyMessage="Nessun partecipante associato.">
          <Column field="matricola" header="Matricola" />
          <Column field="nome" header="Nominativo" />
          <Column field="provenienza" header="Provenienza" body={(r) => <Tag value={r.provenienza} severity="info" />} />
          <Column field="abilitazione" header="Abilitazione" />
          <Column field="statoAssoc" header="Stato" body={(r) => <StatoBadge stato={r.statoAssoc} />} />
          <Column field="warning" header="Warning" body={assocWarningTemplate} />
          <Column header="Azioni" body={assocAzioniTemplate} />
        </DataTable>
      </Panel>

      {/* Drawer dettaglio */}
      <Sidebar visible={drawerVisible} position="right" onHide={() => setDrawerVisible(false)} style={{ width: '420px' }}>
        {drawerRecord && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar label={drawerRecord.nome.charAt(0)} size="xlarge" shape="circle" style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }} />
              <div>
                <h3 className="text-lg font-semibold m-0">{drawerRecord.nome}</h3>
                <p className="text-sm m-0" style={{ color: 'var(--text-color-secondary)' }}>{drawerRecord.matricola}</p>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="font-medium">E-mail</span><span>{drawerRecord.email}</span></div>
              <div className="flex justify-between"><span className="font-medium">Struttura</span><span>{drawerRecord.struttura}</span></div>
              <div className="flex justify-between"><span className="font-medium">Provenienza</span><Tag value={drawerRecord.provenienza} severity={drawerRecord.provenienza==='Interno'?'info':'warning'} /></div>
              <div className="flex justify-between"><span className="font-medium">Abilitazione</span><span>{drawerRecord.abilitazione}</span></div>
              <div className="flex justify-between"><span className="font-medium">Scadenza abilit.</span><span>{drawerRecord.scadenzaAbil}</span></div>
              <div className="flex justify-between"><span className="font-medium">Stato</span><StatoBadge stato={drawerRecord.stato} /></div>
            </div>
            <Divider />
            <Button label="Associa al corso" icon="pi pi-user-plus" severity="success" disabled={drawerRecord.stato==='Dimesso'||drawerRecord.stato==='Non associabile'} />
          </div>
        )}
      </Sidebar>
    </div>
  );
}

function TabAssociaIstruttori() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerRecord, setDrawerRecord] = useState<any>(null);

  const licenzaBody = (row: any) => <StatoBadge stato={row.statoLicenza} />;
  const dispBody = (row: any) => <StatoBadge stato={row.disponibilita} />;
  const azioniTemplate = (row: any) => (
    <div className="flex gap-1">
      <Button icon="pi pi-eye" text size="small" tooltip="Dettaglio" onClick={() => { setDrawerRecord(row); setDrawerVisible(true); }} />
      <Button icon="pi pi-user-plus" text size="small" severity="success" tooltip="Associa" disabled={row.statoLicenza==='Scaduta'} />
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Associa istruttori</h3>
        <p className="text-sm" style={{ color: 'var(--text-color-secondary)' }}>Associa docenti e istruttori al corso verificando ruolo, licenze, disponibilità e tirocinio.</p>
        <div className="flex gap-4">
          <div className="p-3 rounded-lg flex gap-3" style={{ background: 'var(--surface-section)' }}>
            <span className="font-semibold">Istruttori associati: <strong>6</strong></span>
            <Divider layout="vertical" />
            <span>Teorici: <strong>2</strong></span>
            <span>Pratici: <strong>3</strong></span>
            <span>Tirocinio: <strong>1</strong></span>
          </div>
        </div>
        <Message severity="warn" text="Un istruttore ha la licenza in scadenza. Verificare prima della validazione finale." />
      </div>

      <Divider />

      <div className="flex flex-wrap gap-3 items-end">
        <IconField iconPosition="left" className="flex-1">
          <InputIcon className="pi pi-search" />
          <InputText placeholder="Cerca per nome, matricola, ruolo, licenza o struttura" fluid />
        </IconField>
        <Dropdown options={[{label:'Tutti i ruoli',value:''},{label:'Docente',value:'Docente'},{label:'Istr. teorico',value:'Istruttore teorico'},{label:'Istr. pratico',value:'Istruttore pratico'}]} placeholder="Ruolo" />
        <Dropdown options={[{label:'Tutti',value:''},{label:'Valida',value:'Valida'},{label:'In scadenza',value:'In scadenza'},{label:'Scaduta',value:'Scaduta'}]} placeholder="Stato licenza" />
        <Button label="Aggiungi" icon="pi pi-user-plus" severity="success" />
      </div>

      <Panel header="Istruttori disponibili" toggleable>
        <DataTable value={mockIstruttori} stripedRows paginator rows={5}>
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column field="matricola" header="Matricola" />
          <Column field="nome" header="Nominativo" sortable />
          <Column field="struttura" header="Struttura" />
          <Column field="provenienza" header="Provenienza" body={(r) => <Tag value={r.provenienza} severity="info" />} />
          <Column field="ruolo" header="Ruolo" />
          <Column field="abilitazione" header="Abilit." />
          <Column field="statoLicenza" header="Licenza" body={licenzaBody} />
          <Column field="disponibilita" header="Disponib." body={dispBody} />
          <Column field="tirocinio" header="Tirocinio" />
          <Column header="Azioni" body={azioniTemplate} />
        </DataTable>
      </Panel>

      <Panel header="Istruttori associati al corso" toggleable>
        <DataTable value={mockIstruttori.slice(0, 2)} stripedRows emptyMessage="Nessun istruttore associato.">
          <Column field="nome" header="Nominativo" />
          <Column field="ruolo" header="Ruolo corso" />
          <Column field="statoLicenza" header="Licenza" body={licenzaBody} />
          <Column field="disponibilita" header="Disponib." body={dispBody} />
          <Column field="tirocinio" header="Tirocinio" />
          <Column header="Azioni" body={(r) => (
            <div className="flex gap-1">
              <Button icon="pi pi-eye" text size="small" tooltip="Dettaglio" onClick={() => { setDrawerRecord(r); setDrawerVisible(true); }} />
              <Button icon="pi pi-refresh" text size="small" severity="warning" tooltip="Sostituisci" />
              <Button icon="pi pi-times" text size="small" severity="danger" tooltip="Rimuovi" />
            </div>
          )} />
        </DataTable>
      </Panel>

      <Sidebar visible={drawerVisible} position="right" onHide={() => setDrawerVisible(false)} style={{ width: '420px' }}>
        {drawerRecord && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar label={drawerRecord.nome.charAt(0)} size="xlarge" shape="circle" style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }} />
              <div>
                <h3 className="text-lg font-semibold m-0">{drawerRecord.nome}</h3>
                <p className="m-0 text-sm" style={{ color: 'var(--text-color-secondary)' }}>{drawerRecord.ruolo}</p>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="font-medium">Matricola</span><span>{drawerRecord.matricola}</span></div>
              <div className="flex justify-between"><span className="font-medium">E-mail</span><span>{drawerRecord.email}</span></div>
              <div className="flex justify-between"><span className="font-medium">Struttura</span><span>{drawerRecord.struttura}</span></div>
              <div className="flex justify-between"><span className="font-medium">Licenza</span><StatoBadge stato={drawerRecord.statoLicenza} /></div>
              <div className="flex justify-between"><span className="font-medium">Disponibilità</span><StatoBadge stato={drawerRecord.disponibilita} /></div>
              <div className="flex justify-between"><span className="font-medium">Tirocinio</span><span>{drawerRecord.tirocinio}</span></div>
            </div>
            {drawerRecord.statoLicenza === 'Scaduta' && <Message severity="error" text="Licenza non valida o scaduta. Non associabile." />}
            {drawerRecord.statoLicenza === 'In scadenza' && <Message severity="warn" text="Licenza in scadenza. Verificare prima della validazione." />}
          </div>
        )}
      </Sidebar>
    </div>
  );
}

function TabConfiguraMaterie() {
  const [selectedMateria, setSelectedMateria] = useState<any>(null);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Configura materie</h3>
        <p className="text-sm" style={{ color: 'var(--text-color-secondary)' }}>Configura materie, argomenti, sottoargomenti e ripartizione delle ore/unità didattiche.</p>
        <div className="p-3 rounded-lg flex gap-6" style={{ background: 'var(--surface-section)' }}>
          <span>Materie: <strong>8</strong></span>
          <span>Argomenti: <strong>24</strong></span>
          <span>Sottoargomenti: <strong>63</strong></span>
          <Divider layout="vertical" />
          <span>Ore previste: <strong>120</strong></span>
          <span>Ore assegnate: <strong>110</strong></span>
          <span className="text-orange-500 font-medium">Da ripartire: <strong>10</strong></span>
        </div>
        <Message severity="warn" text="Ore non completamente ripartite. Verificare la configurazione delle materie." />
      </div>

      <Divider />

      <div className="flex gap-6">
        {/* Lista materie */}
        <div className="flex flex-col gap-2" style={{ width: '240px', minWidth: '240px' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">Materie</span>
            <Button icon="pi pi-plus" text size="small" tooltip="Aggiungi materia" />
          </div>
          {mockMaterie.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-lg cursor-pointer border transition-all ${
                selectedMateria?.id === m.id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-transparent hover:bg-gray-50'
              }`}
              style={{ background: selectedMateria?.id === m.id ? 'var(--primary-100)' : 'var(--surface-card)', border: `1px solid ${selectedMateria?.id === m.id ? 'var(--primary-color)' : 'var(--surface-border)'}` }}
              onClick={() => setSelectedMateria(m)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{m.nome}</span>
                <StatoBadge stato={m.stato} />
              </div>
              <div className="mt-1"><OrigineChip origine={m.origine} /></div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-color-secondary)' }}>Ore: {m.ore}h</div>
            </div>
          ))}
        </div>

        {/* Dettaglio materia + argomenti */}
        <div className="flex-1">
          {selectedMateria ? (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold m-0">{selectedMateria.nome}</h4>
                    <p className="text-sm m-0 mt-1" style={{ color: 'var(--text-color-secondary)' }}>{selectedMateria.descrizione}</p>
                  </div>
                  <div className="flex gap-2">
                    <OrigineChip origine={selectedMateria.origine} />
                    <StatoBadge stato={selectedMateria.stato} />
                  </div>
                </div>
                <Divider />
                <div className="flex gap-6 text-sm">
                  <span>Codice: <strong>{selectedMateria.codice}</strong></span>
                  <span>Ore tot.: <strong>{selectedMateria.ore}h</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h5 className="font-semibold m-0">Argomenti</h5>
                <Button label="Aggiungi argomento" icon="pi pi-plus" size="small" outlined />
              </div>
              <DataTable
                value={[
                  { nome: 'Circolazione atmosferica', materie: selectedMateria.nome, oreP: 8, oreA: 8, origine: 'Training Plan', stato: 'Completo' },
                  { nome: 'Previsioni meteorologiche', materie: selectedMateria.nome, oreP: 6, oreA: 4, origine: 'Manuale', stato: 'Da ripartire' },
                  { nome: 'Fenomeni avversi', materie: selectedMateria.nome, oreP: 6, oreA: 6, origine: 'Training Plan', stato: 'Completo' },
                ]}
                stripedRows
              >
                <Column field="nome" header="Argomento" />
                <Column field="oreP" header="Ore previste" />
                <Column field="oreA" header="Ore assegnate" />
                <Column field="origine" header="Origine" body={(r) => <OrigineChip origine={r.origine} />} />
                <Column field="stato" header="Stato" body={(r) => <StatoBadge stato={r.stato} />} />
                <Column header="Azioni" body={() => (
                  <div className="flex gap-1">
                    <Button icon="pi pi-pencil" text size="small" />
                    <Button icon="pi pi-link" text size="small" tooltip="Collega" />
                  </div>
                )} />
              </DataTable>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64" style={{ color: 'var(--text-color-secondary)' }}>
              <i className="pi pi-book text-4xl mb-3" />
              <p>Seleziona una materia per visualizzare i dettagli</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabConfiguraSimulazioni() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerSim, setDrawerSim] = useState<any>(null);

  const tipoScheda = (row: any) => {
    const sevMap: Record<string, any> = { 'Didattica': 'info', 'Valutativa': 'warning', 'Esame finale': 'danger' };
    return <Tag value={row.tipoScheda} severity={sevMap[row.tipoScheda] || 'secondary'} />;
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Configura simulazioni</h3>
        <p className="text-sm" style={{ color: 'var(--text-color-secondary)' }}>Configura le sessioni pratiche del corso, associando fasi, obiettivi, esercizi, istruttori e partecipanti.</p>
        <div className="p-3 rounded-lg flex gap-6" style={{ background: 'var(--surface-section)' }}>
          <span>Simulazioni: <strong>18</strong></span>
          <span className="text-green-600">Complete: <strong>14</strong></span>
          <span className="text-orange-500">Da completare: <strong>4</strong></span>
          <Divider layout="vertical" />
          <span>Schede configurate: <strong>42</strong></span>
          <span className="text-orange-500">Warning: <strong>3</strong></span>
        </div>
        <Message severity="warn" text="Alcune simulazioni non hanno istruttore assegnato. Verificare prima della validazione." />
      </div>

      <Divider />

      <div className="flex gap-3 flex-wrap">
        <Button label="Aggiungi simulazione" icon="pi pi-plus" severity="success" />
        <Dropdown options={[{label:'Vista per Fase',value:'fase'},{label:'Vista per Partecipante',value:'partecipante'},{label:'Vista per Esercizio',value:'esercizio'}]} placeholder="Raggruppa per..." />
      </div>

      {/* Card simulazioni */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSimulazioni.map((sim) => (
          <div
            key={sim.id}
            className="p-4 rounded-lg cursor-pointer"
            style={{ background: 'var(--surface-card)', border: `1px solid ${sim.stato==='Completa'?'var(--green-200)':sim.stato==='Incompleta'?'var(--yellow-200)':'var(--blue-200)'}` }}
            onClick={() => { setDrawerSim(sim); setDrawerVisible(true); }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold text-sm">{sim.fase} – {sim.esercizio}</span>
                <div className="text-xs mt-1" style={{ color: 'var(--text-color-secondary)' }}>{sim.data} • {sim.orario}</div>
              </div>
              <StatoBadge stato={sim.stato} />
            </div>
            <Divider className="my-2" />
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2"><i className="pi pi-home text-blue-500" /><span>{sim.room}</span></div>
              <div className="flex items-center gap-2">
                <i className="pi pi-user text-purple-500" />
                <span>{sim.istruttore === '—' ? <span className="text-red-500 font-medium">Istruttore mancante</span> : sim.istruttore}</span>
              </div>
              <div className="flex items-center gap-2"><i className="pi pi-users" /><span>{sim.partecipanti}</span></div>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              {tipoScheda(sim)}
              <div className="flex gap-1">
                <Button icon="pi pi-copy" text size="small" tooltip="Duplica" />
                <Button icon="pi pi-check-circle" text size="small" severity="success" tooltip="Valida" />
              </div>
            </div>
            {sim.istruttore === '—' && <Message severity="error" text="Simulazione incompleta: associare almeno un istruttore." className="mt-2" />}
          </div>
        ))}
      </div>

      {/* Drawer dettaglio simulazione */}
      <Sidebar visible={drawerVisible} position="right" onHide={() => setDrawerVisible(false)} style={{ width: '480px' }}>
        {drawerSim && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{drawerSim.fase} – {drawerSim.esercizio}</h3>
            <StatoBadge stato={drawerSim.stato} />
            <Divider />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium block">Data</span>{drawerSim.data}</div>
              <div><span className="font-medium block">Orario</span>{drawerSim.orario}</div>
              <div><span className="font-medium block">Room</span>{drawerSim.room}</div>
              <div><span className="font-medium block">Tipo scheda</span><Tag value={drawerSim.tipoScheda} severity="info" /></div>
              <div className="col-span-2"><span className="font-medium block">Istruttore</span>{drawerSim.istruttore}</div>
              <div className="col-span-2"><span className="font-medium block">Partecipanti</span>{drawerSim.partecipanti}</div>
            </div>
            <Divider />
            <h4 className="font-semibold m-0">Obiettivi e comportamenti osservabili</h4>
            <Accordion>
              <AccordionTab header="OBJ-01: Controllo di rotta">
                <p className="m-0 text-sm">Verificare la corretta gestione delle separazioni orizzontali e verticali.</p>
                <div className="mt-2 flex gap-2">
                  <Chip label="Comportamento osservabile" icon="pi pi-eye" />
                  <Tag value="Configurato" severity="success" />
                </div>
              </AccordionTab>
              <AccordionTab header="OBJ-02: Gestione emergenze">
                <p className="m-0 text-sm">Applicare le procedure di emergenza secondo ICAO Annex 2.</p>
                <div className="mt-2">
                  <Badge value="Comportamenti osservabili mancanti" severity="warning" />
                </div>
              </AccordionTab>
            </Accordion>
            <Divider />
            <div className="flex gap-2">
              <Button label="Salva" icon="pi pi-save" severity="success" className="flex-1" />
              <Button label="Valida" icon="pi pi-check-circle" outlined className="flex-1" />
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  );
}

function TabConfiguraValutazioni() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Configura valutazioni</h3>
        <p className="text-sm" style={{ color: 'var(--text-color-secondary)' }}>Configura sistemi valutativi, prove, criteri di superamento, ponderi e commissioni.</p>
        <div className="p-3 rounded-lg flex gap-6" style={{ background: 'var(--surface-section)' }}>
          <span>Sistema: <strong>Soddisfacente / Non soddisfacente</strong></span>
          <Divider layout="vertical" />
          <span>Ponderi: <strong>12 / 15</strong></span>
          <span>Prove: <strong>4 / 4</strong></span>
          <span className="text-orange-500">Criteri incompleti: <strong>3</strong></span>
        </div>
        <Message severity="warn" text="Ponderi mancanti per 3 obiettivi. Completare prima della validazione finale." />
      </div>

      <Divider />

      <Accordion multiple activeIndex={[0]}>
        {/* Sistema valutativo */}
        <AccordionTab header="Sistema valutativo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Denominazione sistema</label>
              <InputText value="Soddisfacente / Non soddisfacente" fluid />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Periodo validità</label>
              <InputText value="01/01/2025 – 31/12/2025" fluid />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Valori ammessi</label>
              <div className="flex gap-2">
                <Chip label="Soddisfacente" style={{ backgroundColor: 'var(--green-100)', color: 'var(--green-800)' }} />
                <Chip label="Non soddisfacente" style={{ backgroundColor: 'var(--red-100)', color: 'var(--red-800)' }} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Stato</label>
              <Tag value="Attivo" severity="success" className="w-fit" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm">Origine</label>
              <OrigineChip origine="Training Plan" />
            </div>
          </div>
        </AccordionTab>

        {/* Ponderi */}
        <AccordionTab header="Ponderi">
          <DataTable
            value={[
              { fase: 'Fase 1', obiettivo: 'OBJ-01', peso: '30%', stato: 'Completo' },
              { fase: 'Fase 1', obiettivo: 'OBJ-02', peso: '—', stato: 'Mancante' },
              { fase: 'Fase 2', obiettivo: 'OBJ-03', peso: '40%', stato: 'Completo' },
              { fase: 'Fase 2', obiettivo: 'OBJ-04', peso: '—', stato: 'Mancante' },
              { fase: 'Fase 3', obiettivo: 'OBJ-05', peso: '30%', stato: 'Completo' },
            ]}
            stripedRows
          >
            <Column field="fase" header="Fase" />
            <Column field="obiettivo" header="Obiettivo" />
            <Column field="peso" header="Peso" />
            <Column field="stato" header="Stato" body={(r) => <StatoBadge stato={r.stato} />} />
            <Column header="Azioni" body={() => <Button icon="pi pi-pencil" text size="small" />} />
          </DataTable>
        </AccordionTab>

        {/* Esami */}
        <AccordionTab header="Esami (scritto + orale)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg" style={{ background: 'var(--surface-section)' }}>
              <h5 className="font-semibold mb-3">Esame intermedio</h5>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between"><span>Modalità</span><Tag value="Scritto + Orale" severity="info" /></div>
                <div className="flex justify-between"><span>Domande questionario</span><strong>30</strong></div>
                <div className="flex justify-between"><span>Punteggio domanda</span><strong>2 punti</strong></div>
                <div className="flex justify-between"><span>Punteggio minimo</span><strong>42 / 60</strong></div>
                <div className="flex justify-between"><span>Stato</span><Tag value="Completo" severity="success" /></div>
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--surface-section)' }}>
              <h5 className="font-semibold mb-3">Esame finale</h5>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between"><span>Modalità</span><Tag value="Scritto + Orale" severity="info" /></div>
                <div className="flex justify-between"><span>Domande questionario</span><strong>50</strong></div>
                <div className="flex justify-between"><span>Punteggio domanda</span><strong>2 punti</strong></div>
                <div className="flex justify-between"><span>Punteggio minimo</span><strong>70 / 100</strong></div>
                <div className="flex justify-between"><span>Stato</span><Tag value="Completo" severity="success" /></div>
              </div>
            </div>
          </div>
        </AccordionTab>

        {/* Prove compensative */}
        <AccordionTab header="Prove compensative">
          <Message severity="warn" text="Prova compensativa prevista dal Training Plan ma non ancora configurata." className="mb-4" />
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Button label="Configura prova compensativa" icon="pi pi-plus" outlined />
            </div>
            <DataTable
              value={[
                { prova: 'Esame intermedio', partecipante: 'Sara Martini', tipo: 'Scritto', approvazione: 'Da approvare', esito: 'Da svolgere', stato: 'Pianificata' },
              ]}
              stripedRows
              emptyMessage="Nessuna prova compensativa configurata."
            >
              <Column field="prova" header="Prova collegata" />
              <Column field="partecipante" header="Partecipante" />
              <Column field="tipo" header="Tipo" />
              <Column field="approvazione" header="Approvazione C.I." body={(r) => <Tag value={r.approvazione} severity="warning" />} />
              <Column field="esito" header="Esito" body={(r) => <Tag value={r.esito} severity="secondary" />} />
              <Column field="stato" header="Stato" body={(r) => <StatoBadge stato={r.stato} />} />
            </DataTable>
          </div>
        </AccordionTab>

        {/* Commissione */}
        <AccordionTab header="Commissione esame">
          <Message severity="warn" text="Commissione non completa. Aggiungere almeno un presidente." className="mb-4" />
          <DataTable
            value={[
              { nominativo: 'Andrea Colombo', ruolo: 'Membro', tipoEsame: 'Finale', provenienza: 'Interno', stato: 'Completo' },
              { nominativo: 'Elena Bruno', ruolo: 'Supervisore', tipoEsame: 'Intermedio', provenienza: 'Interno', stato: 'Completo' },
              { nominativo: '—', ruolo: 'Presidente', tipoEsame: 'Finale', provenienza: '—', stato: 'Mancante' },
            ]}
            stripedRows
          >
            <Column field="nominativo" header="Nominativo" />
            <Column field="ruolo" header="Ruolo" />
            <Column field="tipoEsame" header="Tipo esame" />
            <Column field="provenienza" header="Provenienza" />
            <Column field="stato" header="Stato" body={(r) => <StatoBadge stato={r.stato} />} />
            <Column header="Azioni" body={() => <Button icon="pi pi-plus" text size="small" label="Aggiungi" />} />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
}

// ─── Card Riepilogativa ───────────────────────────────────────────────────────

function CardRiepilogativa({ onModifica }: { onModifica: () => void }) {
  const completamento = 42;
  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-xl"
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--surface-border)',
        boxShadow: 'var(--card-shadow)',
        position: 'sticky',
        top: '80px',
        width: '280px',
        minWidth: '280px',
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold m-0">Riepilogo corso</h3>
        <Tag value="In configurazione" severity="warning" />
      </div>

      <Divider className="my-1" />

      <div className="flex flex-col gap-3 text-sm">
        <div>
          <span className="font-medium block" style={{ color: 'var(--text-color-secondary)' }}>Nome corso</span>
          <span className="font-semibold">ADC Abilitazione Iniziale 2025</span>
        </div>
        <div>
          <span className="font-medium block" style={{ color: 'var(--text-color-secondary)' }}>Tipologia</span>
          <span>Abilitazione iniziale</span>
        </div>
        <div>
          <span className="font-medium block" style={{ color: 'var(--text-color-secondary)' }}>Periodo</span>
          <span>01/06/2025 – 30/09/2025</span>
        </div>
        <div>
          <span className="font-medium block" style={{ color: 'var(--text-color-secondary)' }}>Struttura org.</span>
          <span>ACC Roma</span>
        </div>
        <div>
          <span className="font-medium block" style={{ color: 'var(--text-color-secondary)' }}>Training Plan</span>
          <Chip label="TP-ADC-2025" icon="pi pi-link" className="mt-1" style={{ fontSize: '0.75rem', backgroundColor: 'var(--teal-100)', color: 'var(--teal-800)' }} />
        </div>
        <div>
          <span className="font-medium block" style={{ color: 'var(--text-color-secondary)' }}>Stato corso</span>
          <Tag value="Bozza" severity="secondary" className="mt-1" />
        </div>
        <div>
          <span className="font-medium block" style={{ color: 'var(--text-color-secondary)' }}>Origine dati</span>
          <Tag value="Dati acquisiti da Training Plan" severity="info" className="mt-1" style={{ fontSize: '0.7rem' }} />
        </div>
        <div>
          <span className="font-medium block" style={{ color: 'var(--text-color-secondary)' }}>Ultimo aggiornamento</span>
          <span>07/05/2025 – 11:42</span>
        </div>
      </div>

      <Divider className="my-1" />

      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="font-medium">Completamento configurazione</span>
          <span className="font-semibold">{completamento}%</span>
        </div>
        <ProgressBar value={completamento} showValue={false} style={{ height: '8px' }} />
      </div>

      <Divider className="my-1" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-orange-500 text-xs">
          <i className="pi pi-exclamation-triangle" />
          <span>Licenza istruttore in scadenza</span>
        </div>
        <div className="flex items-center gap-2 text-orange-500 text-xs">
          <i className="pi pi-exclamation-triangle" />
          <span>Ore materie non ripartite: 10h</span>
        </div>
        <div className="flex items-center gap-2 text-red-500 text-xs">
          <i className="pi pi-times-circle" />
          <span>Commissione non completa</span>
        </div>
      </div>

      <Button label="Modifica dati corso" icon="pi pi-pencil" outlined size="small" onClick={onModifica} />
    </div>
  );
}

// ─── Modale Modifica Dati Corso ───────────────────────────────────────────────

function ModaleModificaCorso({ visible, onHide }: { visible: boolean; onHide: () => void }) {
  const [tpWarning, setTpWarning] = useState(false);
  return (
    <Dialog
      header="Modifica dati corso"
      visible={visible}
      style={{ width: '600px' }}
      onHide={onHide}
      footer={
        <div className="flex gap-2 justify-end">
          <Button label="Annulla" severity="secondary" outlined onClick={onHide} />
          <Button label="Salva modifiche" icon="pi pi-save" severity="success" onClick={onHide} />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {tpWarning && (
          <Message
            severity="warn"
            text="La modifica del Training Plan può impattare partecipanti, materie, simulazioni, valutazioni e criteri del corso. Verificare le configurazioni già inserite."
          />
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Nome corso</label>
            <InputText defaultValue="ADC Abilitazione Iniziale 2025" fluid />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Tipologia</label>
            <Dropdown
              options={[{label:'Abilitazione iniziale',value:'abil'},{label:'Mantenimento',value:'mant'},{label:'Riqualifica',value:'riq'}]}
              value="abil"
              placeholder="Seleziona tipologia"
              fluid
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Data inizio</label>
            <InputText defaultValue="01/06/2025" fluid />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Data fine</label>
            <InputText defaultValue="30/09/2025" fluid />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Struttura organizzativa</label>
            <Dropdown
              options={[{label:'ACC Roma',value:'acc_rm'},{label:'APP Napoli',value:'app_na'},{label:'TWR Fiumicino',value:'twr_fi'}]}
              value="acc_rm"
              fluid
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Training Plan</label>
            <Dropdown
              options={[{label:'TP-ADC-2025',value:'tp1'},{label:'TP-APP-2025',value:'tp2'},{label:'TP-TWR-2025',value:'tp3'}]}
              value="tp1"
              onChange={() => setTpWarning(true)}
              fluid
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Tab status helper ────────────────────────────────────────────────────────

const tabStatus = [
  { label: 'Associa partecipanti', stato: 'In compilazione', icon: 'pi pi-users', sev: 'warning' },
  { label: 'Associa istruttori', stato: 'Con warning', icon: 'pi pi-id-card', sev: 'warning' },
  { label: 'Configura materie', stato: 'In compilazione', icon: 'pi pi-book', sev: 'warning' },
  { label: 'Configura simulazioni', stato: 'Incompleto', icon: 'pi pi-desktop', sev: 'danger' },
  { label: 'Configura valutazioni', stato: 'Non iniziato', icon: 'pi pi-star', sev: 'secondary' },
];

// ─── Checklist Validazione Finale ────────────────────────────────────────────

function ChecklistValidazione() {
  const done = checklistItems.filter(i => i.done).length;
  const total = checklistItems.length;
  const allDone = done === total;
  const hasErrors = checklistItems.filter(i => !i.done).length > 5;

  return (
    <div className="p-5 rounded-xl" style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold m-0">Checklist validazione finale</h4>
        <Tag
          value={allDone ? 'Configurazione completa' : hasErrors ? 'Configurazione non valida' : 'Configurazione con warning'}
          severity={allDone ? 'success' : hasErrors ? 'danger' : 'warning'}
        />
      </div>
      <ProgressBar value={Math.round((done / total) * 100)} showValue style={{ height: '8px', marginBottom: '1rem' }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {checklistItems.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-2 text-sm p-2 rounded ${item.done ? 'text-green-700' : 'text-red-600'}`}>
            <i className={`pi ${item.done ? 'pi-check-circle' : 'pi-times-circle'}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <Divider />
      <div className="flex gap-3">
        <Button label="Valida configurazione" icon="pi pi-check" severity="success" disabled={!allDone} />
        <Button label="Salva bozza" icon="pi pi-save" outlined />
      </div>
    </div>
  );
}

// ─── App principale ───────────────────────────────────────────────────────────

export default function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [modaleVisible, setModaleVisible] = useState(false);
  const toast = useRef<any>(null);

  const breadcrumbItems = [
    { label: 'Gestione Corsi' },
    { label: 'Configurazione corso' },
  ];
  const breadcrumbHome = { icon: 'pi pi-home' };

  const handleSalvaBozza = () => {
    toast.current?.show({ severity: 'success', summary: 'Salvato', detail: 'Configurazione salvata correttamente.' });
  };

  return (
    <PrimeReactProvider>
      <div className="min-h-screen" style={{ background: 'var(--surface-ground)' }}>
        <Toast ref={toast} />

        {/* ── Header pagina ── */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background: 'var(--surface-card)',
            borderBottom: '1px solid var(--surface-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <div className="flex flex-col gap-1">
            <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} />
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold m-0">Configurazione corso</h1>
              <Tag value="Bozza" severity="secondary" />
              <Chip label="Dati importati da Training Plan" icon="pi pi-link" style={{ fontSize: '0.75rem', backgroundColor: 'var(--teal-100)', color: 'var(--teal-800)' }} />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-sm" style={{ color: 'var(--text-color-secondary)' }}>
              Avanzamento: <strong>42%</strong>
            </div>
            <ProgressBar value={42} showValue={false} style={{ width: '120px', height: '6px' }} />
            <Button label="Salva bozza" icon="pi pi-save" severity="success" onClick={handleSalvaBozza} />
            <Button label="Annulla" icon="pi pi-times" severity="danger" outlined />
          </div>
        </div>

        {/* ── Layout principale ── */}
        <div className="flex gap-6 p-6 max-w-screen-2xl mx-auto">

          {/* Card riepilogativa sticky */}
          <CardRiepilogativa onModifica={() => setModaleVisible(true)} />

          {/* Area tab */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Indicatori stato tab */}
            <div className="flex flex-wrap gap-3">
              {tabStatus.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm"
                  style={{
                    background: activeTabIndex === idx ? 'var(--primary-100)' : 'var(--surface-card)',
                    border: `1px solid ${activeTabIndex === idx ? 'var(--primary-color)' : 'var(--surface-border)'}`,
                  }}
                  onClick={() => setActiveTabIndex(idx)}
                >
                  <i className={`${t.icon}`} style={{ color: activeTabIndex === idx ? 'var(--primary-color)' : 'var(--text-color-secondary)' }} />
                  <span className={activeTabIndex === idx ? 'font-semibold' : ''}>{t.label}</span>
                  <Tag value={t.stato} severity={t.sev as any} style={{ fontSize: '0.65rem' }} />
                </div>
              ))}
            </div>

            {/* TabView */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}
            >
              <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
                <TabPanel header="1 · Partecipanti" leftIcon="pi pi-users mr-2">
                  <TabAssociaPartecipanti />
                </TabPanel>
                <TabPanel header="2 · Istruttori" leftIcon="pi pi-id-card mr-2">
                  <TabAssociaIstruttori />
                </TabPanel>
                <TabPanel header="3 · Materie" leftIcon="pi pi-book mr-2">
                  <TabConfiguraMaterie />
                </TabPanel>
                <TabPanel header="4 · Simulazioni" leftIcon="pi pi-desktop mr-2">
                  <TabConfiguraSimulazioni />
                </TabPanel>
                <TabPanel header="5 · Valutazioni" leftIcon="pi pi-star mr-2">
                  <TabConfiguraValutazioni />
                </TabPanel>
              </TabView>
            </div>

            {/* Footer azioni */}
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)' }}
            >
              <Button label="Indietro" icon="pi pi-arrow-left" severity="secondary" outlined
                disabled={activeTabIndex === 0}
                onClick={() => setActiveTabIndex(prev => Math.max(0, prev - 1))}
              />
              <div className="flex gap-3">
                <Button label="Salva" icon="pi pi-save" outlined onClick={handleSalvaBozza} />
                <Button
                  label={activeTabIndex < 4 ? 'Avanti' : 'Valida configurazione'}
                  icon={activeTabIndex < 4 ? 'pi pi-arrow-right' : 'pi pi-check'}
                  iconPos="right"
                  severity={activeTabIndex < 4 ? 'primary' : 'success'}
                  onClick={() => {
                    if (activeTabIndex < 4) setActiveTabIndex(prev => prev + 1);
                    else toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Sono presenti dati da verificare prima della validazione finale.' });
                  }}
                />
              </div>
            </div>

            {/* Checklist validazione */}
            <ChecklistValidazione />
          </div>
        </div>

        <ModaleModificaCorso visible={modaleVisible} onHide={() => setModaleVisible(false)} />
      </div>
    </PrimeReactProvider>
  );
}
