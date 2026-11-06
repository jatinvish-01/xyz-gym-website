import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, Phone, Mail, MapPin, Instagram, Facebook, Youtube, ChevronLeft,
  ChevronRight, Star, Plus, Trash2, Pencil, Eye, EyeOff, ArrowUp, ArrowDown,
  Copy, Lock, LogOut, Dumbbell, MessageCircle, Clock, Settings, ShieldCheck,
  Inbox, Save, RotateCcw
} from "lucide-react";

const STORAGE_KEY = "gym-cms-data-v1";
const ENQUIRY_KEY = "gym-cms-enquiries-v1";
const ADMIN_PASS = "admin123";
const uid = () => Math.random().toString(36).slice(2, 10);

// Simple localStorage helpers (mimic the get/set shape used below)
function storageGet(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? { value } : null;
  } catch (e) { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, value); return { value }; } catch (e) { return null; }
}

const DEFAULT_DATA = {
  brand: {
    gymName: "ELITE FITNESS",
    tagline: "Train harder. Get stronger. Become unstoppable.",
    whatsapp: "8081613027",
    whatsappMessage: "Hi! I'm interested in joining {gym}. I'd like to know about membership plans and book a free trial.",
    phone: "+91 8081613027",
    email: "jatin.vishwakarma710@gmail.com",
    address: "12 MG Road, Bhadohi, Uttar Pradesh 221401",
    mapsUrl: "https://maps.app.goo.gl/PoxciidWQxdz1fRS8",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    logoUrl: "",
  },
  hours: [
    { day: "Monday", open: "05:30", close: "22:30", closed: false },
    { day: "Tuesday", open: "05:30", close: "22:30", closed: false },
    { day: "Wednesday", open: "05:30", close: "22:30", closed: false },
    { day: "Thursday", open: "05:30", close: "22:30", closed: false },
    { day: "Friday", open: "05:30", close: "22:30", closed: false },
    { day: "Saturday", open: "05:30", close: "22:30", closed: false },
    { day: "Sunday", open: "07:00", close: "14:00", closed: false },
  ],
  stats: [
    { id: uid(), value: 5, suffix: "+", label: "Years Experience" },
    { id: uid(), value: 500, suffix: "+", label: "Active Members" },
    { id: uid(), value: 20, suffix: "+", label: "Training Programs" },
    { id: uid(), value: 10, suffix: "+", label: "Expert Trainers" },
  ],
  programs: [
    { id: uid(), title: "Strength Training", desc: "Progressive overload programming to build raw power.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format", visible: true },
    { id: uid(), title: "Muscle Building", desc: "Hypertrophy-focused splits with expert form coaching.", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&auto=format", visible: true },
    { id: uid(), title: "Weight Loss", desc: "Fat-loss programming that pairs training with nutrition.", image: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=800&q=80&auto=format", visible: true },
    { id: uid(), title: "Personal Training", desc: "One-on-one coaching built around your exact goals.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format", visible: true },
    { id: uid(), title: "Functional Training", desc: "Movement-based conditioning for real-world strength.", image: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80&auto=format", visible: true },
    { id: uid(), title: "Cross Training", desc: "High-intensity mixed circuits that never get stale.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format", visible: true },
    { id: uid(), title: "Cardio & Conditioning", desc: "Build engine and endurance that carries into everything.", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80&auto=format", visible: true },
    { id: uid(), title: "Transformation Program", desc: "A structured 12-week reset for total-body change.", image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format", visible: true },
  ],
  trainers: [
    { id: uid(), name: "Arjun Rathore", role: "Head Strength Coach", experience: "8 yrs experience", bio: "Specialises in powerlifting and progressive strength cycles.", photo: "https://i.pravatar.cc/400?img=13", instagram: "https://instagram.com", visible: true },
    { id: uid(), name: "Meera Kapoor", role: "Fat Loss Coach", experience: "6 yrs experience", bio: "Builds sustainable fat-loss plans backed by nutrition coaching.", photo: "https://i.pravatar.cc/400?img=32", instagram: "https://instagram.com", visible: true },
    { id: uid(), name: "Vikram Sehgal", role: "Functional Trainer", experience: "5 yrs experience", bio: "Movement-first coaching for mobility, power and conditioning.", photo: "https://i.pravatar.cc/400?img=51", instagram: "https://instagram.com", visible: true },
    { id: uid(), name: "Sana Iyer", role: "Personal Trainer", experience: "4 yrs experience", bio: "One-on-one programming tailored to lifestyle and recovery.", photo: "https://i.pravatar.cc/400?img=47", instagram: "https://instagram.com", visible: true },
  ],
  transformations: [
    { id: uid(), name: "Rohit S.", goal: "Weight Loss", duration: "16 weeks", story: "Lost 14kg and rebuilt his energy from the ground up.", before: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format", after: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&auto=format", visible: true },
    { id: uid(), name: "Priya M.", goal: "Muscle Gain", duration: "20 weeks", story: "Added visible muscle while keeping her mobility sharp.", before: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&q=80&auto=format", after: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80&auto=format", visible: true },
    { id: uid(), name: "Karan D.", goal: "Strength", duration: "24 weeks", story: "Doubled his squat and deadlift under coached programming.", before: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80&auto=format", after: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80&auto=format", visible: true },
  ],
  plans: [
    { id: uid(), name: "BASIC", price: "999", duration: "MONTH", badge: "", features: ["Gym floor access", "Locker access", "Free fitness assessment"], visible: true },
    { id: uid(), name: "PRO", price: "1999", duration: "MONTH", badge: "MOST POPULAR", features: ["Everything in Basic", "Group classes", "Diet guidance", "Progress tracking"], visible: true },
    { id: uid(), name: "ELITE", price: "3999", duration: "MONTH", badge: "BEST VALUE", features: ["Everything in Pro", "Personal trainer", "Priority booking", "Recovery zone access"], visible: true },
  ],
  testimonials: [
    { id: uid(), name: "Aditya Verma", photo: "https://i.pravatar.cc/200?img=15", review: "Best gym I've trained at. The coaching actually changes how you lift.", rating: 5, date: "Aug 2026", visible: true },
    { id: uid(), name: "Neha Joshi", photo: "https://i.pravatar.cc/200?img=25", review: "Lost 10kg in 4 months with the trainers keeping me accountable.", rating: 5, date: "Jul 2026", visible: true },
    { id: uid(), name: "Farhan Khan", photo: "https://i.pravatar.cc/200?img=33", review: "Premium equipment, zero waiting, real results.", rating: 4, date: "Jun 2026", visible: true },
    { id: uid(), name: "Ishita Rao", photo: "https://i.pravatar.cc/200?img=45", review: "The community here keeps me showing up even on hard days.", rating: 5, date: "May 2026", visible: true },
  ],
  gallery: [
    { id: uid(), url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&q=80&auto=format", caption: "Main training floor", visible: true },
    { id: uid(), url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80&auto=format", caption: "Free weights zone", visible: true },
    { id: uid(), url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80&auto=format", caption: "Strength rigs", visible: true },
    { id: uid(), url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&q=80&auto=format", caption: "Evening session", visible: true },
    { id: uid(), url: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=700&q=80&auto=format", caption: "Functional zone", visible: true },
    { id: uid(), url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=700&q=80&auto=format", caption: "Night training", visible: true },
    { id: uid(), url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=80&auto=format", caption: "Group workout", visible: true },
    { id: uid(), url: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=700&q=80&auto=format", caption: "1-on-1 coaching", visible: true },
  ],
};

const NAV_ITEMS = ["Home", "About", "Programs", "Trainers", "Membership", "Gallery", "Transformations", "Contact"];

function waLink(number, message) {
  const clean = (number || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
function fillMsg(msg, gymName) {
  return (msg || "").replace(/\{gym\}/gi, gymName);
}
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useCountUp(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const dur = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target]);
  return val;
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ---------------- ADMIN GENERIC COLLECTION EDITOR ---------------- */
function AdminCollection({ title, items, setItems, fields, addLabel }) {
  const blank = () => {
    const o = { id: uid(), visible: true };
    fields.forEach((f) => { o[f.key] = f.type === "features" ? [] : f.type === "checkbox" ? false : ""; });
    return o;
  };
  const update = (id, key, val) => setItems(items.map((it) => (it.id === id ? { ...it, [key]: val } : it)));
  const remove = (id) => setItems(items.filter((it) => it.id !== id));
  const duplicate = (id) => { const it = items.find((i) => i.id === id); setItems([...items, { ...it, id: uid() }]); };
  const move = (id, dir) => {
    const idx = items.findIndex((i) => i.id === id);
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const arr = [...items];[arr[idx], arr[j]] = [arr[j], arr[idx]]; setItems(arr);
  };

  return (
    <div className="adm-block">
      <div className="adm-block-head">
        <h3>{title}</h3>
        <button className="adm-btn adm-btn-red" onClick={() => setItems([...items, blank()])}><Plus size={15} /> {addLabel}</button>
      </div>
      {items.length === 0 && <p className="adm-empty">Nothing here yet — add one to get started.</p>}
      {items.map((it, idx) => (
        <div key={it.id} className={"adm-card" + (it.visible === false ? " adm-card-hidden" : "")}>
          <div className="adm-card-top">
            <span className="adm-num">#{idx + 1}</span>
            <div className="adm-card-actions">
              <button title="Move up" onClick={() => move(it.id, -1)}><ArrowUp size={14} /></button>
              <button title="Move down" onClick={() => move(it.id, 1)}><ArrowDown size={14} /></button>
              <button title="Duplicate" onClick={() => duplicate(it.id)}><Copy size={14} /></button>
              <button title={it.visible === false ? "Show" : "Hide"} onClick={() => update(it.id, "visible", it.visible === false)}>
                {it.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button title="Delete" className="adm-danger" onClick={() => remove(it.id)}><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="adm-card-grid">
            {fields.map((f) => (
              <label key={f.key} className={"adm-field adm-field-" + f.type}>
                <span>{f.label}</span>
                {f.type === "textarea" && <textarea rows={3} value={it[f.key] || ""} onChange={(e) => update(it.id, f.key, e.target.value)} />}
                {f.type === "features" && (
                  <textarea rows={3} placeholder="One per line" value={(it[f.key] || []).join("\n")} onChange={(e) => update(it.id, f.key, e.target.value.split("\n"))} />
                )}
                {f.type === "checkbox" && <input type="checkbox" checked={!!it[f.key]} onChange={(e) => update(it.id, f.key, e.target.checked)} />}
                {(f.type === "text" || f.type === "image" || f.type === "number") && (
                  <input type={f.type === "number" ? "number" : "text"} value={it[f.key] ?? ""} onChange={(e) => update(it.id, f.key, f.type === "number" ? e.target.value : e.target.value)} />
                )}
              </label>
            ))}
          </div>
          {it.image !== undefined && it.image && <img src={it.image} alt="" className="adm-preview" />}
          {it.photo !== undefined && it.photo && <img src={it.photo} alt="" className="adm-preview adm-preview-round" />}
          {it.before !== undefined && it.before && it.after && (
            <div className="adm-preview-pair">
              <img src={it.before} alt="before" /><img src={it.after} alt="after" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- ADMIN PANEL ---------------- */
function AdminPanel({ data, setData, onClose, onLogout }) {
  const [tab, setTab] = useState("branding");
  const [enquiries, setEnquiries] = useState(null);
  const [saved, setSaved] = useState(false);

  const patchBrand = (key, val) => setData((d) => ({ ...d, brand: { ...d.brand, [key]: val } }));
  const patchHour = (idx, key, val) => setData((d) => {
    const hours = [...d.hours]; hours[idx] = { ...hours[idx], [key]: val }; return { ...d, hours };
  });
  const patchStat = (idx, key, val) => setData((d) => {
    const stats = [...d.stats]; stats[idx] = { ...stats[idx], [key]: val }; return { ...d, stats };
  });

  const loadEnquiries = useCallback(async () => {
    try {
      const res = storageGet(ENQUIRY_KEY);
      setEnquiries(res && res.value ? JSON.parse(res.value) : []);
    } catch (e) { setEnquiries([]); }
  }, []);

  useEffect(() => { if (tab === "enquiries") loadEnquiries(); }, [tab, loadEnquiries]);

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1400); };

  const TABS = [
    ["branding", "Branding & Gym Info"],
    ["whatsapp", "WhatsApp"],
    ["hours", "Timings"],
    ["programs", "Programs"],
    ["trainers", "Trainers"],
    ["memberships", "Memberships"],
    ["transformations", "Transformations"],
    ["testimonials", "Testimonials"],
    ["gallery", "Gallery"],
    ["enquiries", "Enquiries"],
  ];

  return (
    <div className="adm-overlay">
      <div className="adm-shell">
        <div className="adm-sidebar">
          <div className="adm-logo"><ShieldCheck size={18} /> ADMIN DASHBOARD</div>
          <nav>
            {TABS.map(([key, label]) => (
              <button key={key} className={"adm-nav-item" + (tab === key ? " active" : "")} onClick={() => setTab(key)}>{label}</button>
            ))}
          </nav>
          <div className="adm-sidebar-foot">
            <button className="adm-btn adm-btn-ghost" onClick={() => { flashSaved(); }}><Save size={14} /> {saved ? "Saved!" : "Save now"}</button>
            <button className="adm-btn adm-btn-ghost" onClick={onLogout}><LogOut size={14} /> Log out</button>
            <button className="adm-btn adm-btn-ghost" onClick={onClose}><X size={14} /> Close</button>
          </div>
        </div>

        <div className="adm-main">
          {tab === "branding" && (
            <div className="adm-block">
              <div className="adm-block-head"><h3>Branding &amp; Gym Info</h3></div>
              <div className="adm-form-grid">
                <label className="adm-field"><span>Gym name</span><input value={data.brand.gymName} onChange={(e) => patchBrand("gymName", e.target.value)} /></label>
                <label className="adm-field"><span>Tagline</span><input value={data.brand.tagline} onChange={(e) => patchBrand("tagline", e.target.value)} /></label>
                <label className="adm-field"><span>Phone</span><input value={data.brand.phone} onChange={(e) => patchBrand("phone", e.target.value)} /></label>
                <label className="adm-field"><span>Email</span><input value={data.brand.email} onChange={(e) => patchBrand("email", e.target.value)} /></label>
                <label className="adm-field adm-field-textarea"><span>Address</span><textarea rows={2} value={data.brand.address} onChange={(e) => patchBrand("address", e.target.value)} /></label>
                <label className="adm-field"><span>Google Maps URL</span><input value={data.brand.mapsUrl} onChange={(e) => patchBrand("mapsUrl", e.target.value)} /></label>
                <label className="adm-field"><span>Instagram URL</span><input value={data.brand.instagram} onChange={(e) => patchBrand("instagram", e.target.value)} /></label>
                <label className="adm-field"><span>Facebook URL</span><input value={data.brand.facebook} onChange={(e) => patchBrand("facebook", e.target.value)} /></label>
                <label className="adm-field"><span>YouTube URL</span><input value={data.brand.youtube} onChange={(e) => patchBrand("youtube", e.target.value)} /></label>
                <label className="adm-field"><span>Logo Image URL</span><input value={data.brand.logoUrl} onChange={(e) => patchBrand("logoUrl", e.target.value)} /></label>
              </div>
              <div className="adm-block-head" style={{ marginTop: 28 }}><h3>About stats (animated counters)</h3></div>
              <div className="adm-form-grid">
                {data.stats.map((s, i) => (
                  <div key={s.id} className="adm-inline-trio">
                    <label className="adm-field"><span>Value</span><input type="number" value={s.value} onChange={(e) => patchStat(i, "value", Number(e.target.value))} /></label>
                    <label className="adm-field"><span>Suffix</span><input value={s.suffix} onChange={(e) => patchStat(i, "suffix", e.target.value)} /></label>
                    <label className="adm-field"><span>Label</span><input value={s.label} onChange={(e) => patchStat(i, "label", e.target.value)} /></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "whatsapp" && (
            <div className="adm-block">
              <div className="adm-block-head"><h3>WhatsApp Enquiry System</h3></div>
              <p className="adm-hint">This number and message power every WhatsApp button on the site — change it once here.</p>
              <div className="adm-form-grid">
                <label className="adm-field"><span>WhatsApp number (with country code, digits only)</span><input value={data.brand.whatsapp} onChange={(e) => patchBrand("whatsapp", e.target.value)} /></label>
                <label className="adm-field adm-field-textarea"><span>Default message (use {"{gym}"} for gym name)</span><textarea rows={3} value={data.brand.whatsappMessage} onChange={(e) => patchBrand("whatsappMessage", e.target.value)} /></label>
              </div>
              <p className="adm-hint">Preview: “{fillMsg(data.brand.whatsappMessage, data.brand.gymName)}”</p>
            </div>
          )}

          {tab === "hours" && (
            <div className="adm-block">
              <div className="adm-block-head"><h3>Gym Timings</h3></div>
              {data.hours.map((h, i) => (
                <div key={h.day} className="adm-hours-row">
                  <span className="adm-hours-day">{h.day}</span>
                  <label className="adm-field"><span>Open</span><input type="time" value={h.open} onChange={(e) => patchHour(i, "open", e.target.value)} disabled={h.closed} /></label>
                  <label className="adm-field"><span>Close</span><input type="time" value={h.close} onChange={(e) => patchHour(i, "close", e.target.value)} disabled={h.closed} /></label>
                  <label className="adm-field adm-field-checkbox"><span>Closed</span><input type="checkbox" checked={h.closed} onChange={(e) => patchHour(i, "closed", e.target.checked)} /></label>
                </div>
              ))}
            </div>
          )}

          {tab === "programs" && (
            <AdminCollection title="Programs" addLabel="Add program" items={data.programs}
              setItems={(items) => setData((d) => ({ ...d, programs: items }))}
              fields={[{ key: "title", label: "Title", type: "text" }, { key: "desc", label: "Description", type: "textarea" }, { key: "image", label: "Image URL", type: "image" }]} />
          )}

          {tab === "trainers" && (
            <AdminCollection title="Trainers" addLabel="Add trainer" items={data.trainers}
              setItems={(items) => setData((d) => ({ ...d, trainers: items }))}
              fields={[{ key: "name", label: "Name", type: "text" }, { key: "role", label: "Specialization", type: "text" }, { key: "experience", label: "Experience", type: "text" }, { key: "bio", label: "Bio", type: "textarea" }, { key: "photo", label: "Photo URL", type: "image" }, { key: "instagram", label: "Instagram URL", type: "text" }]} />
          )}

          {tab === "memberships" && (
            <AdminCollection title="Membership plans" addLabel="Add plan" items={data.plans}
              setItems={(items) => setData((d) => ({ ...d, plans: items }))}
              fields={[{ key: "name", label: "Plan name", type: "text" }, { key: "price", label: "Price (₹)", type: "text" }, { key: "duration", label: "Duration label", type: "text" }, { key: "badge", label: "Badge (optional)", type: "text" }, { key: "features", label: "Features", type: "features" }]} />
          )}

          {tab === "transformations" && (
            <AdminCollection title="Transformations" addLabel="Add transformation" items={data.transformations}
              setItems={(items) => setData((d) => ({ ...d, transformations: items }))}
              fields={[{ key: "name", label: "Member name", type: "text" }, { key: "goal", label: "Goal", type: "text" }, { key: "duration", label: "Duration", type: "text" }, { key: "story", label: "Short story", type: "textarea" }, { key: "before", label: "Before image URL", type: "image" }, { key: "after", label: "After image URL", type: "image" }]} />
          )}

          {tab === "testimonials" && (
            <AdminCollection title="Testimonials" addLabel="Add testimonial" items={data.testimonials}
              setItems={(items) => setData((d) => ({ ...d, testimonials: items }))}
              fields={[{ key: "name", label: "Customer name", type: "text" }, { key: "photo", label: "Photo URL", type: "image" }, { key: "review", label: "Review", type: "textarea" }, { key: "rating", label: "Rating (1-5)", type: "number" }, { key: "date", label: "Date", type: "text" }]} />
          )}

          {tab === "gallery" && (
            <AdminCollection title="Gallery / Media Library" addLabel="Add image" items={data.gallery}
              setItems={(items) => setData((d) => ({ ...d, gallery: items }))}
              fields={[{ key: "url", label: "Image URL", type: "image" }, { key: "caption", label: "Caption", type: "text" }]} />
          )}

          {tab === "enquiries" && (
            <div className="adm-block">
              <div className="adm-block-head"><h3>Enquiries</h3><button className="adm-btn adm-btn-ghost" onClick={loadEnquiries}><RotateCcw size={14} /> Refresh</button></div>
              {enquiries === null && <p className="adm-hint">Loading…</p>}
              {enquiries && enquiries.length === 0 && <p className="adm-empty"><Inbox size={16} /> No enquiries yet.</p>}
              {enquiries && enquiries.slice().reverse().map((en) => (
                <div key={en.id} className="adm-enquiry-card">
                  <div className="adm-enquiry-top"><strong>{en.name}</strong><span>{new Date(en.time).toLocaleString()}</span></div>
                  <div className="adm-enquiry-grid">
                    <span>Phone: {en.phone}</span><span>Email: {en.email || "—"}</span>
                    <span>Age: {en.age || "—"}</span><span>Goal: {en.goal}</span>
                    <span>Preferred time: {en.time_pref}</span><span>Membership: {en.membership}</span>
                  </div>
                  {en.message && <p className="adm-enquiry-msg">"{en.message}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- PUBLIC SITE ---------------- */
function Counter({ value, suffix }) {
  const [ref, inView] = useInView();
  const n = useCountUp(value, inView);
  return <span ref={ref}>{n}{suffix}</span>;
}

function BeforeAfter({ before, after, name }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="ba-wrap">
      <div className="ba-frame">
        <img src={after} alt="after" className="ba-img" />
        <div className="ba-before-layer" style={{ width: pos + "%" }}>
          <img src={before} alt="before" className="ba-img" />
        </div>
        <div className="ba-handle" style={{ left: pos + "%" }} />
        <span className="ba-tag ba-tag-l">BEFORE</span>
        <span className="ba-tag ba-tag-r">AFTER</span>
      </div>
      <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(Number(e.target.value))} className="ba-slider" aria-label={"Compare before and after for " + name} />
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [testiIdx, setTestiIdx] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", age: "", goal: "Weight Loss", time_pref: "Morning", membership: "Pro", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = storageGet(STORAGE_KEY);
        if (mounted && res && res.value) setData(JSON.parse(res.value));
      } catch (e) { /* first run, keep defaults */ }
      if (mounted) setLoaded(true);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      storageSet(STORAGE_KEY, JSON.stringify(data));
    }, 500);
    return () => clearTimeout(t);
  }, [data, loaded]);

  useEffect(() => {
    const t = setInterval(() => {
      const visible = data.testimonials.filter((x) => x.visible !== false);
      if (visible.length) setTestiIdx((i) => (i + 1) % visible.length);
    }, 5000);
    return () => clearInterval(t);
  }, [data.testimonials]);

  const gymName = data.brand.gymName;
  const waMsg = fillMsg(data.brand.whatsappMessage, gymName);
  const waHref = waLink(data.brand.whatsapp, waMsg);

  const isOpenNow = () => {
    const now = new Date();
    const idx = (now.getDay() + 6) % 7; // Monday=0
    const day = data.hours[idx];
    if (!day || day.closed) return false;
    const [oh, om] = day.open.split(":").map(Number);
    const [ch, cm] = day.close.split(":").map(Number);
    const mins = now.getHours() * 60 + now.getMinutes();
    return mins >= oh * 60 + om && mins <= ch * 60 + cm;
  };

  const tryLogin = () => {
    if (passInput === ADMIN_PASS) { setAdminOpen(true); setLoginOpen(false); setPassInput(""); setLoginErr(""); }
    else setLoginErr("Wrong passcode. Try admin123 for this demo.");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const entry = { ...form };
    try {
      let list = [];
      const res = storageGet(ENQUIRY_KEY); if (res && res.value) list = JSON.parse(res.value);
      list.push({ ...entry, id: uid(), time: new Date().toISOString() });
      storageSet(ENQUIRY_KEY, JSON.stringify(list));
    } catch (er) { console.error(er); }
    const msg = `*New Gym Enquiry*\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Goal:* ${form.goal}\nPreferred *Time:* ${form.time_pref}\n*Membership:* ${form.membership}\n*Message:* ${form.message || "-"}`;
    window.open(waLink(data.brand.whatsapp, msg), "_blank");
    setFormSent(true);
    setForm({ name: "", phone: "", email: "", age: "", goal: "Weight Loss", time_pref: "Morning", membership: "Pro", message: "" });
  };

  const visiblePrograms = data.programs.filter((p) => p.visible !== false);
  const visibleTrainers = data.trainers.filter((t) => t.visible !== false);
  const visiblePlans = data.plans.filter((p) => p.visible !== false);
  const visibleTransform = data.transformations.filter((t) => t.visible !== false);
  const visibleTesti = data.testimonials.filter((t) => t.visible !== false);
  const visibleGallery = data.gallery.filter((g) => g.visible !== false);

  return (
    <div className="gg-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');
        html, body{ overflow-x:hidden; max-width:100%; }
        .gg-root{ --black:#0a0a0a; --charcoal:#141414; --charcoal2:#1c1c1c; --red:#e21f27; --red2:#ff4d4f; --white:#f4f4f4; --gray:#9b9b9b; --border:rgba(255,255,255,.09);
          background:var(--black); color:var(--white); font-family:'Inter',sans-serif; line-height:1.5; }
        .gg-root *{ box-sizing:border-box; }
        .gg-root h1,.gg-root h2,.gg-root h3,.gg-root h4{ font-family:'Bebas Neue',sans-serif; letter-spacing:.5px; margin:0; }
        .gg-root p{ margin:0; }
        .gg-container{ max-width:1180px; margin:0 auto; padding:0 24px; }
        .gg-glow{ position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; opacity:.35; }
        /* NAV */
        .gg-nav{ position:sticky; top:0; z-index:40; background:rgba(10,10,10,.85); backdrop-filter:blur(5px); border-bottom:1px solid var(--border); }
        .gg-nav-inner{ max-width:1180px; margin:0 auto; padding:4px 24px; display:flex; align-items:center; justify-content:space-between; }
        .gg-logo{ font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:2px; color:var(--white); }
        .gg-logo span{ color:var(--red); }
        .gg-nav-links{ display:none; align-items:center; gap:28px; }
        .gg-nav-links a{ color:var(--gray); text-decoration:none; font-size:14px; font-weight:600; cursor:pointer; transition:color .2s; }
        .gg-nav-links a:hover{ color:var(--red); }
        .gg-nav-right{ display:flex; align-items:center; gap:12px; }
        .gg-hamburger{ display:flex; background:none; border:none; color:var(--white); cursor:pointer; }
        @media(min-width:960px){ .gg-nav-links{ display:flex; } .gg-hamburger{ display:none; } }
        .gg-mobile-menu{ background:var(--charcoal); border-top:1px solid var(--border); padding:12px 24px 20px; display:flex; flex-direction:column; gap:14px; }
        .gg-mobile-menu a{ color:var(--white); text-decoration:none; font-size:15px; font-weight:600; }
        /* BUTTONS */
        .gg-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 26px; border-radius:6px; font-weight:700; font-size:14px; letter-spacing:.5px; cursor:pointer; border:none; transition:transform .18s ease, box-shadow .18s ease; text-decoration:none; }
        .gg-btn-primary{ background:var(--red); color:#fff; box-shadow:0 0 0 rgba(226,31,39,0); }
        .gg-btn-primary:hover{ transform:translateY(-2px); box-shadow:0 8px 24px rgba(226,31,39,.45); }
        .gg-btn-outline{ background:transparent; color:var(--white); border:1.5px solid rgba(255,255,255,.25); }
        .gg-btn-outline:hover{ border-color:var(--red); color:var(--red2); }
        .gg-btn-sm{ padding:9px 16px; font-size:12.5px; }
        /* HERO */
        .gg-hero{ position:relative; min-height:92vh; display:flex; align-items:flex-end; background:linear-gradient(180deg, rgba(10,10,10,.4), rgba(10,10,10,.96)), url('https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=1600&q=80&auto=format') center/cover; padding:60px 0 70px; }
        .gg-hero-content{ position:relative; z-index:2; max-width:720px; }
        .gg-hero h1{ font-size:clamp(48px,8vw,92px); line-height:.95; color:var(--white); text-transform:uppercase; }
        .gg-hero h1 em{ font-style:normal; color:var(--red); }
        .gg-hero-sub{ margin-top:18px; font-size:18px; color:#d8d8d8; max-width:480px; }
        .gg-hero-ctas{ display:flex; flex-wrap:wrap; gap:14px; margin-top:34px; }
        .gg-hero-stats{ display:flex; gap:34px; margin-top:56px; flex-wrap:wrap; }
        .gg-hero-stats div{ font-family:'Bebas Neue',sans-serif; font-size:15px; color:#c8c8c8; letter-spacing:1px; border-left:2px solid var(--red); padding-left:12px; }
        /* SECTIONS */
        .gg-section{ padding:96px 0; position:relative; }
        .gg-section-alt{ background:var(--charcoal); }
        .gg-heading{ font-size:clamp(34px,5vw,54px); text-transform:uppercase; color:var(--white); max-width:640px; }
        .gg-heading em{ font-style:normal; color:var(--red); }
        .gg-sub{ color:var(--gray); max-width:560px; margin-top:14px; font-size:15.5px; }
        /* ABOUT */
        .gg-about-grid{ display:grid; grid-template-columns:1fr; gap:44px; align-items:center; margin-top:50px; }
        @media(min-width:900px){ .gg-about-grid{ grid-template-columns:1fr 1fr; } }
        .gg-about-img{ position:relative; border-radius:14px; aspect-ratio:4/5; }
        .gg-about-img img{ width:100%; height:100%; object-fit:cover; }
        .gg-stats-row{ display:grid; grid-template-columns:repeat(2,1fr); gap:22px; margin-top:34px; }
        .gg-stat-num{ font-family:'Bebas Neue',sans-serif; font-size:44px; color:var(--red2); }
        .gg-stat-label{ font-size:12.5px; color:var(--gray); text-transform:uppercase; letter-spacing:.5px; margin-top:2px; }
        /* CARDS GRID */
        .gg-grid-3{ display:grid; grid-template-columns:1fr; gap:24px; margin-top:50px; }
        @media(min-width:700px){ .gg-grid-3{ grid-template-columns:1fr 1fr; } }
        @media(min-width:1024px){ .gg-grid-3{ grid-template-columns:repeat(4,1fr); } }
        .gg-plans-grid{ display:flex; gap:18px; overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; margin-top:50px; padding-top:16px; padding-bottom:10px; touch-action:pan-x; scrollbar-width:none; }
        .gg-plans-grid .gg-plan-card{ flex:0 0 92%; scroll-snap-align:center; }
        .gg-plans-grid::-webkit-scrollbar{ display:none; }
        .gg-plans-wrap{ position:relative; }
        @media(min-width:700px){ .gg-plans-grid{ display:grid; grid-template-columns:repeat(3,1fr); overflow:visible; padding-bottom:0; } .gg-plans-grid .gg-plan-card{ flex:unset; } }
        @media(max-width:699px){
        .gg-plan-arrow{ display:none; }
        .gg-plan-arrow.left{ left:-6px; }
        .gg-plan-arrow{ display:flex; align-items:center; justify-content:center; position:absolute; top:45%; transform:translateY(-50%); width:36px; height:36px; border-radius:50%; background:var(--red); color:#fff; border:none; font-size:20px; z-index:5; cursor:pointer; }
        }
        .gg-plan-arrow.right{ right:-6px; }
        .gg-card{ background:var(--charcoal2); border:1px solid var(--border); border-radius:14px; overflow:hidden; transition:transform .25s ease, border-color .25s ease; }
        .gg-card:hover{ transform:translateY(-6px); border-color:rgba(226,31,39,.5); }
        .gg-card-img{ height:180px; overflow:hidden; }
        .gg-card-img img{ width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
        .gg-card:hover .gg-card-img img{ transform:scale(1.08); }
        .gg-card-body{ padding:20px; }
        .gg-card-body h4{ font-size:20px; color:var(--white); text-transform:uppercase; }
        .gg-card-body p{ color:var(--gray); font-size:13.5px; margin-top:8px; min-height:42px; }
        .gg-card-body .gg-btn{ margin-top:14px; width:100%; }
        /* TRAINERS */
        .gg-trainer-card{ text-align:center; }
        .gg-trainer-photo{ width:100%; aspect-ratio:1; border-radius:14px 14px 0 0; overflow:hidden; }
        .gg-trainer-photo img{ width:100%; height:100%; object-fit:cover; }
        .gg-trainer-card .gg-card-body h4{ font-size:19px; }
        .gg-trainer-role{ color:var(--red2); font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-top:4px; }
        .gg-trainer-exp{ color:var(--gray); font-size:12px; margin-top:2px; }
        /* TRANSFORMATIONS */
        .ba-wrap{ background:var(--charcoal2); border:1px solid var(--border); border-radius:14px; padding:18px; }
        .ba-frame{ position:relative; aspect-ratio:4/3; border-radius:10px; overflow:hidden; }
        .ba-img{ width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; }
        .ba-before-layer{ position:absolute; top:0; left:0; height:100%; overflow:hidden; border-right:2px solid var(--red); }
        .ba-handle{ position:absolute; top:0; bottom:0; width:2px; background:var(--red); transform:translateX(-1px); }
        .ba-tag{ position:absolute; top:10px; font-size:11px; font-weight:800; letter-spacing:1px; background:rgba(0,0,0,.65); padding:4px 9px; border-radius:4px; z-index:3; }
        .ba-tag-l{ left:10px; } .ba-tag-r{ right:10px; }
        .ba-slider{ width:100%; margin-top:14px; accent-color:var(--red); }
        .gg-transform-meta{ padding:16px 4px 4px; }
        .gg-transform-meta h4{ font-size:19px; color:var(--white); }
        .gg-transform-meta .tags{ display:flex; gap:8px; margin:8px 0; }
        .gg-transform-meta .tag{ font-size:11px; background:rgba(226,31,39,.15); color:var(--red2); padding:3px 9px; border-radius:20px; font-weight:700; }
        .gg-transform-meta p{ color:var(--gray); font-size:13.5px; }
        /* MEMBERSHIP */
        .gg-plan-card{ background:var(--charcoal2); border:1px solid var(--border); border-radius:16px; padding:32px 26px; position:relative; display:flex; flex-direction:column; }
        .gg-plan-card.featured{ border-color:var(--red); box-shadow:0 0 40px rgba(226,31,39,.25); }
        .gg-plan-badge{ position:absolute; top:-13px; left:26px; background:var(--red); color:#fff; font-size:11px; font-weight:800; padding:5px 12px; border-radius:20px; letter-spacing:.5px; }
        .gg-plan-name{ font-size:24px; color:var(--white); }
        .gg-plan-price{ font-family:'Bebas Neue',sans-serif; font-size:52px; color:var(--red2); margin-top:10px; }
        .gg-plan-price span{ font-size:14px; color:var(--gray); font-family:'Inter',sans-serif; }
        .gg-plan-features{ list-style:none; padding:0; margin:22px 0; display:flex; flex-direction:column; gap:11px; flex:1; }
        .gg-plan-features li{ color:#d6d6d6; font-size:13.5px; padding-left:18px; position:relative; }
        .gg-plan-features li::before{ content:'✓'; position:absolute; left:0; color:var(--red2); font-weight:800; }
        /* TESTIMONIALS */
        .gg-testi-wrap{ max-width:680px; margin:50px auto 0; text-align:center; position:relative; }
        .gg-testi-photo{ width:66px; height:66px; border-radius:50%; object-fit:cover; margin:0 auto 16px; border:2px solid var(--red); }
        .gg-testi-review{ font-size:19px; color:#eee; font-style:italic; }
        .gg-testi-name{ margin-top:16px; font-weight:700; color:var(--white); font-size:14px; }
        .gg-testi-date{ color:var(--gray); font-size:12px; }
        .gg-testi-stars{ display:flex; justify-content:center; gap:3px; margin-top:6px; }
        .gg-testi-dots{ display:flex; justify-content:center; gap:8px; margin-top:26px; }
        .gg-testi-dots button{ width:8px; height:8px; border-radius:50%; border:none; background:rgba(255,255,255,.25); cursor:pointer; }
        .gg-testi-dots button.active{ background:var(--red); width:22px; border-radius:5px; }
        /* GALLERY */
        .gg-masonry{ column-count:1; column-gap:16px; margin-top:50px; }
        @media(min-width:640px){ .gg-masonry{ column-count:2; } }
        @media(min-width:1000px){ .gg-masonry{ column-count:3; } }
        .gg-masonry-item{ break-inside:avoid; margin-bottom:16px; position:relative; border-radius:10px; overflow:hidden; }
        .gg-masonry-item img{ width:100%; display:block; transition:transform .4s ease; }
        .gg-masonry-item:hover img{ transform:scale(1.06); }
        .gg-masonry-cap{ position:absolute; bottom:0; left:0; right:0; padding:10px 12px; background:linear-gradient(0deg, rgba(0,0,0,.75), transparent); font-size:12.5px; color:#ddd; }
        /* HOURS + CONTACT */
        .gg-info-grid{ display:grid; grid-template-columns:1fr; gap:40px; margin-top:50px; }
        @media(min-width:900px){ .gg-info-grid{ grid-template-columns:1fr 1fr; } }
        .gg-hours-list{ display:flex; flex-direction:column; gap:9px; }
        .gg-hours-list .row{ display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding:8px 0; font-size:14px; color:#ddd; }
        .gg-hours-list .row span:last-child{ color:var(--gray); }
        .gg-status-pill{ display:inline-flex; align-items:center; gap:7px; font-size:12.5px; font-weight:800; padding:6px 14px; border-radius:20px; letter-spacing:.5px; margin-bottom:18px; }
        .gg-status-open{ background:rgba(34,197,94,.15); color:#4ade80; }
        .gg-status-closed{ background:rgba(226,31,39,.15); color:var(--red2); }
        .gg-contact-item{ display:flex; gap:12px; align-items:flex-start; margin-bottom:18px; color:#ddd; font-size:14px; }
        .gg-contact-item svg{ color:var(--red2); flex-shrink:0; margin-top:2px; }
        /* ENQUIRY FORM */
        .gg-form{ display:grid; grid-template-columns:1fr; gap:16px; margin-top:40px; }
        @media(min-width:700px){ .gg-form{ grid-template-columns:1fr 1fr; } }
        .gg-form label{ display:flex; flex-direction:column; gap:7px; font-size:12.5px; color:var(--gray); text-transform:uppercase; letter-spacing:.5px; text-align:left; }
        .gg-form input, .gg-form select, .gg-form textarea{ background:var(--charcoal2); border:1px solid var(--border); border-radius:8px; padding:12px 14px; color:var(--white); font-size:14px; font-family:'Inter',sans-serif; }
        .gg-form input:focus, .gg-form select:focus, .gg-form textarea:focus{ outline:none; border-color:var(--red); }
        .gg-form-full{ grid-column:1/-1; }
        .gg-form-note{ margin-top:14px; color:#4ade80; font-size:13.5px; }
        /* FINAL CTA */
        .gg-final-cta{ text-align:center; background:radial-gradient(ellipse at center, rgba(226,31,39,.18), var(--black) 70%); padding:110px 0; }
        .gg-final-cta h2{ font-size:clamp(36px,6vw,64px); }
        .gg-final-cta-ctas{ display:flex; justify-content:center; gap:16px; flex-wrap:wrap; margin-top:32px; }
        /* FOOTER */
        .gg-footer{ background:#050505; border-top:1px solid var(--border); padding:60px 0 26px; }
        .gg-footer-grid{ display:grid; grid-template-columns:1fr; gap:36px; }
        @media(min-width:800px){ .gg-footer-grid{ grid-template-columns:2fr 1fr 1fr 1fr; } }
        .gg-footer-grid > div{ text-align:left; }
        .gg-footer h5{ font-family:'Inter',sans-serif; font-weight:700; font-size:13px; text-transform:uppercase; letter-spacing:.5px; color:var(--white); margin-bottom:16px; }
        .gg-footer a{ display:block; color:var(--gray); text-decoration:none; font-size:13.5px; margin-bottom:10px; }
        .gg-footer a:hover{ color:var(--red2); }
        .gg-footer-bottom{ border-top:1px solid var(--border); margin-top:40px; padding-top:22px; display:flex; flex-wrap:wrap; justify-content:space-between; gap:14px; color:var(--gray); font-size:12.5px; }
        .gg-socials{ display:flex; gap:14px; }
        .gg-socials a{ color:var(--gray); }
        .gg-socials a:hover{ color:var(--red2); }
        /* WHATSAPP FLOAT */
        .gg-wa-float{ position:fixed; bottom:22px; right:22px; z-index:50; background:#25D366; color:#fff; border-radius:50px; padding:14px 20px; display:flex; align-items:center; gap:9px; font-weight:700; font-size:13.5px; text-decoration:none; box-shadow:0 8px 24px rgba(0,0,0,.4); animation:gg-pulse 2.4s infinite; }
        @keyframes gg-pulse{ 0%{box-shadow:0 0 0 0 rgba(37,211,102,.5);} 70%{box-shadow:0 0 0 14px rgba(37,211,102,0);} 100%{box-shadow:0 0 0 0 rgba(37,211,102,0);} }
        /* ADMIN LOGIN */
        .adm-login-btn{ position:fixed; bottom:22px; left:22px; z-index:50; background:var(--charcoal2); border:1px solid var(--border); color:var(--gray); border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .adm-login-modal-bg{ position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; }
        .adm-login-modal{ background:var(--charcoal); border:1px solid var(--border); border-radius:14px; padding:32px; width:100%; max-width:360px; }
        .adm-login-modal h3{ font-size:24px; margin-bottom:6px; }
        .adm-login-modal p{ color:var(--gray); font-size:13px; margin-bottom:18px; }
        .adm-login-modal input{ width:100%; background:var(--charcoal2); border:1px solid var(--border); border-radius:8px; padding:12px 14px; color:#fff; font-size:14px; margin-bottom:10px; }
        .adm-login-err{ color:var(--red2); font-size:12.5px; margin-bottom:10px; }
        .adm-login-actions{ display:flex; gap:10px; margin-top:8px; }
        /* ADMIN PANEL */
        .adm-overlay{ position:fixed; inset:0; background:#0a0a0a; z-index:70; font-family:'Inter',sans-serif; color:#eee; }
        .adm-shell{ display:flex; height:100%; }
        .adm-sidebar{ width:250px; flex-shrink:0; background:#111; border-right:1px solid rgba(255,255,255,.08); display:flex; flex-direction:column; padding:20px 14px; overflow-y:auto; }
        .adm-logo{ display:flex; align-items:center; gap:8px; font-weight:800; font-size:13px; letter-spacing:.5px; color:var(--red2); margin-bottom:22px; padding:0 6px; }
        .adm-nav-item{ display:block; width:100%; text-align:left; background:none; border:none; color:#aaa; padding:11px 12px; border-radius:8px; font-size:13.5px; cursor:pointer; margin-bottom:3px; }
        .adm-nav-item:hover{ background:rgba(255,255,255,.05); color:#fff; }
        .adm-nav-item.active{ background:var(--red); color:#fff; font-weight:700; }
        .adm-sidebar-foot{ margin-top:auto; display:flex; flex-direction:column; gap:8px; padding-top:16px; }
        .adm-main{ flex:1; overflow-y:auto; padding:34px 40px; }
        .adm-block-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
        .adm-block-head h3{ font-family:'Inter',sans-serif; font-size:20px; font-weight:800; }
        .adm-hint{ color:#888; font-size:12.5px; margin:10px 0 18px; }
        .adm-empty{ color:#777; font-size:13.5px; display:flex; align-items:center; gap:8px; }
        .adm-btn{ display:inline-flex; align-items:center; gap:6px; border:none; border-radius:7px; padding:9px 14px; font-size:12.5px; font-weight:700; cursor:pointer; }
        .adm-btn-red{ background:var(--red); color:#fff; }
        .adm-btn-ghost{ background:rgba(255,255,255,.06); color:#ddd; }
        .adm-btn-ghost:hover{ background:rgba(255,255,255,.1); }
        .adm-form-grid{ display:grid; grid-template-columns:1fr; gap:16px; margin-top:18px; }
        @media(min-width:700px){ .adm-form-grid{ grid-template-columns:1fr 1fr; } }
        .adm-field{ display:flex; flex-direction:column; gap:6px; font-size:11.5px; color:#999; text-transform:uppercase; letter-spacing:.4px; }
        .adm-field input, .adm-field textarea{ background:#1a1a1a; border:1px solid rgba(255,255,255,.1); border-radius:7px; padding:10px 12px; color:#fff; font-size:13.5px; text-transform:none; letter-spacing:normal; font-family:'Inter',sans-serif; }
        .adm-field-textarea{ grid-column:1/-1; }
        .adm-field-checkbox{ flex-direction:row; align-items:center; gap:8px; }
        .adm-inline-trio{ display:grid; grid-template-columns:1fr 1fr 2fr; gap:10px; grid-column:1/-1; }
        .adm-card{ background:#131313; border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:18px; margin-top:16px; }
        .adm-card-hidden{ opacity:.45; }
        .adm-card-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .adm-num{ font-size:12px; color:#777; font-weight:700; }
        .adm-card-actions{ display:flex; gap:6px; }
        .adm-card-actions button{ background:rgba(255,255,255,.06); border:none; color:#ccc; width:28px; height:28px; border-radius:6px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .adm-card-actions button:hover{ background:rgba(255,255,255,.14); }
        .adm-card-actions .adm-danger:hover{ background:rgba(226,31,39,.25); color:#ff8a8a; }
        .adm-card-grid{ display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:700px){ .adm-card-grid{ grid-template-columns:1fr 1fr; } }
        .adm-preview{ margin-top:12px; height:90px; border-radius:8px; object-fit:cover; }
        .adm-preview-round{ border-radius:50%; width:90px; }
        .adm-preview-pair{ display:flex; gap:10px; margin-top:12px; }
        .adm-preview-pair img{ height:90px; border-radius:8px; object-fit:cover; flex:1; }
        .adm-hours-row{ display:grid; grid-template-columns:110px 1fr 1fr 90px; gap:14px; align-items:end; padding:14px 0; border-bottom:1px solid rgba(255,255,255,.06); }
        .adm-hours-day{ font-weight:700; font-size:13.5px; align-self:center; }
        .adm-enquiry-card{ background:#131313; border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:16px; margin-top:12px; }
        .adm-enquiry-top{ display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:8px; color:#999; }
        .adm-enquiry-top strong{ color:#fff; }
        .adm-enquiry-grid{ display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:12.5px; color:#bbb; }
        .adm-enquiry-msg{ margin-top:10px; font-size:13px; color:#ddd; font-style:italic; }
      `}</style>

      {/* NAV */}
      <header className="gg-nav">
        <div className="gg-nav-inner">
          <div className="gg-logo" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {data.brand.logoUrl && <img src={data.brand.logoUrl} alt="logo" style={{ height: 32, width: "auto" }} />}
            {gymName.split(" ")[0]} <span>{gymName.split(" ").slice(1).join(" ")}</span>
          </div>
          <nav className="gg-nav-links">
            {NAV_ITEMS.map((item) => (
              <a key={item} onClick={() => scrollTo(item.toLowerCase())}>{item}</a>
            ))}
          </nav>
          <div className="gg-nav-right">
            <a href={waHref} target="_blank" rel="noreferrer" className="gg-btn gg-btn-primary gg-btn-sm" style={{ display: "none" }} id="dummy" />
            <button className="gg-btn gg-btn-primary gg-btn-sm" onClick={() => scrollTo("membership")}>JOIN NOW</button>
            <button className="gg-hamburger" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
        {menuOpen && (
          <div className="gg-mobile-menu">
            {NAV_ITEMS.map((item) => (
              <a key={item} onClick={() => { scrollTo(item.toLowerCase()); setMenuOpen(false); }}>{item}</a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="gg-hero">
        <div className="gg-glow" style={{ width: 500, height: 500, background: "#e21f27", bottom: -100, left: -100 }} />
        <div className="gg-container gg-hero-content">
          <h1>BUILD YOUR<br /><em>STRONGEST</em> SELF.</h1>
          <p className="gg-hero-sub">{data.brand.tagline}</p>
          <div className="gg-hero-ctas">
            <button className="gg-btn gg-btn-primary" onClick={() => scrollTo("membership")}>JOIN NOW</button>
            <a className="gg-btn gg-btn-outline" href={waHref} target="_blank" rel="noreferrer"><MessageCircle size={17} /> BOOK A FREE TRIAL</a>
          </div>
          <div className="gg-hero-stats">
            <div>500+ MEMBERS</div><div>PROFESSIONAL TRAINERS</div><div>PREMIUM EQUIPMENT</div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="gg-section">
        <div className="gg-container gg-about-grid">
          <div className="gg-about-img">
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format" alt="Gym interior" />
          </div>
          <div>
            <h2 className="gg-heading">MORE THAN A GYM.<br />IT'S A <em>LIFESTYLE.</em></h2>
            <p className="gg-sub">Every rep, every rack, every rest day is built around one goal — turning intent into results. Our coaches, equipment and community exist to make sure you never train alone.</p>
            <div className="gg-stats-row">
              {data.stats.map((s) => (
                <div key={s.id}>
                  <div className="gg-stat-num"><Counter value={s.value} suffix={s.suffix} /></div>
                  <div className="gg-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="gg-section gg-section-alt">
        <div className="gg-container">
          <h2 className="gg-heading">TRAIN WITH <em>PURPOSE.</em></h2>
          <p className="gg-sub">Programs designed around your goal, not a generic template.</p>
          <div className="gg-grid-3">
            {visiblePrograms.map((p) => (
              <div key={p.id} className="gg-card">
                <div className="gg-card-img"><img src={p.image} alt={p.title} /></div>
                <div className="gg-card-body">
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                  <a className="gg-btn gg-btn-primary gg-btn-sm" href={waLink(data.brand.whatsapp, `Hi! I'd like to know more about the ${p.title} program at ${gymName}.`)} target="_blank" rel="noreferrer">ENQUIRE ON WHATSAPP</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINERS */}
      <section id="trainers" className="gg-section">
        <div className="gg-container">
          <h2 className="gg-heading">COACHED BY THE <em>BEST.</em></h2>
          <p className="gg-sub">Experienced trainers who build real programming, not guesswork.</p>
          <div className="gg-grid-3">
            {visibleTrainers.map((t) => (
              <div key={t.id} className="gg-card gg-trainer-card">
                <div className="gg-trainer-photo"><img src={t.photo} alt={t.name} /></div>
                <div className="gg-card-body">
                  <h4>{t.name}</h4>
                  <div className="gg-trainer-role">{t.role}</div>
                  <div className="gg-trainer-exp">{t.experience}</div>
                  <p>{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section id="transformations" className="gg-section gg-section-alt">
        <div className="gg-container">
          <h2 className="gg-heading" style={{ textAlign: "center", margin: "0 auto" }}>REAL PEOPLE. <em>REAL RESULTS.</em></h2>
          <p className="gg-sub" style={{ margin: "14px auto 0", textAlign: "center" }}>Drag the slider to see the difference structured training makes.</p>
          <div className="gg-grid-3">
            {visibleTransform.map((t) => (
              <div key={t.id}>
                <BeforeAfter before={t.before} after={t.after} name={t.name} />
                <div className="gg-transform-meta">
                  <h4>{t.name}</h4>
                  <div className="tags"><span className="tag">{t.goal}</span><span className="tag">{t.duration}</span></div>
                  <p>{t.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section id="membership" className="gg-section">
        <div className="gg-container">
          <h2 className="gg-heading">PICK YOUR <em>PLAN.</em></h2>
          <p className="gg-sub">Simple pricing, no hidden charges — cancel or upgrade anytime.</p>

          <div className="gg-plans-wrap">
            <button className="gg-plan-arrow left" onClick={() => document.querySelector('.gg-plans-grid').scrollBy({ left: -300, behavior: 'smooth' })}>‹</button>
            <div className="gg-plans-grid">
              {visiblePlans.map((p, i) => (
                <div key={p.id} className={"gg-plan-card" + (i === 1 && visiblePlans.length > 1 ? " featured" : "")}>
                  {p.badge && <span className="gg-plan-badge">{p.badge}</span>}
                  <div className="gg-plan-name">{p.name}</div>
                  <div className="gg-plan-price">₹{p.price}<span> / {p.duration}</span></div>
                  <ul className="gg-plan-features">
                    {(p.features || []).map((f, idx) => <li key={idx}>{f}</li>)}
                  </ul>
                  <a className="gg-btn gg-btn-primary" href={waLink(data.brand.whatsapp, `Hi! I want to join the ${p.name} plan at ${gymName}.`)} target="_blank" rel="noreferrer">JOIN NOW</a>
                </div>
              ))}
            </div>
            <button className="gg-plan-arrow right" onClick={() => document.querySelector('.gg-plans-grid').scrollBy({ left: 300, behavior: 'smooth' })}>›</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="gg-section gg-section-alt">
        <div className="gg-container">
          <h2 className="gg-heading" style={{ textAlign: "center", margin: "0 auto" }}>WHAT OUR <em>MEMBERS SAY.</em></h2>
          {visibleTesti.length > 0 && (
            <div className="gg-testi-wrap">
              <img className="gg-testi-photo" src={visibleTesti[testiIdx % visibleTesti.length].photo} alt="" />
              <p className="gg-testi-review">"{visibleTesti[testiIdx % visibleTesti.length].review}"</p>
              <div className="gg-testi-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < visibleTesti[testiIdx % visibleTesti.length].rating ? "#e21f27" : "none"} color="#e21f27" />
                ))}
              </div>
              <div className="gg-testi-name">{visibleTesti[testiIdx % visibleTesti.length].name}</div>
              <div className="gg-testi-date">{visibleTesti[testiIdx % visibleTesti.length].date}</div>
              <div className="gg-testi-dots">
                {visibleTesti.map((_, i) => <button key={i} className={i === testiIdx % visibleTesti.length ? "active" : ""} onClick={() => setTestiIdx(i)} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gg-section">
        <div className="gg-container">
          <h2 className="gg-heading" style={{ textAlign: "center", margin: "0 auto" }}>INSIDE THE <em>CLUB.</em></h2>
          <div className="gg-masonry">
            {visibleGallery.map((g) => (
              <div key={g.id} className="gg-masonry-item">
                <img src={g.url} alt={g.caption} />
                {g.caption && <div className="gg-masonry-cap">{g.caption}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT + HOURS */}
      <section id="contact" className="gg-section gg-section-alt">
        <div className="gg-container gg-info-grid">
          <div>
            <h2 className="gg-heading" style={{ textAlign: "center", margin: "0 auto" }}>GET IN <em>TOUCH.</em></h2>
            <div style={{ marginTop: 30 }}>
              <span className={"gg-status-pill " + (isOpenNow() ? "gg-status-open" : "gg-status-closed")}>
                <Clock size={13} /> {isOpenNow() ? "OPEN NOW" : "CLOSED"}
              </span>
              <div className="gg-contact-item"><MapPin size={18} /> {data.brand.address}</div>
              <div className="gg-contact-item"><Phone size={18} /> {data.brand.phone}</div>
              <div className="gg-contact-item"><Mail size={18} /> {data.brand.email}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <a className="gg-btn gg-btn-outline gg-btn-sm" href={data.brand.mapsUrl} target="_blank" rel="noreferrer">GET DIRECTIONS</a>
                <a className="gg-btn gg-btn-primary gg-btn-sm" href={waHref} target="_blank" rel="noreferrer">CHAT ON WHATSAPP</a>
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 22, marginBottom: 16 }}>GYM TIMINGS</h3>
            <div className="gg-hours-list">
              {data.hours.map((h) => (
                <div key={h.day} className="row"><span>{h.day}</span><span>{h.closed ? "Closed" : `${h.open} – ${h.close}`}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section id="enquiry" className="gg-section">
        <div className="gg-container">
          <h2 className="gg-heading" style={{ textAlign: "center", margin: "0 auto" }}>BOOK YOUR <em>FREE TRIAL.</em></h2>
          <p className="gg-sub" style={{ margin: "14px auto 0", textAlign: "center" }}>Fill this in and we'll pick it up straight on WhatsApp.</p>
          <form className="gg-form" onSubmit={submitForm}>
            <label>Full Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Phone<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Age<input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></label>
            <label>Fitness Goal
              <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                {["Weight Loss", "Muscle Gain", "Strength", "General Fitness", "Personal Training"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
            <label>Preferred Training Time
              <select value={form.time_pref} onChange={(e) => setForm({ ...form, time_pref: e.target.value })}>
                {["Morning", "Afternoon", "Evening", "Night"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
            <label>Membership
              <select value={form.membership} onChange={(e) => setForm({ ...form, membership: e.target.value })}>
                {data.plans.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="gg-form-full">Message<textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <div className="gg-form-full">
              <button type="submit" className="gg-btn gg-btn-primary">SEND ENQUIRY ON WHATSAPP</button>
              {formSent && <p className="gg-form-note">Sent! Continue the chat on WhatsApp to confirm your slot.</p>}
            </div>
          </form>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="gg-final-cta">
        <div className="gg-container">
          <h2>STOP WAITING. <span style={{ color: "#e21f27" }}>START TRANSFORMING.</span></h2>
          <p className="gg-sub" style={{ margin: "16px auto 0" }}>Your strongest version is waiting.</p>
          <div className="gg-final-cta-ctas">
            <button className="gg-btn gg-btn-primary" onClick={() => scrollTo("membership")}>JOIN NOW</button>
            <a className="gg-btn gg-btn-outline" href={waHref} target="_blank" rel="noreferrer">BOOK FREE TRIAL</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="gg-footer">
        <div className="gg-container">
          <div className="gg-footer-grid">
            <div>
              <div className="gg-logo" style={{ marginBottom: 14 }}>{gymName.split(" ")[0]} <span>{gymName.split(" ").slice(1).join(" ")}</span></div>
              <p style={{ color: "var(--gray)", fontSize: 13.5, maxWidth: 280 }}>Premium strength and conditioning, built for people serious about becoming their strongest self.</p>
              <div className="gg-socials" style={{ marginTop: 18 }}>
                <a href={data.brand.instagram} target="_blank" rel="noreferrer"><Instagram size={18} /></a>
                <a href={data.brand.facebook} target="_blank" rel="noreferrer"><Facebook size={18} /></a>
                <a href={data.brand.youtube} target="_blank" rel="noreferrer"><Youtube size={18} /></a>
              </div>
            </div>
            <div><h5>Quick Links</h5>{NAV_ITEMS.map((i) => <a key={i} onClick={() => scrollTo(i.toLowerCase())}>{i}</a>)}</div>
            <div><h5>Programs</h5>{data.programs.slice(0, 5).map((p) => <a key={p.id}>{p.title}</a>)}</div>
            <div><h5>Contact</h5><a>{data.brand.phone}</a><a>{data.brand.email}</a><a href={waHref} target="_blank" rel="noreferrer">WhatsApp Us</a></div>
          </div>
          <div className="gg-footer-bottom">
            <span>© {new Date().getFullYear()} {gymName}. All rights reserved.</span>
            <span>Content managed through the built-in Admin Dashboard.</span>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a className="gg-wa-float" href={waHref} target="_blank" rel="noreferrer"><MessageCircle size={18} /> ENQUIRE ON WHATSAPP</a>

      {/* ADMIN ENTRY */}
      <button className="adm-login-btn" title="Admin login" onClick={() => setLoginOpen(true)}><Lock size={17} /></button>

      {loginOpen && (
        <div className="adm-login-modal-bg" onClick={() => setLoginOpen(false)}>
          <div className="adm-login-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Admin Login</h3>
            <p>Enter the passcode to manage this website. (Demo passcode: admin123)</p>
            {loginErr && <div className="adm-login-err">{loginErr}</div>}
            <input type="password" placeholder="Passcode" value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryLogin()} />
            <div className="adm-login-actions">
              <button className="gg-btn gg-btn-primary gg-btn-sm" style={{ flex: 1 }} onClick={tryLogin}>Login</button>
              <button className="gg-btn gg-btn-outline gg-btn-sm" style={{ flex: 1 }} onClick={() => setLoginOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {adminOpen && (
        <AdminPanel data={data} setData={setData} onClose={() => setAdminOpen(false)} onLogout={() => setAdminOpen(false)} />
      )}
    </div>
  );
}