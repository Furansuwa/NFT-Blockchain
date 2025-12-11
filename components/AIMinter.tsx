"use client";

import { useState } from "react";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains"; 
import { mintTo } from "thirdweb/extensions/erc721";
import { client } from "../utils/client";

// ✅ TU CONTRATO NUEVO (Actualizado)
const CONTRACT_ADDRESS = "0x5e417b92B94d72FF1893E53026884f788f7AE052"; 

const contract = getContract({
  client,
  chain: sepolia, 
  address: CONTRACT_ADDRESS,
});

export default function AIMinter() {
  const account = useActiveAccount(); 
  const [prompt, setPrompt] = useState("");
  const [generatedFile, setGeneratedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Paso 1: Generar la imagen y convertirla a un archivo real
  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedFile(null); // Limpiamos el anterior para evitar errores
    
    try {
        // Usamos Pollinations para la IA
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
        setPreviewUrl(url); // Mostramos la preview visualmente

        // Descargamos la imagen para convertirla en un archivo que la Blockchain entienda
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "nft-image.jpg", { type: "image/jpeg" });
        setGeneratedFile(file); // ¡Listo! Archivo preparado
    } catch (err) {
        console.error("Error generando imagen:", err);
        alert("Hubo un error al conectar con la IA. Intenta de nuevo.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="glass-card p-8 rounded-2xl w-full max-w-lg mx-auto transition-all duration-500 hover:shadow-[0_0_30px_rgba(188,19,254,0.3)]">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
        ⚡ Generador Neural
      </h2>
      
      {/* INPUT DEL PROMPT */}
      <div className="mb-6 group">
        <label className="block text-cyan-300 text-sm mb-2 font-mono tracking-widest">
          PROMPT DE COMANDO
        </label>
        <div className="relative">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Cyberpunk samurai cat in neon city..."
            className="w-full bg-black/50 border border-purple-500/30 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
          />
        </div>
      </div>

      {/* BOTÓN 1: GENERAR IMAGEN */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt}
        className={`w-full py-3 rounded-lg font-bold tracking-widest mb-6 transition-all ${
          isGenerating ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(188,19,254,0.5)]"
        }`}
      >
        {isGenerating ? "PROCESANDO DATOS..." : "1. MATERIALIZAR IMAGEN"}
      </button>

      {/* ZONA DE PREVISUALIZACIÓN */}
      {previewUrl && (
        <div className="mb-6 relative rounded-xl overflow-hidden border-2 border-cyan-500/30 group">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className={`w-full object-cover transition-opacity duration-700 ${isGenerating ? "opacity-50 blur-sm" : "opacity-100"}`} 
            />
            {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-cyan-400 font-mono animate-pulse">SINTETIZANDO PIXELES...</span>
                </div>
            )}
            
            {/* Estado del archivo (Debug visual) */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-center text-xs font-mono">
                {generatedFile ? <span className="text-green-400">● IMAGEN LISTA PARA BLOCKCHAIN</span> : <span className="text-yellow-400">● ESPERANDO BINARIOS...</span>}
            </div>
        </div>
      )}

      {/* BOTÓN 2: GUARDAR EN BLOCKCHAIN (MINT) */}
      {/* Solo aparece si la imagen ya se generó correctamente */}
      {generatedFile && (
        <div className="animate-fade-in-up">
            <TransactionButton
              transaction={() => {
                if (!account) throw new Error("⚠️ Conecta tu Wallet primero");
                
                return mintTo({
                  contract,
                  to: account.address,
                  nft: {
                    name: prompt,
                    image: generatedFile, 
                    description: "Generado en la Matrix de Sepolia",
                  },
                });
              }}
              onTransactionConfirmed={() => {
                alert("🚀 ¡NFT Acuñado! Espera unos segundos y recarga la galería.");
                setPrompt("");
                setGeneratedFile(null);
                setPreviewUrl("");
              }}
              onError={(error) => {
                  console.error("Error Minting:", error);
                  alert(`Error: ${error.message}`); 
              }}
              style={{
                backgroundColor: "#00f3ff",
                color: "black",
                fontWeight: "bold",
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              2. INSCRIBIR EN BLOCKCHAIN (SEPOLIA)
            </TransactionButton>
        </div>
      )}
    </div>
  );
}