import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Archivo, Archivo_Black, IBM_Plex_Mono } from 'next/font/google';
import type { Metadata } from 'next';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
});

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Weibo — stream processing engine for Go',
    template: '%s | Weibo',
  },
  description:
    'Weibo is an embeddable stream processing engine for Go: keyed state, event-time windows, barrier checkpointing, durable Pebble state, and end-to-end exactly-once Kafka pipelines — one process, no cluster. Build with the Go SDK or declarative YAML workflows.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${archivo.className} ${archivo.variable} ${archivoBlack.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
