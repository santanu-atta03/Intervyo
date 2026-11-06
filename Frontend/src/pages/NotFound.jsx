import React from "react";
import { ArrowLeft, ArrowRight, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/shared/SEO";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0D12] text-white">
      <SEO
        title="Page Not Found | Intervyo"
        description="The page you're looking for could not be found."
        canonical="/404"
      />

      <style>{`
        @font-face {
          font-family: "FK Screamer";
          src: url("https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/4b73ec13-fkscreamer.woff2") format("woff2");
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }

        .not-found-heading {
          font-family: "FK Screamer", Impact, sans-serif;
          letter-spacing: -0.035em;
        }

        .not-found-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 4rem 4rem;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
        }

        @keyframes floatOrb {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -16px, 0);
          }
        }

        @keyframes pulseRing {
          0%, 100% {
            opacity: .35;
            transform: scale(.96);
          }
          50% {
            opacity: .75;
            transform: scale(1.04);
          }
        }

        @keyframes scanLine {
          0% {
            transform: translateY(-120%);
          }
          100% {
            transform: translateY(120%);
          }
        }

        .not-found-orb {
          animation: floatOrb 7s ease-in-out infinite;
        }

        .not-found-ring {
          animation: pulseRing 5s ease-in-out infinite;
        }

        .not-found-scan {
          animation: scanLine 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(195,219,255,0.14),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(209,244,140,0.07),transparent_28%),linear-gradient(180deg,#0E121A_0%,#0A0D12_100%)]" />

      <div className="not-found-grid pointer-events-none absolute inset-0" />

      <div className="not-found-orb pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#C3DBFF]/10 blur-[100px]" />
      <div className="not-found-orb pointer-events-none absolute -left-32 bottom-10 h-72 w-72 rounded-full bg-[#FFB8FC]/[0.07] blur-[100px]" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="rounded-full bg-white px-5 py-2.5 text-[#171717] shadow-lg shadow-black/25 transition hover:bg-[#D1F48C]"
        >
          <span className="not-found-heading text-[30px] font-extrabold leading-none">
            Intervyo
          </span>
        </Link>

        <Link
          to="/"
          className="group flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back to home
        </Link>
      </nav>

      {/* Main */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1440px] items-center px-5 pb-12 sm:px-8 lg:px-12">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#D1F48C] shadow-[0_0_14px_#D1F48C]" />
              Navigation error
            </div>

            <h1 className="not-found-heading text-[105px] font-bold uppercase leading-[0.76] text-white sm:text-[145px] lg:text-[175px]">
              Oops.
            </h1>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-zinc-400">
              This page took a wrong turn. Let&apos;s get you back to your
              interview preparation workspace.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/"
                className="group flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#0A0D12] transition hover:bg-[#D1F48C] hover:shadow-[0_12px_30px_rgba(209,244,140,0.16)]"
              >
                <Home className="h-4 w-4" />
                Go to homepage
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/interview-setup"
                className="flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.1]"
              >
                Start practicing
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-3 text-xs text-zinc-600">
              <span className="not-found-heading text-3xl text-[#C3DBFF]">
                404
              </span>
              <span className="h-px w-12 bg-white/15" />
              <span>Page not found</span>
            </div>
          </div>

          {/* CSS-built visual */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative aspect-square w-full max-w-[620px]">
              {/* Outer rings */}
              <div className="not-found-ring absolute inset-[4%] rounded-full border border-[#C3DBFF]/20" />
              <div className="not-found-ring absolute inset-[12%] rounded-full border border-[#D1F48C]/20 [animation-delay:1s]" />
              <div className="absolute inset-[21%] rounded-full border border-white/10" />

              {/* Orbital marks */}
              <span className="absolute left-[8%] top-[39%] h-3 w-3 rounded-full bg-[#D1F48C] shadow-[0_0_18px_#D1F48C]" />
              <span className="absolute right-[13%] top-[19%] h-2 w-2 rounded-full bg-[#FFB8FC] shadow-[0_0_15px_#FFB8FC]" />
              <span className="absolute bottom-[18%] right-[22%] h-2.5 w-2.5 rounded-full bg-[#C3DBFF] shadow-[0_0_16px_#C3DBFF]" />

              {/* Main panel */}
              <div className="absolute inset-[17%] overflow-hidden rounded-[24px] border border-white/15 bg-[#11161F] shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(195,219,255,0.16),transparent_35%),linear-gradient(145deg,#161E2B,#0C1017)]" />

                {/* Scan effect */}
                <div className="not-found-scan absolute left-0 right-0 top-0 h-20 bg-gradient-to-b from-transparent via-[#D1F48C]/10 to-transparent" />

                <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[16px] border border-[#C3DBFF]/25 bg-[#C3DBFF]/10 text-[#C3DBFF]">
                    <Search className="h-7 w-7" />
                  </div>

                  <div className="not-found-heading text-[94px] font-bold leading-[0.78] text-white sm:text-[120px]">
                    404
                  </div>

                  <div className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#D1F48C] to-transparent" />

                  <p className="mt-5 max-w-[210px] text-sm leading-relaxed text-zinc-400">
                    The route you&apos;re looking for doesn&apos;t exist.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#D1F48C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D1F48C] shadow-[0_0_10px_#D1F48C]" />
                    System ready
                  </div>
                </div>
              </div>

              {/* Corner label */}
              <div className="absolute bottom-[5%] left-[12%] rounded-[10px] border border-white/10 bg-[#11161F]/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-[#FFB8FC]" />
                  The path continues
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
