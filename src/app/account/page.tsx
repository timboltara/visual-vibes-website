"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMapPin, FiPackage, FiLogOut, FiEdit2, FiCheck } from "react-icons/fi";
import { useAuth, SavedAddress } from "@/context/AuthContext";

/* ── Auth Gate (Login / Signup) ─────────────────────────────────────────── */
export default function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="pt-[129px] min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-vv-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-[129px] min-h-screen bg-white">
      {user ? <ProfileView /> : <AuthView />}
    </div>
  );
}

/* ── Login / Signup ─────────────────────────────────────────────────────── */
function AuthView() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <div className="max-w-md mx-auto px-5 py-12">
      {/* Heading */}
      <div className="text-center mb-8">
        <p className="font-heading text-[10px] uppercase tracking-widest2 text-vv-gray-mid mb-2">
          Visual Vibes
        </p>
        <h1 className="font-heading font-black text-3xl uppercase text-vv-black">
          {tab === "login" ? "Welcome Back" : "Create Account"}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {(["login", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 font-heading text-xs uppercase tracking-widest py-3 border-b-2 transition-colors ${
              tab === t
                ? "border-vv-black text-vv-black"
                : "border-transparent text-vv-gray-mid hover:text-vv-black"
            }`}
          >
            {t === "login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <motion.div key="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <LoginForm onSwitch={() => setTab("signup")} />
          </motion.div>
        ) : (
          <motion.div key="signup" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SignupForm onSwitch={() => setTab("login")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = login(email, password);
    if (err) setError(err);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="font-body text-xs text-vv-orange bg-orange-50 px-4 py-3">{error}</p>
      )}
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors"
      />
      <button
        type="submit"
        className="w-full font-heading text-sm font-bold uppercase tracking-widest2 py-4 bg-vv-black text-white hover:bg-vv-teal transition-colors"
      >
        Sign In
      </button>
      <p className="font-body text-xs text-center text-vv-gray-mid">
        No account?{" "}
        <button type="button" onClick={onSwitch} className="text-vv-black underline hover:text-vv-teal transition-colors">
          Create one
        </button>
      </p>
    </form>
  );
}

function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const err = signup({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName });
    if (err) setError(err);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="font-body text-xs text-vv-orange bg-orange-50 px-4 py-3">{error}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <input type="text" placeholder="First name" value={form.firstName} onChange={set("firstName")} required
          className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
        <input type="text" placeholder="Last name" value={form.lastName} onChange={set("lastName")} required
          className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
      </div>
      <input type="email" placeholder="Email address" value={form.email} onChange={set("email")} required
        className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
      <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={set("password")} required
        className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
      <input type="password" placeholder="Confirm password" value={form.confirm} onChange={set("confirm")} required
        className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
      <button type="submit"
        className="w-full font-heading text-sm font-bold uppercase tracking-widest2 py-4 bg-vv-black text-white hover:bg-vv-teal transition-colors">
        Create Account
      </button>
      <p className="font-body text-xs text-center text-vv-gray-mid">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-vv-black underline hover:text-vv-teal transition-colors">
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ── Profile (logged in) ────────────────────────────────────────────────── */
type ProfileTab = "profile" | "address" | "orders";

function ProfileView() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<ProfileTab>("profile");

  if (!user) return null;

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <FiUser size={14} /> },
    { id: "address", label: "Addresses", icon: <FiMapPin size={14} /> },
    { id: "orders", label: "Orders", icon: <FiPackage size={14} /> },
  ];

  return (
    <div className="max-w-screen-md mx-auto px-5 sm:px-10 py-10">
      {/* Welcome header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-widest2 text-vv-gray-mid mb-1">
            My Account
          </p>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase text-vv-black leading-none">
            Hey, {user.firstName} 👋
          </h1>
          <p className="font-body text-xs text-vv-gray-mid mt-1">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors border border-gray-200 px-4 py-2.5 hover:border-vv-black"
        >
          <FiLogOut size={13} /> Sign Out
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-8 gap-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 font-heading text-xs uppercase tracking-widest px-5 py-3 border-b-2 transition-colors ${
              tab === t.id
                ? "border-vv-black text-vv-black"
                : "border-transparent text-vv-gray-mid hover:text-vv-black"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "profile" && <ProfileTab />}
          {tab === "address" && <AddressTab />}
          {tab === "orders" && <OrdersTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Profile Tab ────────────────────────────────────────────────────────── */
function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
  });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold">
          Personal Information
        </p>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors"
          >
            <FiEdit2 size={11} /> Edit
          </button>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-vv-teal/10 px-4 py-3">
          <FiCheck size={13} className="text-vv-teal" />
          <p className="font-body text-xs text-vv-teal">Changes saved successfully.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" value={form.firstName} editing={editing} onChange={set("firstName")} />
        <Field label="Last Name" value={form.lastName} editing={editing} onChange={set("lastName")} />
        <Field label="Email" value={user?.email ?? ""} editing={false} onChange={() => {}} />
        <Field label="Phone" value={form.phone} editing={editing} onChange={set("phone")} placeholder="(555) 000-0000" />
      </div>

      {editing && (
        <div className="flex gap-3">
          <button onClick={handleSave}
            className="font-heading text-xs font-bold uppercase tracking-widest px-6 py-3 bg-vv-black text-white hover:bg-vv-teal transition-colors">
            Save Changes
          </button>
          <button onClick={() => { setEditing(false); setForm({ firstName: user?.firstName ?? "", lastName: user?.lastName ?? "", phone: user?.phone ?? "" }); }}
            className="font-heading text-xs uppercase tracking-widest px-6 py-3 border border-gray-200 text-vv-gray-mid hover:border-vv-black hover:text-vv-black transition-colors">
            Cancel
          </button>
        </div>
      )}

      <div className="border-t border-gray-100 pt-5">
        <p className="font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid">
          Member since {new Date(user?.createdAt ?? "").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, editing, onChange, placeholder }: {
  label: string; value: string; editing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="font-heading text-[9px] uppercase tracking-widest text-vv-gray-mid block mb-1.5">{label}</label>
      {editing ? (
        <input type="text" value={value} onChange={onChange} placeholder={placeholder}
          className="w-full border border-gray-300 px-4 py-2.5 font-body text-sm text-vv-black focus:outline-none focus:border-vv-black transition-colors" />
      ) : (
        <p className="font-body text-sm text-vv-black border-b border-gray-100 pb-2">
          {value || <span className="text-gray-300">—</span>}
        </p>
      )}
    </div>
  );
}

/* ── Address Tab ────────────────────────────────────────────────────────── */
function AddressTab() {
  const { user, updateAddress } = useAuth();
  const [editing, setEditing] = useState(!user?.address);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<SavedAddress>(
    user?.address ?? { firstName: user?.firstName ?? "", lastName: user?.lastName ?? "", address: "", apt: "", city: "", state: "", zip: "" }
  );

  const set = (k: keyof SavedAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    updateAddress(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold">
          Saved Address
        </p>
        {!editing && user?.address && (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 font-heading text-[10px] uppercase tracking-widest text-vv-gray-mid hover:text-vv-black transition-colors">
            <FiEdit2 size={11} /> Edit
          </button>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-vv-teal/10 px-4 py-3">
          <FiCheck size={13} className="text-vv-teal" />
          <p className="font-body text-xs text-vv-teal">Address saved.</p>
        </div>
      )}

      {!editing && user?.address ? (
        <div className="border border-gray-200 p-5">
          <p className="font-heading text-xs uppercase tracking-widest text-vv-black font-semibold mb-1">
            {user.address.firstName} {user.address.lastName}
          </p>
          <p className="font-body text-sm text-vv-gray-mid leading-relaxed">
            {user.address.address}{user.address.apt && `, ${user.address.apt}`}<br />
            {user.address.city}, {user.address.state} {user.address.zip}<br />
            United States
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="First name" value={form.firstName} onChange={set("firstName")}
              className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
            <input type="text" placeholder="Last name" value={form.lastName} onChange={set("lastName")}
              className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
          </div>
          <input type="text" placeholder="Address" value={form.address} onChange={set("address")}
            className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
          <input type="text" placeholder="Apt, suite, etc. (optional)" value={form.apt} onChange={set("apt")}
            className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
          <div className="grid grid-cols-[1fr_auto_auto] gap-3">
            <input type="text" placeholder="City" value={form.city} onChange={set("city")}
              className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors" />
            <select value={form.state} onChange={set("state")}
              className="border border-gray-300 px-3 py-3 font-body text-sm focus:outline-none focus:border-vv-black bg-white w-20 transition-colors">
              <option value="">State</option>
              {US_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <input type="text" placeholder="ZIP" value={form.zip} onChange={set("zip")} maxLength={5}
              className="border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-vv-black transition-colors w-24" />
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={handleSave}
              className="font-heading text-xs font-bold uppercase tracking-widest px-6 py-3 bg-vv-black text-white hover:bg-vv-teal transition-colors">
              Save Address
            </button>
            {user?.address && (
              <button onClick={() => setEditing(false)}
                className="font-heading text-xs uppercase tracking-widest px-6 py-3 border border-gray-200 text-vv-gray-mid hover:border-vv-black hover:text-vv-black transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Orders Tab ─────────────────────────────────────────────────────────── */
function OrdersTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <FiPackage size={40} className="text-gray-200" />
      <p className="font-heading text-sm uppercase tracking-widest text-vv-gray-mid">
        No orders yet
      </p>
      <p className="font-body text-xs text-vv-gray-mid max-w-xs">
        Once you place an order your history will appear here.
      </p>
      <Link
        href="/shop"
        className="mt-2 font-heading text-xs font-bold uppercase tracking-widest px-8 py-3 bg-vv-black text-white hover:bg-vv-teal transition-colors"
      >
        Shop Now
      </Link>
    </div>
  );
}
