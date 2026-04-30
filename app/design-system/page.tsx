"use client";
import { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";

function SamaritanIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M10.6066 11.5895C11.3892 12.35 12.6401 12.3431 13.4142 11.569L14.1213 10.8619C15.2929 9.69032 17.1924 9.69036 18.364 10.8619C18.9073 11.4053 19.1987 12.1052 19.2381 12.8164L20.1319 11.9226C21.8893 10.1652 21.8893 7.31598 20.1319 5.55862C18.3745 3.80126 15.5253 3.80126 13.7679 5.55862L10.5628 8.7639C9.81159 9.53964 9.8124 10.7734 10.5652 11.5481L10.6066 11.5895Z" fill="#DBC6EC"/>
      <path d="M17.6435 11.5557L17.6702 11.5825C18.4372 12.3638 18.4335 13.6186 17.659 14.3954L17.6569 14.3975L12.5035 19.5509C12.2254 19.8289 11.7747 19.8289 11.4966 19.5509L3.86831 11.9226C2.11095 10.1652 2.11095 7.31598 3.86831 5.55862C5.62567 3.80126 8.47492 3.80126 10.2323 5.55862L11.2929 6.61929L9.87868 8.03345C8.70711 9.20503 8.70711 11.1045 9.87868 12.2761C11.0503 13.4477 12.9497 13.4477 14.1213 12.2761L14.8285 11.569C15.6051 10.7925 16.8614 10.788 17.6435 11.5557Z" fill="#EFDFFC"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 5.9122L13.0608 4.85151C15.2087 2.70363 18.6911 2.70363 20.839 4.85151C22.9869 6.9994 22.9869 10.4818 20.839 12.6297L18.4193 15.0494L18.3678 15.1008C18.3665 15.102 18.3653 15.1033 18.364 15.1046L13.2106 20.258C12.542 20.9265 11.4581 20.9265 10.7895 20.258L3.16121 12.6297C1.01332 10.4818 1.01332 6.9994 3.16121 4.85151C5.30909 2.70363 8.7915 2.70363 10.9394 4.85151L12.0001 5.9122ZM12.5035 19.5509C12.2254 19.8289 11.7746 19.8289 11.4966 19.5509L3.86831 11.9226C2.11095 10.1652 2.11095 7.31598 3.86831 5.55862C5.62567 3.80126 8.47492 3.80126 10.2323 5.55862L11.2929 6.61929L9.87868 8.03345C8.70711 9.20503 8.70711 11.1045 9.87868 12.2761C11.0502 13.4477 12.9497 13.4477 14.1213 12.2761L14.8285 11.569C15.6095 10.788 16.8758 10.788 17.6569 11.569C18.4372 12.3494 18.4379 13.6141 17.659 14.3954C17.6583 14.3961 17.6576 14.3968 17.6569 14.3975L12.5035 19.5509ZM20.1319 11.9226L19.2381 12.8164C19.1987 12.1052 18.9073 11.4053 18.364 10.8619C17.1924 9.69036 15.2929 9.69032 14.1213 10.8619L13.4142 11.569C12.6332 12.35 11.3668 12.35 10.5858 11.569C9.80474 10.7879 9.80474 9.52161 10.5858 8.74056L13.7679 5.55862C15.5253 3.80126 18.3745 3.80126 20.1319 5.55862C21.8893 7.31598 21.8893 10.1652 20.1319 11.9226Z" fill="#1A1A1A"/>
    </svg>
  );
}
import {
  TextButton, IconButton, BackButton,
  Tag,
  Banner,
  TextField, Checkbox, RadioButton, Textarea,
  ToggleSwitch,
  BasicDropdown,
  LoadingIndicator,
  ToastProvider, useToast,
  SystemIcons,
  Size, States, ToastPosition,
} from "@laerdal/life-react-components";

/* ─── All SystemIcon names ─── */
const ICON_NAMES = [
  "Accessibility","Add","AddUser","Adult","AedPads","AedPadsCorrect","AedPadsError","Archive",
  "ArrowCollapse","ArrowDropDown","ArrowDropLeft","ArrowDropRight","ArrowDropUp","ArrowExpand",
  "ArrowLineDown","ArrowLineLeft","ArrowLineRight","ArrowLineUp","ArrowStopLeft","ArrowStopRight",
  "Assignments","Asterisk","Attachment","Attention","AudioDescriptionOn","BackwardsFiveSec",
  "Battery0","Battery1","Battery2","Battery3","Battery4","Battery5","Battery6","BatteryFull",
  "Bluetooth","Book","BookmarkAdd","BookmarkCollection","BookmarkOff","BookmarkOn","Bullet",
  "Calendar","CheckMark","CheckboxOff","CheckboxOn","CheckboxSemi","ChevronDown","ChevronLeft",
  "ChevronRight","ChevronUp","Child","Clear","Close","ClosedCaptionOn","Cloud","CloudAttention",
  "CloudCheck","CloudDownload","CloudLocked","CloudNoConnection","CloudSyncing","CloudUpload",
  "CoffeeBreak","Copy","CreditCard","Dashboard","DecisionFlow","Delete","Discount","Document",
  "DocumentComplete","Download","DragHandle","DragIndicator","Edit","Educator","Equals","EventLog",
  "Export","ExportCVS","ExportDoc","ExportEXL","ExportJpg","ExportPDF","ExportPNG","ExtendTextArea",
  "Facebook","Filter","Flickr","Folder","FolderNew","Forward","ForwardFiveSec","ForwardSlash",
  "Fullscreen","FullscreenExit","GearSettings","GridView","Group","GuidedTour","HeartShock","Help",
  "Hierarchy","History","Home","Image","Infant","Information","Institute","Keyboard","Language",
  "Learner","Legend","Legend1Circle","Legend2Triangle","Legend3Star","Legend4Square","Legend5Diamond",
  "Legend6Nabla","Legend7Pentagon","Legend8Rectangle","LegendStrokeDashed","LegendStrokeSolid",
  "LikeOff","LikeOn","Link","LinkedIn","ListView","LoadingMedium","LoadingSmall","LockedOff",
  "LockedOn","Login","Logout","Loop","Mail","Manikin","MapPoint","Menu","Metronome","Microphone",
  "Minus","MoodHappy","MoodIndifferent","MoodSad","MoodVeryHappy","MoodVerySad","MoreHorizontal",
  "MoreVertical","Notification","NotificationNew","OpenFolder","OpenNewWindow","Orders","OverView",
  "Pause","PieChart","Pin","Play","PlayList","PlayOutline","PlaybackSpeed","Plus",
  "PointDown","PointLeft","PointRight","PointUp","Print","RadioButtonOff","RadioButtonOn","Record",
  "Refresh","Replay","Rewind","SUN","Save","Search","SendTo","Share","Shock","ShockAdvised",
  "ShockAutomated","ShockNotAdvised","ShoppingCart","SkipForward","Sort","SpeechBuble","Stack",
  "StarFilled","StarOutlined","Stop","Support","SwitchApp","Team","TechnicalWarning","ThumbsDown",
  "ThumbsUp","Time","TimeLimited","Timeline","Tip","Transcript","Translation","Twitter","Upload",
  "Usb","User","Video","VisibleOff","VisibleOn","VolumeDown","VolumeOff","VolumeUp","Youtube",
  "Zoom","ZoomOut",
] as const;

/* ─── Color swatches — from Life design tokens ─── */
const COLOR_GROUPS = [
  {
    group: "Primary",
    swatches: [
      { label: "Primary 800", value: "#163746" },
      { label: "Primary 700", value: "#215369" },
      { label: "Primary 600", value: "#276d8b" },
      { label: "Primary 500", value: "#2e7fa1" },
      { label: "Primary 400", value: "#519dbd" },
      { label: "Primary 300", value: "#7fbcd7" },
      { label: "Primary 200", value: "#a9d3e5" },
      { label: "Primary 100", value: "#d4e9f2" },
    ],
  },
  {
    group: "Accent 1 — Teal",
    swatches: [
      { label: "Accent1 800", value: "#0f3937" },
      { label: "Accent1 700", value: "#145653" },
      { label: "Accent1 600", value: "#23716d" },
      { label: "Accent1 500", value: "#25837e" },
      { label: "Accent1 400", value: "#3ea39e" },
      { label: "Accent1 300", value: "#6bc2be" },
      { label: "Accent1 200", value: "#98d8d5" },
      { label: "Accent1 100", value: "#c8eeec" },
    ],
  },
  {
    group: "Accent 2 — Warm",
    swatches: [
      { label: "Accent2 800", value: "#42300f" },
      { label: "Accent2 700", value: "#604920" },
      { label: "Accent2 600", value: "#806128" },
      { label: "Accent2 500", value: "#92702f" },
      { label: "Accent2 400", value: "#b58e45" },
      { label: "Accent2 300", value: "#d6ad61" },
      { label: "Accent2 200", value: "#eac785" },
      { label: "Accent2 100", value: "#f8e2bf" },
    ],
  },
  {
    group: "Samaritan — Purple",
    swatches: [
      { label: "Samaritan 800", value: "#521e52" },
      { label: "Samaritan 700", value: "#773177" },
      { label: "Samaritan 600", value: "#9a429a" },
      { label: "Samaritan 500", value: "#af50af" },
      { label: "Samaritan 400", value: "#cc75cc" },
      { label: "Samaritan 300", value: "#e29ce2" },
      { label: "Samaritan 200", value: "#efbdef" },
      { label: "Samaritan 100", value: "#fbdbfb" },
    ],
  },
  {
    group: "Positive",
    swatches: [
      { label: "Positive 700", value: "#025a15" },
      { label: "Positive 600", value: "#13772a" },
      { label: "Positive 500", value: "#14892f" },
      { label: "Positive 400", value: "#37a851" },
      { label: "Positive 300", value: "#77c589" },
      { label: "Positive 200", value: "#a0d9ad" },
      { label: "Positive 100", value: "#cceed2" },
    ],
  },
  {
    group: "Warning",
    swatches: [
      { label: "Warning 700", value: "#803700" },
      { label: "Warning 600", value: "#ad4b00" },
      { label: "Warning 500", value: "#c45402" },
      { label: "Warning 400", value: "#e97116" },
      { label: "Warning 300", value: "#f4a162" },
      { label: "Warning 200", value: "#f8c096" },
      { label: "Warning 100", value: "#fce3cf" },
    ],
  },
  {
    group: "Critical",
    swatches: [
      { label: "Critical 700", value: "#9c0d1d" },
      { label: "Critical 600", value: "#c32238" },
      { label: "Critical 500", value: "#dc3449" },
      { label: "Critical 400", value: "#fc5a6f" },
      { label: "Critical 300", value: "#fd96a4" },
      { label: "Critical 200", value: "#fdbac2" },
      { label: "Critical 100", value: "#fddee2" },
    ],
  },
  {
    group: "Neutral",
    swatches: [
      { label: "Black", value: "#1a1a1a" },
      { label: "Neutral 800", value: "#333333" },
      { label: "Neutral 700", value: "#4d4d4d" },
      { label: "Neutral 600", value: "#666666" },
      { label: "Neutral 500", value: "#767676" },
      { label: "Neutral 400", value: "#949494" },
      { label: "Neutral 300", value: "#b3b3b3" },
      { label: "Neutral 200", value: "#cccccc" },
      { label: "Neutral 100", value: "#e5e5e5" },
      { label: "White", value: "#ffffff" },
    ],
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 52 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: "#1A1A1A", fontFamily: "Lato, sans-serif", borderBottom: "2px solid #E8E8EE", paddingBottom: 10 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 12, color: "#888", marginBottom: 10, fontFamily: "Lato, sans-serif" }}>{children}</p>;
}

function Group({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 20 }}>{children}</div>;
}

function Row({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: wrap ? "wrap" : "nowrap" }}>{children}</div>;
}

const TOAST_OPTS = { position: ToastPosition.BOTTOMRIGHT };

function ToastDemo() {
  const { addToast } = useToast();
  return (
    <Row wrap>
      <TextButton variant="secondary" size={Size.Small} onClick={() => addToast("Positive — all good!", TOAST_OPTS)}>
        Show toast
      </TextButton>
      <TextButton variant="secondary" size={Size.Small} onClick={() => addToast("Warning — check this out.", { ...TOAST_OPTS, showCloseButton: true })}>
        With close button
      </TextButton>
      <TextButton variant="secondary" size={Size.Small} onClick={() => addToast("Auto-closes after 2 seconds.", { ...TOAST_OPTS, autoClose: true, delay: 2000 })}>
        Auto-close
      </TextButton>
    </Row>
  );
}

export default function DesignSystemPage() {
  const [iconSearch, setIconSearch] = useState("");
  const [cbSelected, setCbSelected] = useState(false);
  const [rb, setRb] = useState("a");
  const [toggleOn, setToggleOn] = useState(false);
  const [ddValue, setDdValue] = useState<string | undefined>(undefined);
  const [tfVal, setTfVal] = useState("");
  const [taVal, setTaVal] = useState("");
  const [lifeUpdate, setLifeUpdate] = useState<{ installed: string; latest: string } | null>(null);
  const [lifeUpdating, setLifeUpdating] = useState(false);

  useEffect(() => {
    fetch("/api/life-update").then(r => r.json()).then(d => {
      if (d.updateAvailable) setLifeUpdate({ installed: d.installed, latest: d.latest });
    }).catch(() => {});
  }, []);

  const filteredIcons = ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <ThemeProvider theme={{}}>
    <ToastProvider>
      <div style={{ minHeight: "100vh", background: "#F5F5F5", fontFamily: "Lato, sans-serif" }}>

        {/* Header — matches main app */}
        <header style={{
          height: 60, flexShrink: 0,
          background: "#ffffff", borderBottom: "1px solid #E8E8EE",
          display: "flex", alignItems: "center", padding: "0 20px", gap: 8,
          position: "sticky", top: 0, zIndex: 20,
        }}>
          <SamaritanIcon size={20} />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A", letterSpacing: "-0.1px" }}>Samaritan Code</span>
          <span style={{ fontWeight: 400, fontSize: 14, color: "#888", fontFamily: "'Lato', sans-serif" }}>– build with Life</span>
        </header>

        {/* Life update notice — persistent, no close */}
        {lifeUpdate && (
          <div style={{
            background: "#d4e9f2", borderBottom: "1px solid #a9d3e5",
            padding: "10px 20px", display: "flex", alignItems: "center", gap: 10,
            fontSize: 13, fontFamily: "Lato, sans-serif", color: "#215369",
          }}>
            <SystemIcons.Information size="16" color="#215369" />
            <span>
              The components on this page are based on <strong>@laerdal/life-react-components v{lifeUpdate.installed}</strong>.
              A newer version <strong>v{lifeUpdate.latest}</strong> is available — some components may look different than the latest spec.
            </span>
            <div style={{ marginLeft: "auto" }}>
              <TextButton
                variant="secondary"
                size={Size.Small}
                onClick={async () => {
                  if (lifeUpdating) return;
                  setLifeUpdating(true);
                  await fetch("/api/life-update", { method: "POST" });
                  setLifeUpdating(false);
                  window.location.reload();
                }}
              >
                {lifeUpdating ? "Updating…" : `Update to v${lifeUpdate.latest}`}
              </TextButton>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px" }}>

          {/* Back button + Storybook link */}
          <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <TextButton variant="tertiary" size={Size.Small} onClick={() => window.location.href = "/"}>
              ← Back to builder
            </TextButton>
            <a
              href="https://reimagined-adventure-9279qzp.pages.github.io/?path=/docs/introduction--docs"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, color: "#2e7fa1", fontFamily: "Lato, sans-serif",
                textDecoration: "none", fontWeight: 500,
              }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
            >
              <SystemIcons.OpenNewWindow size="14" color="#2e7fa1" />
              Life Storybook
            </a>
          </div>

          {/* Colors */}
          <Section title="Colors">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {COLOR_GROUPS.map(({ group, swatches }) => (
                <div key={group}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 10, fontFamily: "Lato, sans-serif" }}>{group}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {swatches.map(({ label, value }) => (
                      <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: 8, background: value,
                          border: "1px solid rgba(0,0,0,0.08)",
                        }} />
                        <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace", textAlign: "center", lineHeight: 1.3 }}>{label}</span>
                        <span style={{ fontSize: 10, color: "#AAA", fontFamily: "monospace" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Buttons */}
          <Section title="Buttons">
            <Group>
              <Label>TextButton — variants</Label>
              <Row wrap>
                <TextButton variant="primary">Primary</TextButton>
                <TextButton variant="secondary">Secondary</TextButton>
                <TextButton variant="tertiary">Tertiary</TextButton>
                <TextButton variant="destructive">Destructive</TextButton>
                <TextButton variant="secondaryDestructive">Secondary Destructive</TextButton>
              </Row>
            </Group>
            <Group>
              <Label>TextButton — sizes</Label>
              <Row>
                <TextButton variant="primary" size={Size.Large}>Large</TextButton>
                <TextButton variant="primary" size={Size.Medium}>Medium</TextButton>
                <TextButton variant="primary" size={Size.Small}>Small</TextButton>
              </Row>
            </Group>
            <Group>
              <Label>IconButton</Label>
              <Row>
                <IconButton action={() => {}} title="Edit"><SystemIcons.Edit size="18" /></IconButton>
                <IconButton action={() => {}} useTransparentBackground title="Delete"><SystemIcons.Delete size="18" /></IconButton>
                <IconButton action={() => {}} title="Settings"><SystemIcons.GearSettings size="18" /></IconButton>
                <IconButton action={() => {}} title="Search"><SystemIcons.Search size="18" /></IconButton>
              </Row>
            </Group>
            <Group>
              <Label>BackButton</Label>
              <BackButton size={Size.Small} onClick={() => {}}>Back to overview</BackButton>
            </Group>
          </Section>

          {/* Tags */}
          <Section title="Tags">
            <Row wrap>
              {(["neutral","positive","warning","critical","accent1","accent2"] as const).map((v) => (
                <Tag key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} />
              ))}
              <Tag label="With icon" variant="accent1" icon={<SystemIcons.StarFilled size="12" />} />
            </Row>
          </Section>

          {/* Banners */}
          <Section title="Banners">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Banner type="positive">Positive banner — something went well.</Banner>
              <Banner type="neutral">Neutral banner — general information.</Banner>
              <Banner type="warning">Warning banner — take note of this.</Banner>
              <Banner type="critical">Critical banner — action required.</Banner>
              <Banner type="neutral" onClose={() => {}}>Dismissible banner.</Banner>
            </div>
          </Section>

          {/* Form Controls */}
          <Section title="Form Controls">
            <Group>
              <Label>TextField</Label>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 260px" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, fontFamily: "Lato, sans-serif" }}>Label</label>
                  <TextField
                    id="tf-demo"
                    placeholder="Placeholder text"
                    value={tfVal}
                    onChange={(text) => setTfVal(text)}
                  />
                </div>
                <div style={{ flex: "1 1 260px" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, fontFamily: "Lato, sans-serif" }}>Email (invalid)</label>
                  <TextField
                    id="tf-error"
                    placeholder="name@example.com"
                    value=""
                    validationMessage="This field is required"
                    state={States.Invalid}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </Group>
            <Group>
              <Label>Textarea</Label>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6, fontFamily: "Lato, sans-serif" }}>Description</label>
              <Textarea
                id="ta-demo"
                placeholder="Write something..."
                value={taVal}
                size={Size.Medium}
                onChange={(text) => setTaVal(text)}
              />
            </Group>
            <Group>
              <Label>Checkbox</Label>
              <Row>
                <Checkbox id="cb1" selected={cbSelected} select={(v) => setCbSelected(v)} label="Check me" />
                <Checkbox id="cb2" selected={true} select={() => {}} label="Checked" />
                <Checkbox id="cb3" selected={false} select={() => {}} label="Disabled" disabled />
              </Row>
            </Group>
            <Group>
              <Label>RadioButton</Label>
              <Row>
                {["Option A", "Option B", "Option C"].map((opt, i) => {
                  const val = ["a", "b", "c"][i];
                  return (
                    <RadioButton
                      key={val}
                      id={`rb-${val}`}
                      selected={rb === val}
                      select={() => setRb(val)}
                      label={opt}
                    />
                  );
                })}
              </Row>
            </Group>
            <Group>
              <Label>ToggleSwitch</Label>
              <ToggleSwitch
                id="toggle-demo"
                selected={toggleOn}
                onToggle={(v) => setToggleOn(v)}
                label={toggleOn ? "Enabled" : "Disabled"}
              />
            </Group>
            <Group>
              <Label>BasicDropdown</Label>
              <div style={{ maxWidth: 300 }}>
                <BasicDropdown
                  id="dd-demo"
                  placeholder="Select an option"
                  list={[
                    { value: "opt1", displayLabel: "Option 1" },
                    { value: "opt2", displayLabel: "Option 2" },
                    { value: "opt3", displayLabel: "Option 3" },
                  ]}
                  value={ddValue}
                  onSelect={(v) => setDdValue(v)}
                />
              </div>
            </Group>
          </Section>

          {/* Loading */}
          <Section title="Loading Indicator">
            <LoadingIndicator />
          </Section>

          {/* Toast */}
          <Section title="Toast Notifications">
            <ToastDemo />
          </Section>

          {/* Icons */}
          <Section title={`System Icons (${ICON_NAMES.length})`}>
            <div style={{ marginBottom: 16 }}>
              <input
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Search icons..."
                style={{
                  width: 260, height: 36, padding: "0 12px", borderRadius: 8,
                  border: "1px solid #E0E0E0", fontSize: 13, fontFamily: "Lato, sans-serif",
                  outline: "none", color: "#1A1A1A", background: "#fff",
                }}
              />
              {iconSearch && (
                <span style={{ marginLeft: 12, fontSize: 12, color: "#888" }}>
                  {filteredIcons.length} result{filteredIcons.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {filteredIcons.map((name) => {
                const Icon = (SystemIcons as any)[name];
                if (!Icon) return null;
                return (
                  <div
                    key={name}
                    title={name}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 6, padding: "10px 8px", borderRadius: 8, width: 88,
                      background: "#fff", border: "1px solid #E8E8EE",
                    }}
                  >
                    <Icon size="20" color="#1A1A1A" />
                    <span style={{ fontSize: 10, color: "#888", textAlign: "center", wordBreak: "break-word", lineHeight: 1.3 }}>{name}</span>
                  </div>
                );
              })}
            </div>
          </Section>

        </div>
      </div>
    </ToastProvider>
    </ThemeProvider>
  );
}
