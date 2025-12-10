"use client";

import { useState } from "react";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { mintTo } from "thirdweb/extensions/erc721";
import { client } from "../utils/client";

const CONTRACT_ADDRESS = "0x5655DC2A44A6Ad652cea6a250e454a6Ce023660c"; 

const contract = getContract({
  client,
  chain: sepolia, // Asegúrate que coincida con la red donde desplegaste (Sepolia o Base Sepolia)
  address: CONTRACT_ADDRESS,
});

export default function AIMinter() {
  const account = useActiveAccount(); 
  const [prompt, setPrompt] = useState("");
  
  // URL mágica de Pollinations (Gratis y sin API Key)
  const imageUrl = prompt 
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
    : "";

  return (
    <div style={{ border: "1px solid #333", padding: "20px", borderRadius: "10px", maxWidth: "500px", backgroundColor: "#111" }}>
      <h2 style={{ color: "white", marginBottom: "15px" }}>🤖 Generador de NFT con IA</h2>
      
      {/* 1. Input para el Prompt */}
      <div style={{ margin: "20px 0" }}>
        <label style={{ color: "#ccc" }}>Describe tu imagen:</label>
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Un gato cyberpunk comiendo pizza"
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginTop: "8px", 
            color: "black",          // Texto negro
            backgroundColor: "white", // Fondo blanco (SOLUCIÓN AL ERROR VISUAL)
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />
      </div>

      {/* 2. Previsualización */}
      {imageUrl && prompt.length > 3 && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "0.9em" }}>Vista previa:</p>
          <img 
            src={imageUrl} 
            alt="AI Preview" 
            style={{ width: "100%", borderRadius: "8px", marginTop: "5px" }} 
          />
        </div>
      )}

      {/* 3. Botón para Mintar */}
      <div style={{ marginTop: "20px" }}>
        <TransactionButton
          transaction={() => {
            if (!account) throw new Error("¡Conecta tu wallet primero!");
            if (!prompt) throw new Error("Escribe una descripción primero");
            
            // Función para crear el NFT en la blockchain
            return mintTo({
              contract,
              to: account.address, // Se envía a tu propia billetera
              nft: {
                name: prompt,
                image: imageUrl, // Guarda la URL de la IA en el NFT
                description: "Generado por IA para Proyecto Estudiantil",
              },
            });
          }}
          onTransactionConfirmed={() => {
            alert("✅ ¡Éxito! NFT creado. Espera unos segundos a que aparezca en la galería.");
            setPrompt(""); // Limpiar
          }}
          onError={(error) => {
            console.error("Error detallado:", error);
            alert("❌ Error. Abre la consola (F12) para ver detalles. \n\nPosible causa: ¿Estás usando la misma Wallet que creó el contrato?");
          }}
        >
          Crear NFT Gratis
        </TransactionButton>
      </div>
    </div>
  );
}