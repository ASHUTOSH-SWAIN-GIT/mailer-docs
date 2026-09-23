import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Geist, Geist_Mono } from 'next/font/google';
import { baseOptions } from '@/lib/layout.shared';

// Loaded here, not in the root layout, so documentation pages do not pay for them.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

function Brand() {
  return (
    <span className="lp-brand">
      {/* The mark is white on transparent; the stylesheet inverts it on light backgrounds. */}
      <img className="lp-brand-mark" src="/weibo-mark.png" alt="" width={27} height={18} />
      <span>Weibo</span>
    </span>
  );
}

export default function Layout({ children }: LayoutProps<'/'>) {
  const base = baseOptions();
  return (
    <div className={`lp-fonts ${geist.variable} ${geistMono.variable}`} style={{ display: 'contents' }}>
      <HomeLayout
        {...base}
        nav={{ ...base.nav, title: <Brand /> }}
        links={[
          { text: 'Docs', url: '/docs' },
          { text: 'Examples', url: '/docs/examples' },
          {
            text: 'Benchmarks',
            url: 'https://github.com/ASHUTOSH-SWAIN-GIT/weibo/blob/main/docs/benchmarks.md',
            external: true,
          },
        ]}
      >
        {children}
      </HomeLayout>
    </div>
  );
}
