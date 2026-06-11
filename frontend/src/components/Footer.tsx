import { Mail } from "lucide-react";

const Sparkle = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className}>
    <path
      d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
      fill="currentColor"
    />
  </svg>
);

const GithubIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedinIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const socialLinks = [
  {
    Icon: GithubIcon,
    href: "https://github.com/ede-ch",
    label: "GitHub",
  },
  {
    Icon: LinkedinIcon,
    href: "https://www.linkedin.com/in/ede-chaves/",
    label: "LinkedIn",
  },
  {
    Icon: Mail,
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=edechvs@gmail.com",
    label: "Email",
  },
];

export default function Footer() {
  return (
    <footer className="relative mx-auto max-w-[1280px] px-4 pb-[40px] pt-[40px]">
      {/* decorative sparkle */}
      <div className="flex justify-center">
        <Sparkle className="h-[40px] w-[40px] text-[#f4f1f1] animate-twinkle" />
      </div>

      {/* social icons */}
      <div className="mt-[30px] flex items-center justify-center gap-[24px]">
        {socialLinks.map(({ Icon, href, label }, index) => (
          <div key={label} className="flex items-center gap-[24px]">
            {index > 0 && (
              <span className="h-[4px] w-[4px] rounded-full bg-[#4d4d4d]" />
            )}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-buzz-red/30 bg-buzz-red/10 text-[#f4f1f1] shadow-[0_0_20px_rgba(198,4,2,0.35)] transition-all duration-300 hover:scale-105 hover:bg-buzz-red hover:text-white"
            >
              <Icon size={20} />
            </a>
          </div>
        ))}
      </div>


      {/* bottom row */}
      <div className="mt-[24px] flex flex-col items-center justify-between gap-3 text-[13px] text-muted-dark sm:flex-row">
        <span>&copy; {new Date().getFullYear()} BuzzPay</span>
        <span className="flex items-center gap-[8px]">
          <Sparkle className="h-[10px] w-[10px] text-buzz-red" />
          Designed &amp; Developed by{" "}
          <a
            href="https://www.linkedin.com/in/ede-chaves/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#f0eded] transition-colors hover:text-buzz-red"
          >
            Edelin Chaves
          </a>
        </span>
      </div>
    </footer>
  );
}
