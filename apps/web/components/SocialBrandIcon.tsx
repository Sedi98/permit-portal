import { Globe2 } from "lucide-react";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export default function SocialBrandIcon({
  platform,
  ...props
}: IconProps & { platform: string }) {
  const normalizedPlatform = platform.toLowerCase();

  if (normalizedPlatform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.7 22v-9h3l.5-3h-3.5V8.1c0-.9.4-1.6 1.8-1.6h1.9V3.8c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.9V10H7v3h2.9v9h3.8Z" />
      </svg>
    );
  }

  if (normalizedPlatform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (normalizedPlatform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M22 12c0-2.2-.2-4.1-.5-5-.3-1-1.1-1.8-2.1-2.1C17.8 4.5 14.2 4.4 12 4.4S6.2 4.5 4.6 4.9C3.6 5.2 2.8 6 2.5 7 2.2 7.9 2 9.8 2 12s.2 4.1.5 5c.3 1 1.1 1.8 2.1 2.1 1.6.4 5.2.5 7.4.5s5.8-.1 7.4-.5c1-.3 1.8-1.1 2.1-2.1.3-.9.5-2.8.5-5Zm-12.2 4V8l6.4 4-6.4 4Z" />
      </svg>
    );
  }

  if (normalizedPlatform === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" />
        <path d="M9 8.5c.4 2.7 1.8 4.2 4.5 5.3l1.4-1.2 2 1.1c-.5 1.6-1.6 2.3-3.1 2.1-3.6-.6-6.2-3-6.8-6.5-.2-1.4.5-2.4 1.8-2.9L10 8.2 9 8.5Z" />
      </svg>
    );
  }

  if (normalizedPlatform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14 3h3c.2 1.8 1.2 3 3 3.5v3a7.6 7.6 0 0 1-3-1v7.1A5.4 5.4 0 1 1 12 10v3a2.5 2.5 0 1 0 2 2.5V3Z" />
      </svg>
    );
  }

  if (normalizedPlatform === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="m21.5 3.2-3.2 17.1c-.2 1.2-.9 1.5-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.8 14.1 1 12.6c-1-.3-1.1-1 .2-1.5L20 3.9c.9-.3 1.7.2 1.5-.7Z" />
      </svg>
    );
  }

  if (normalizedPlatform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M5.2 7.8A2.3 2.3 0 1 0 5.2 3a2.3 2.3 0 0 0 0 4.8ZM3.3 21h3.8V9H3.3v12Zm6.3 0h3.8v-6.7c0-1.8.3-3.5 2.5-3.5 2.1 0 2.2 2 2.2 3.6V21h3.8v-7.5c0-3.7-.8-6.5-5.1-6.5-2 0-3.4 1.1-4 2.1h-.1V7.4H9.6V21Z" />
      </svg>
    );
  }

  if (normalizedPlatform === "x" || normalizedPlatform === "twitter") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" {...props}>
        <path d="M5 4 19 20M19 4 5 20" />
      </svg>
    );
  }

  return <Globe2 {...props} />;
}
