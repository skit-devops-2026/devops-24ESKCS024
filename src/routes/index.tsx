import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Camera,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import heroImage from "@/assets/hostel-hero.jpg";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/complaints";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HostelFix — Hostel Complaint Management System" },
      {
        name: "description",
        content:
          "Report hostel maintenance issues with photos, track status in real time and let wardens resolve them from one analytics dashboard.",
      },
      { property: "og:title", content: "HostelFix — Hostel Complaint Management System" },
      {
        property: "og:description",
        content:
          "Raise, track and resolve hostel complaints — electrical, plumbing, internet and more — in one modern dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Camera,
    title: "Photo-backed reports",
    body: "Snap the broken fan or leaking tap. Evidence goes straight to the warden with your room details.",
  },
  {
    icon: Timer,
    title: "Live status tracking",
    body: "Pending, in progress, resolved or rejected — students always know exactly where things stand.",
  },
  {
    icon: BarChart3,
    title: "Analytics dashboard",
    body: "Admins see category trends, monthly volume and resolution rates at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    body: "Students only ever see their own complaints. Admins manage everything, securely.",
  },
];

const STEPS = [
  { n: "01", title: "Create your account", body: "Register with your room number and hostel block." },
  { n: "02", title: "Raise a complaint", body: "Pick a category, describe the issue and attach a photo." },
  { n: "03", title: "Track to resolution", body: "Follow status updates and admin remarks until it's fixed." },
];

function Landing() {
  const { user } = useAuth();

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="aurora" aria-hidden />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" /> Built for campus living
            </span>
            <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Hostel complaints,
              <br />
              <span className="gradient-text">solved without paperwork.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              HostelFix gives residents a one-tap way to report electrical, plumbing, internet and
              cleanliness issues — and gives wardens the dashboard to clear them fast.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={user ? "/dashboard" : "/auth"}>
                  {user ? "Go to dashboard" : "Get started free"} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={user ? "/complaints" : "/auth"}>
                  <ClipboardCheck className="size-4" /> Track a complaint
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["7", "Categories"],
                ["24h", "Avg. response"],
                ["100%", "Tracked"],
              ].map(([v, l]) => (
                <div key={l} className="glass rounded-2xl px-4 py-3">
                  <dt className="font-display text-2xl font-bold">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <img
              src={heroImage}
              alt="Illustration of a modern hostel building with maintenance request cards"
              className="w-full rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Everything a hostel desk needs
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Designed with students and wardens together, so nothing gets lost in a register book.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="glass rounded-3xl p-8 sm:p-12">
          <h2 className="font-display text-3xl font-bold tracking-tight">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <span className="font-display text-4xl font-black text-primary/25">{s.n}</span>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">Categories covered</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <span
              key={c.value}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <c.icon className="size-4 text-primary" />
              {c.label}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent px-8 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ready to stop chasing the warden?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Create your HostelFix account and raise your first complaint in under a minute.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link to={user ? "/complaints/new" : "/auth"}>
              {user ? "Raise a complaint" : "Create free account"} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
