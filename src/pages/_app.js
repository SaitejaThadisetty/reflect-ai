import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner'; // Updated import

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

function MyApp({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} font-sans`}>
      {/* The background divs remain the same */}
      <div className="fixed top-0 left-0 h-full w-full bg-zinc-950"></div>
      <div className="fixed top-0 left-0 h-full w-full bg-grid-white/[0.05]"></div>
      <div className="fixed top-0 left-0 pointer-events-none h-full w-full flex items-center justify-center bg-zinc-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="relative z-10">
        <Component {...pageProps} />
      </div>

      {/* Use the Toaster from sonner, with theme and style props */}
      <Toaster theme="dark" richColors position="bottom-right" />
    </main>
  );
}

export default MyApp;