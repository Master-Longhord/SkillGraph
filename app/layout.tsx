import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SkillGraph - Developer & Technology Relationship Explorer',
  description: 'Explore developers, skills, projects, technologies, companies, and domains powered by CognoDB graph traversals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fbf9f5] text-[#171717] antialiased selection:bg-red-600 selection:text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-[#e7e2d9] bg-[#f7f4ee] py-6 text-xs text-[#57534e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-medium text-[#171717]">SkillGraph &copy; {new Date().getFullYear()} Wexa AI Take-Home Assignment</span>
            <span className="font-mono text-[#57534e]">Powered by CognoDB &bull; openCypher &bull; Next.js</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
