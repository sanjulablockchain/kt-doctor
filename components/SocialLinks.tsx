import { socialLinks } from "@/data/social";

export function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {socialLinks.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-ivory/75 transition-colors hover:border-teal hover:bg-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
              <path d={social.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
