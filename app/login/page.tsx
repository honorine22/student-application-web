"use client";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../firebaseConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back.");
      window.location.href = "/admin";
    } catch {
      setError("The email or password is incorrect. Please try again.");
      toast.error("Sign in failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100svh-72px)] place-items-center bg-etp-surface p-4 sm:p-8">
        <div className="grid w-full max-w-[900px] items-stretch overflow-hidden rounded-3xl bg-white shadow-etp-card md:grid-cols-[1fr_0.9fr]">
          <section className="login-intro flex h-full flex-col justify-center bg-etp-ink p-8 text-white sm:p-10 lg:p-14">
            <span className="login-icon">
              <ShieldCheck />
            </span>
            <span className="eyebrow">Protected workspace</span>
            <h1>
              Manage admissions
              <br />
              <em>with confidence.</em>
            </h1>
            <p>
              Review applications, inspect payment evidence and update
              verification statuses from one focused workspace.
            </p>
            <div className="login-trust">
              <LockKeyhole />
              <span>
                <strong>Authorized staff only</strong>Your administrator
                credentials are required to continue.
              </span>
            </div>
          </section>
          <section className="login-card flex h-full flex-col justify-center p-8 sm:p-10 lg:p-14">
            <span className="eyebrow">ETP administration</span>
            <h2>Welcome back</h2>
            <p>Enter your credentials to access student applications.</p>
            <form onSubmit={handleSignIn}>
              <label className="field">
                <span>Email address</span>
                <div className="input-with-icon">
                  <Mail />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>
              <label className="field">
                <span>Password</span>
                <div className="input-with-icon">
                  <LockKeyhole />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </label>
              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="button button-lime login-submit"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in to dashboard"}
                <ArrowRight />
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
