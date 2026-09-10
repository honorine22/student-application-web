import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CircuitBoard,
  Hammer,
  MapPin,
  Music2,
  Scissors,
  ShieldCheck,
  Users,
  Video,
  Smartphone,
  Wrench,
  Zap,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  formatRwf,
  PROGRAMS,
  REGISTRATION_FEE,
  TRAINING_LOCATIONS,
} from "./lib/admissions";

const icons = {
  needle: Scissors,
  circuit: CircuitBoard,
  brick: Hammer,
  car: Wrench,
  music: Music2,
  video: Video,
  phone: Smartphone,
  electricity: Zap,
  road: BookOpen,
  bike: Wrench,
} as const;

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="hero relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-etp-ink">
          <Image
            src="/images/etp-students-natural-hero.jpg"
            alt="ETP students learning practical and creative skills together"
            fill
            priority
            sizes="100vw"
            className="hero-image"
          />
          <div className="hero-overlay" />
          <div className="page-shell hero-content relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-[1180px] items-center justify-between gap-10 px-5 sm:px-6">
            <div className="hero-copy max-w-[660px] text-white">
              <h1>
                Build a skill.
                <br />
                <em>Shape your future.</em>
              </h1>
              <p>
                Practical training for ambitious learners ready to create,
                repair, build, and lead.
              </p>
              <div className="hero-actions">
                <Link href="/register" className="button button-lime">
                  Start your application <ArrowRight size={18} />
                </Link>
                <a href="#programs" className="text-link light-link">
                  Explore programs <span>↓</span>
                </a>
              </div>
              <div className="hero-trust">
                <span>
                  <Check /> Simple online application
                </span>
                <span>
                  <Check /> Manual payment review
                </span>
              </div>
            </div>
            <aside className="fee-card">
              <span>Registration fee</span>
              <strong>{formatRwf(REGISTRATION_FEE)}</strong>
              <p>
                Submit your application and payment proof online. Every payment
                is reviewed by the ETP team.
              </p>
              <Link href="/register">
                See application steps <ArrowRight size={16} />
              </Link>
            </aside>
          </div>
        </section>
        <section className="intro-strip">
          <div className="page-shell intro-grid">
            <span className="eyebrow">A place to begin</span>
            <h2>
              Learning that moves
              <br />
              with the real world.
            </h2>
            <p>
              ETP brings practical instruction and creative exploration together
              in a supportive learning environment.
            </p>
          </div>
        </section>
        <section className="program-section" id="programs">
          <div className="page-shell">
            <div className="section-head">
              <div>
                <span className="eyebrow">Find your direction</span>
                <h2>
                  Programs built around
                  <br />
                  <em>what you can do.</em>
                </h2>
              </div>
              <p>
                Choose the practical or creative path that fits your goals.
                You’ll select your preferred program during the application.
              </p>
            </div>
            <div className="program-grid">
              {PROGRAMS.map((program, index) => {
                const Icon = icons[program.icon];
                return (
                  <article
                    className={`program-card card-tone-${index % 4}`}
                    key={program.value}
                  >
                    <div className="program-number">0{index + 1}</div>
                    <Icon size={30} />
                    <h3>{program.label}</h3>
                    <Link
                      href={`/register?program=${encodeURIComponent(program.value)}`}
                    >
                      Apply for this program <ArrowRight size={16} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section className="locations-section">
          <div className="page-shell">
            <div className="section-head">
              <div>
                <span className="eyebrow">Learn near you</span>
                <h2>
                  Choose where you
                  <br />
                  <em>want to study.</em>
                </h2>
              </div>
              <p>
                Training is available across four districts. Church Music Arts
                is taught exclusively at Karama in Ruhashya Sector.
              </p>
            </div>
            <div className="location-groups">
              {["Huye", "Gisagara", "Nyamagabe", "Nyanza"].map((district) => (
                <article key={district}>
                  <h3>
                    <MapPin size={18} /> {district} District
                  </h3>
                  {TRAINING_LOCATIONS.filter(
                    (location) => location.district === district,
                  ).map((location) => (
                    <div key={location.name}>
                      <strong>{location.name}</strong>
                      <span>{location.detail}</span>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="steps-section">
          <div className="page-shell steps-layout">
            <div className="steps-copy">
              <span className="eyebrow">Clear from the start</span>
              <h2>
                Your application,
                <br />
                <em>step by step.</em>
              </h2>
              <p>
                A guided process keeps everything focused. Add your details,
                provide payment evidence, then review before you submit.
              </p>
              <Link href="/register" className="button button-dark">
                Begin now <ArrowRight size={17} />
              </Link>
            </div>
            <div className="steps-list">
              {[
                [
                  "01",
                  "Tell us about you",
                  "Personal details, education and where you live.",
                ],
                [
                  "02",
                  "Choose your program",
                  "Select the training path you want to pursue.",
                ],
                [
                  "03",
                  "Add payment proof",
                  "Enter the reference and securely upload your receipt.",
                ],
                [
                  "04",
                  "Review & submit",
                  "Check every detail before sending your application.",
                ],
              ].map(([num, title, text]) => (
                <div className="step-row" key={num}>
                  <span>{num}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <ArrowRight />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="confidence">
          <div className="page-shell confidence-grid">
            <div>
              <ShieldCheck />
              <h3>Thoughtful admissions</h3>
              <p>
                Your payment is never automatically processed or verified. An
                ETP administrator reviews your submitted information.
              </p>
            </div>
            <div>
              <Users />
              <h3>People behind the process</h3>
              <p>
                Your application is reviewed by the admissions team—not an
                anonymous payment algorithm.
              </p>
            </div>
            <div>
              <Award />
              <h3>One focused journey</h3>
              <p>
                Everything required for your application is organized in one
                clear, mobile-friendly flow.
              </p>
            </div>
          </div>
        </section>
        <section className="final-cta">
          <div className="page-shell">
            <span className="eyebrow">Your next chapter</span>
            <h2>
              Ready to turn your
              <br />
              <em>potential into practice?</em>
            </h2>
            <Link href="/register" className="button button-lime">
              Start your application <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
