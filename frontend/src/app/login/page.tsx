import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import Footer from "@/components/landing/Footer";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-ink font-manrope text-[#f4f1f1]">
      {/* ambient background glow */}
      
      {/* top hairline */}
      <div
        className="absolute left-0 right-0 top-0 z-30 h-[3px]"
        style={{
          background: "linear-gradient(90deg, #c4151b, #ef2630 50%, #f45b60)",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        
        {/* NAVBAR - ESTADO DESLOGADO */}
        <nav className="flex items-center justify-between px-6 sm:px-10 py-5">
          {/* Logo seguindo o exato design system do dashboard */}
          <Link href="/" className="text-buzz-red font-bold tracking-[0.35em] text-lg sm:text-xl">
            B U Z Z P A Y
          </Link>
          
        </nav>

        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-[420px]">
            <LoginForm />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}