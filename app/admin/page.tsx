"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  Receipt,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../firebaseConfig";
import { client } from "../../sanity/lib/client";
import { formatRwf, PROGRAMS, REGISTRATION_FEE } from "../lib/admissions";

type PaymentStatus = "pending" | "confirmed" | "needsReview" | "rejected";
type ApplicationStatus = "submitted" | "underReview" | "approved" | "rejected";
type Student = {
  _id: string;
  _createdAt?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  nationalIDNumber?: string;
  email?: string;
  telephoneNumber?: string;
  education?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  tradeToLearn?: string;
  trainingLocation?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  registrationFee?: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentStatus?: PaymentStatus;
  applicationStatus?: ApplicationStatus;
  createdAt?: string;
  paymentProofUrl?: string;
};
type ProgramRecord = {
  _id: string;
  title: string;
  description?: string;
  isActive: boolean;
  restrictedLocation?: string;
  sortOrder?: number;
};
const paymentStatuses: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "Pending Verification" },
  { value: "confirmed", label: "Payment Confirmed" },
  { value: "needsReview", label: "Needs Review" },
  { value: "rejected", label: "Payment Rejected" },
];
const applicationStatuses: { value: ApplicationStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "underReview", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];
const nameOf = (s: Student) =>
  s.fullName ||
  `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
  "Unnamed applicant";

export default function Admin() {
  const [authorized, setAuthorized] = useState<boolean | null>(null),
    [students, setStudents] = useState<Student[]>([]),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState(""),
    [program, setProgram] = useState(""),
    [paymentFilter, setPaymentFilter] = useState(""),
    [viewing, setViewing] = useState<Student | null>(null),
    [editing, setEditing] = useState<Student | null>(null),
    [deleting, setDeleting] = useState<Student | null>(null),
    [menu, setMenu] = useState<string | null>(null),
    [activePage, setActivePage] = useState("overview"),
    [programs, setPrograms] = useState<ProgramRecord[]>([]);
  useEffect(() => {
    const timeout = window.setTimeout(
      () => setAuthorized((current) => (current === null ? false : current)),
      6000,
    );
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        window.clearTimeout(timeout);
        setAuthorized(Boolean(user));
      },
      () => {
        window.clearTimeout(timeout);
        setAuthorized(false);
      },
    );
    return () => {
      window.clearTimeout(timeout);
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!authorized) return;
    client
      .fetch<Student[]>(
        `*[_type=="studentAdmission"]|order(coalesce(createdAt,_createdAt) desc){...,"paymentProofUrl":paymentProof.asset->url}`,
      )
      .then(setStudents)
      .catch(() => toast.error("Applications could not be loaded."))
      .finally(() => setLoading(false));
    client
      .fetch<ProgramRecord[]>(
        `*[_type=="program"]|order(sortOrder asc,title asc){_id,title,description,isActive,restrictedLocation,sortOrder}`,
      )
      .then(setPrograms)
      .catch(() => undefined);
  }, [authorized]);
  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (!program || s.tradeToLearn === program) &&
          (!paymentFilter ||
            (s.paymentStatus || "pending") === paymentFilter) &&
          `${nameOf(s)} ${s.email} ${s.nationalIDNumber}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [students, program, paymentFilter, query],
  );
  const updateField = async (
    student: Student,
    field: "paymentStatus" | "applicationStatus",
    value: string,
  ) => {
    const previous = student[field];
    setStudents((list) =>
      list.map((s) => (s._id === student._id ? { ...s, [field]: value } : s)),
    );
    try {
      const now = new Date().toISOString();
      await client
        .patch(student._id)
        .set({ [field]: value, updatedAt: now })
        .commit();
      await client.create({
        _type: "notification",
        title:
          field === "paymentStatus"
            ? "Payment status updated"
            : "Application status updated",
        message: `${nameOf(student)} is now ${value}.`,
        type: field === "paymentStatus" ? "payment" : "application",
        recipient: "admin",
        application: { _type: "reference", _ref: student._id },
        isRead: false,
        createdAt: now,
        link: "/admin",
      });
      toast.success("Status updated successfully.");
    } catch {
      setStudents((list) =>
        list.map((s) =>
          s._id === student._id ? { ...s, [field]: previous } : s,
        ),
      );
      toast.error("The status was not saved.");
    }
  };
  const saveEdit = async () => {
    if (!editing) return;
    if (
      !editing.firstName?.trim() ||
      !editing.lastName?.trim() ||
      !editing.email?.trim() ||
      !editing.telephoneNumber?.trim()
    )
      return toast.error("Name, email and phone are required.");
    try {
      const updatedAt = new Date().toISOString();
      const patch = {
        firstName: editing.firstName,
        lastName: editing.lastName,
        fullName: `${editing.firstName} ${editing.lastName}`.trim(),
        email: editing.email,
        telephoneNumber: editing.telephoneNumber,
        nationalIDNumber: editing.nationalIDNumber,
        education: editing.education,
        tradeToLearn: editing.tradeToLearn,
        trainingLocation: editing.trainingLocation,
        emergencyContactName: editing.emergencyContactName,
        emergencyContactRelationship: editing.emergencyContactRelationship,
        emergencyContactPhone: editing.emergencyContactPhone,
        updatedAt,
      };
      await client.patch(editing._id).set(patch).commit();
      setStudents((list) =>
        list.map((s) => (s._id === editing._id ? { ...s, ...patch } : s)),
      );
      setEditing(null);
      toast.success("Student record updated.");
    } catch {
      toast.error("Student record could not be saved.");
    }
  };
  const remove = async () => {
    if (!deleting) return;
    try {
      await client.delete(deleting._id);
      setStudents((list) => list.filter((s) => s._id !== deleting._id));
      setDeleting(null);
      toast.success("Application deleted.");
    } catch {
      toast.error("Application could not be deleted.");
    }
  };
  if (authorized === null)
    return (
      <div className="admin-session-state">
        <span className="session-spinner" />
        <h1>Preparing your workspace</h1>
        <p>Checking your secure administrator session…</p>
      </div>
    );
  if (!authorized)
    return (
      <div className="admin-session-state">
        <span className="brand-mark">E</span>
        <h1>Administrator access required</h1>
        <p>Your session expired or could not be verified.</p>
        <a href="/login" className="button button-lime">
          Return to sign in
        </a>
      </div>
    );
  const stats = [
    { label: "Applications", value: students.length, icon: Users },
    {
      label: "Pending payment",
      value: students.filter(
        (s) => (s.paymentStatus || "pending") === "pending",
      ).length,
      icon: Receipt,
    },
    {
      label: "Needs review",
      value: students.filter((s) => s.paymentStatus === "needsReview").length,
      icon: FileText,
    },
    {
      label: "Approved",
      value: students.filter((s) => s.applicationStatus === "approved").length,
      icon: BookOpen,
    },
  ];
  const adminProgramOptions = programs.length
    ? programs.map((p) => ({ value: p.title, label: p.title }))
    : PROGRAMS;
  return (
    <main className="dashboard min-h-screen bg-etp-surface lg:grid lg:grid-cols-[235px_1fr]">
      <aside className="dashboard-sidebar hidden h-screen flex-col border-r border-black/10 bg-white lg:sticky lg:top-0 lg:flex">
        <a href="/" className="brand dashboard-brand">
          <span className="brand-mark">E</span>
          <span>
            ETP <small>Admissions</small>
          </span>
        </a>
        <nav>
          <span>Workspace</span>
          <button
            className={`sidebar-link ${activePage === "overview" ? "active" : ""}`}
            onClick={() => {
              setActivePage("overview");
              setPaymentFilter("");
            }}
          >
            <LayoutDashboard />
            Overview
          </button>
          <button
            className={`sidebar-link ${activePage === "applications" ? "active" : ""}`}
            onClick={() => {
              setActivePage("applications");
              setPaymentFilter("");
            }}
          >
            <Users />
            Applications <b>{students.length}</b>
          </button>
          <button
            className={`sidebar-link ${activePage === "payments" ? "active" : ""}`}
            onClick={() => {
              setActivePage("payments");
              setPaymentFilter("pending");
            }}
          >
            <Receipt />
            Payment review
          </button>
          <a className="sidebar-link" href="/admin/programs">
            <BookOpen />
            Programs
          </a>
          <a className="sidebar-link" href="/admin/notifications">
            <Bell />
            Notifications
          </a>
        </nav>
        <div className="sidebar-user">
          <span>EA</span>
          <div>
            <strong>ETP Admin</strong>
            <small>Admissions team</small>
          </div>
          <button
            className="sidebar-logout"
            onClick={() =>
              signOut(auth).then(() => {
                window.location.href = "/login";
              })
            }
            aria-label="Log out"
          >
            <LogOut />
          </button>
        </div>
      </aside>
      <section className="dashboard-main min-w-0 p-4 sm:p-6 lg:p-9">
        <header className="dashboard-header flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Admissions workspace</span>
            <h1>Applications</h1>
            <p>
              Review student information and manage admissions in one place.
            </p>
          </div>
          <div className="dashboard-header-actions">
            <a className="button button-lime" href="/admin/programs">
              <Plus />
              Manage programs
            </a>
            <a href="/" className="button button-ghost">
              View public site ↗
            </a>
          </div>
        </header>
        <div className="stat-grid">
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label}>
              <Icon />
              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </article>
          ))}
        </div>
        <section className="table-card" id="applications">
          <header>
            <div>
              <h2>Student applications</h2>
              <span>{filtered.length} records</span>
            </div>
            <div className="table-filters">
              <label>
                <Search />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, ID or email"
                />
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              >
                <option value="">All programs</option>
                {adminProgramOptions.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">All payments</option>
                {paymentStatuses.map((x) => (
                  <option key={x.value} value={x.value}>
                    {x.label}
                  </option>
                ))}
              </select>
            </div>
          </header>
          <div className="table-scroll">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Program & location</th>
                  <th>Payment status</th>
                  <th>Application</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>Loading applications…</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No applications match these filters.</td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div className="table-person">
                          <span>
                            {s.firstName?.[0]}
                            {s.lastName?.[0]}
                          </span>
                          <div>
                            <strong>{nameOf(s)}</strong>
                            <small>{s.email || "No email"}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{s.tradeToLearn || "—"}</strong>
                        <small>
                          {s.trainingLocation ||
                            s.district ||
                            "Location not set"}
                        </small>
                      </td>
                      <td>
                        <select
                          className={`table-status status-${s.paymentStatus || "pending"}`}
                          value={s.paymentStatus || "pending"}
                          onChange={(e) =>
                            updateField(s, "paymentStatus", e.target.value)
                          }
                        >
                          {paymentStatuses.map((x) => (
                            <option value={x.value} key={x.value}>
                              {x.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="table-status"
                          value={s.applicationStatus || "submitted"}
                          onChange={(e) =>
                            updateField(s, "applicationStatus", e.target.value)
                          }
                        >
                          {applicationStatuses.map((x) => (
                            <option value={x.value} key={x.value}>
                              {x.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {new Date(
                          s.createdAt || s._createdAt || Date.now(),
                        ).toLocaleDateString()}
                      </td>
                      <td className="action-cell">
                        <button
                          onClick={() => setMenu(menu === s._id ? null : s._id)}
                          aria-label="Application actions"
                        >
                          <MoreHorizontal />
                        </button>
                        {menu === s._id && (
                          <div className="action-menu">
                            <button
                              onClick={() => {
                                setViewing(s);
                                setMenu(null);
                              }}
                            >
                              <Eye />
                              View details
                            </button>
                            <button
                              onClick={() => {
                                setEditing({ ...s });
                                setMenu(null);
                              }}
                            >
                              <Pencil />
                              Edit application
                            </button>
                            <button
                              className="danger"
                              onClick={() => {
                                setDeleting(s);
                                setMenu(null);
                              }}
                            >
                              <Trash2 />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
      {viewing && (
        <Modal
          title="Application details"
          close={() => setViewing(null)}
          variant="drawer"
        >
          <div className="record-heading">
            <span>
              {viewing.firstName?.[0]}
              {viewing.lastName?.[0]}
            </span>
            <div>
              <h3>{nameOf(viewing)}</h3>
              <p>{viewing.tradeToLearn}</p>
            </div>
          </div>
          <dl className="record-details">
            {[
              ["National ID", viewing.nationalIDNumber],
              ["Email", viewing.email],
              ["Applicant phone", viewing.telephoneNumber],
              ["Education", viewing.education],
              [
                "Home address",
                [
                  viewing.village,
                  viewing.cell,
                  viewing.sector,
                  viewing.district,
                  viewing.province,
                ]
                  .filter(Boolean)
                  .join(", "),
              ],
              ["Study location", viewing.trainingLocation],
              [
                "Emergency contact",
                [
                  viewing.emergencyContactName,
                  viewing.emergencyContactRelationship,
                  viewing.emergencyContactPhone,
                ]
                  .filter(Boolean)
                  .join(" · "),
              ],
              [
                "Registration fee",
                formatRwf(viewing.registrationFee || REGISTRATION_FEE),
              ],
              ["Payment method", viewing.paymentMethod],
              ["Payment reference", viewing.paymentReference],
              [
                "Payment status",
                paymentStatuses.find(
                  (x) => x.value === (viewing.paymentStatus || "pending"),
                )?.label,
              ],
              [
                "Application status",
                applicationStatuses.find(
                  (x) => x.value === (viewing.applicationStatus || "submitted"),
                )?.label,
              ],
              [
                "Submitted",
                new Date(
                  viewing.createdAt || viewing._createdAt || Date.now(),
                ).toLocaleString(),
              ],
              [
                "Payment proof",
                viewing.paymentProofUrl ? "Document attached" : "Not provided",
              ],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v || "—"}</dd>
              </div>
            ))}
          </dl>
          {viewing.paymentProofUrl && (
            <a
              className="button button-dark modal-proof"
              href={viewing.paymentProofUrl}
              target="_blank"
              rel="noreferrer"
            >
              View payment proof ↗
            </a>
          )}
        </Modal>
      )}
      {editing && (
        <Modal title="Edit application" close={() => setEditing(null)}>
          <div className="edit-grid">
            {[
              ["firstName", "First name"],
              ["lastName", "Last name"],
              ["email", "Email"],
              ["telephoneNumber", "Applicant phone"],
              ["nationalIDNumber", "National ID"],
              ["education", "Education"],
              ["trainingLocation", "Study location"],
              ["emergencyContactName", "Emergency contact name"],
              ["emergencyContactPhone", "Emergency contact phone"],
            ].map(([key, label]) => (
              <label className="field" key={key}>
                <span>{label}</span>
                <input
                  value={(editing[key as keyof Student] as string) || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, [key]: e.target.value })
                  }
                />
              </label>
            ))}
            <label className="field">
              <span>Program</span>
              <select
                value={editing.tradeToLearn || ""}
                onChange={(e) =>
                  setEditing({ ...editing, tradeToLearn: e.target.value })
                }
              >
                {adminProgramOptions.map((p) => (
                  <option value={p.value} key={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="modal-actions">
            <button
              className="button button-ghost"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <button className="button button-lime" onClick={saveEdit}>
              Save changes
            </button>
          </div>
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete application?" close={() => setDeleting(null)}>
          <div className="delete-copy">
            <Trash2 />
            <p>
              This permanently deletes <strong>{nameOf(deleting)}</strong>
              &apos;s application. This action cannot be undone.
            </p>
          </div>
          <div className="modal-actions">
            <button
              className="button button-ghost"
              onClick={() => setDeleting(null)}
            >
              Cancel
            </button>
            <button className="button button-danger" onClick={remove}>
              Delete application
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function Modal({
  title,
  close,
  children,
  variant,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
  variant?: "drawer";
}) {
  return (
    <div
      className="dashboard-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <section
        className={`dashboard-modal ${variant === "drawer" ? "dashboard-drawer" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <h2>{title}</h2>
          <button onClick={close} aria-label="Close">
            <X />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}
