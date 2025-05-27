import './fonts.css';
import './global.css';
import Menu from '@/app/components/menu/menu';

export const metadata = {
  title: 'Formula 1',
  description: 'Fomula 1 website showing world champions and season results',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={'bg-background'}>
        <Menu />
        <main id="main">
          {children}
        </main>
        <footer className={'text-center p-4 bg-content-foreground text-content text-lg font-bold'}>
          Create by Ian van Zyl
        </footer>
      </body>
    </html>
  );
}
