import MenuLink from '@/app/components/menu/components/menu-link';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/' },
];

export default function Menu() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md menu-height sticky top-0 z-50">
      <Link href="#main" className="sr-only focus:not-sr-only">
        Skip to main content
      </Link>
      <div className="container mx-auto h-full flex flex-row justify-between">
        <div className={'flex flex-col h-full justify-center py-4'}>
          <Link className={'h-full'} href="/" aria-label="Homepage">
            <Image
              priority={true}
              src="/logo.svg"
              alt="Logo"
              width={297}
              height={74.279999}
              className={'w-auto h-full inline-block'}
            />
          </Link>
        </div>
        <nav
          className={'flex flex-col h-full justify-center'}
          aria-label="Primary Navigation"
        >
          <ul className="flex space-x-8">
            {navItems.map((item,index) => (
              <li key={`menu-item-${index}`}>
                <MenuLink href={item.href}>{item.name}</MenuLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
