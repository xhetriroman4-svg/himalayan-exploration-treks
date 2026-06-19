'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/lib/i18n';

/**
 * Client-side wrapper that provides the LanguageContext to the entire app.
 * Used in layout.tsx to wrap the {children} so all pages have access.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
