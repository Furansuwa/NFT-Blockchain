"use client";

import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { client } from "../utils/client";
import AIMinter from "../components/AIMinter"; // <--- Importamos el generador
import NFTGallery from "../components/NFTGallery"; // <--- Mantenemos la galería para ver el resultado

export default function Home() {
  return (
    <ThirdwebProvider>
      <main style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <h1>🎨 AI NFT Creator</h1>
          <ConnectButton client={client} />
        </header>

        {/* SECCIÓN 1: Crear */}
        <section>
          <h3>Paso 1: Crea tu Arte</h3>
          <AIMinter />
        </section>

        <hr style={{ margin: "40px 0" }} />

        {/* SECCIÓN 2: Ver */}
        <section>
          <h3>Paso 2: Tu Colección</h3>
          <NFTGallery />
        </section>

      </main>
    </ThirdwebProvider>
  );
}