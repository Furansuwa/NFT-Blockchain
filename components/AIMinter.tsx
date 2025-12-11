"use client";

import { useState } from "react";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains"; // <--- MANTENEMOS SEPOLIA
import { mintTo } from "thirdweb/extensions/erc721";
import { client } from "../utils/client";

// Asegúrate que este contrato esté desplegado en Sepolia
const CONTRACT_ADDRESS = "0x5655DC2A44A6Ad652cea6a250e454a6Ce023660c"; 

const contract = getContract({
  client,
  chain: sepolia, 
  address: CONTRACT_ADDRESS,
});

export default function AIMinter() {
  const account = useActiveAccount(); 
  const [prompt, setPrompt] = useState("");
  const [generatedFile, setGeneratedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // URL para vista previa
  const previewUrl = prompt 
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
    : "";

  // Truco: Descargar la imagen de Pollinations y convertirla en archivo
  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        setGeneratedFile(file); // Guardamos el archivo listo para el NFT
    } catch (err) {
        console.error("Error preparando imagen:", err);
    }
    setIsGenerating(false);
  };

  return (
    <div style={{ border: "1px solid #333", padding: "20px", borderRadius: "10px", maxWidth: "500px", backgroundColor: "#111" }}>
      <h2 style={{ color: "white", marginBottom: "15px" }}>🤖 Generador NFT (Sepolia)</h2>
      
      <div style={{ margin: "20px 0" }}>
        <label style={{ color: "#ccc" }}>Describe tu imagen:</label>
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setGeneratedFile(null); 
          }}
          onBlur={handleGenerate} // Se prepara la imagen al salir del input
          placeholder="Ej: Un gato cyberpunk"
          style={{ width: "100%", padding: "10px", marginTop: "8px", color: "black", backgroundColor: "white", borderRadius: "5px" }}
        />
      </div>

      {previewUrl && prompt.length > 3 && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img 
            src={previewUrl} 
            alt="Vista previa" 
            style={{ width: "100%", borderRadius: "8px", opacity: isGenerating ? 0.5 : 1 }} 
          />
          {isGenerating && <p style={{color: "yellow", fontSize: "0.8em"}}>Procesando imagen para blockchain...</p>}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <TransactionButton
          transaction={() => {
            if (!account) throw new Error("¡Conecta tu wallet!");
            if (!generatedFile) throw new Error("Espera a que se cargue la imagen");
            
            return mintTo({
              contract,
              to: account.address,
              nft: {
                name: prompt,
                image: generatedFile, // Subimos el archivo real a IPFS
                description: "Generado con Pollinations AI en Sepolia",
              },
            });
          }}
          onTransactionConfirmed={() => {
            alert("✅ ¡Éxito! NFT acuñado en Sepolia.");
            setPrompt("");
            setGeneratedFile(null);
          }}
        >
          Crear NFT en Sepolia
        </TransactionButton>
      </div>
    </div>
  );
}