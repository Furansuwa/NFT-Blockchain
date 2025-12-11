"use client";

import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { client } from "../utils/client";
import AIMinter from "../components/AIMinter";
import NFTGallery from "../components/NFTGallery";

export default function Home() {
  return (
    <ThirdwebProvider>
      <main className="min-h-screen p-8 relative overflow-hidden">
        
        {/* Efectos de fondo ambiental */}
        <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 max-w-6xl mx-auto relative z-10 glass-card p-6 rounded-2xl">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
              NEXUS ART AI
            </h1>
            <p className="text-gray-400 text-xs tracking-widest mt-1">BLOCKCHAIN GENERATIVE INTERFACE</p>
          </div>
          <ConnectButton 
            client={client} 
            theme="dark"
            connectButton={{
                label: "CONECTAR WALLET",
                style: {
                    background: "linear-gradient(90deg, #bc13fe, #00f3ff)",
                    color: "black",
                    fontWeight: "bold",
                    border: "none"
                }
            }}
          />
        </header>

        <div className="max-w-6xl mx-auto relative z-10">
            <section className="mb-20">
                <AIMinter />
            </section>

            <section>
                <NFTGallery />
            </section>
        </div>
        
        <footer className="text-center text-gray-600 text-xs mt-20 pb-10">
            SYSTEM STATUS: ONLINE | SEPOLIA NETWORK
        </footer>

      </main>
    </ThirdwebProvider>
  );
}