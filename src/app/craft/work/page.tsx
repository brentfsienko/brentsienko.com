import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craft — Work",
};

export default function WorkPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">work</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Links, resume, and ways to get in touch.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a href="/BrentSienkoResume.pdf" className="btn btn-solid" download>
          download resume
        </a>
        <a
          href="https://github.com/brentfsienko"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          github
        </a>
        <a
          href="https://linkedin.com/in/brent-sienko"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          linkedin
        </a>
        <a href="mailto:brent5@berkeley.edu" className="btn">
          email
        </a>
      </div>
    </div>
  );
}
