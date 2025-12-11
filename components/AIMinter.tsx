"use client";

import { useState } from "react";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains"; 
import { mintTo } from "thirdweb/extensions/erc721";
import { client } from "../utils/client";

// ✅ Tu contrato (Ya configurado)
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
  
  // Paso 1: Generar imagen con IA y convertirla a archivo
  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedFile(null); 
    
    try {
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
        setPreviewUrl(url); 

        // Descarga la imagen para subirla a la Blockchain
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "nft-image.jpg", { type: "image/jpeg" });
        setGeneratedFile(file); 
    } catch (err) {
        console.error("Error:", err);
        alert("Error al generar la imagen. Intenta de nuevo.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="glass-card p-8 rounded-2xl w-full max-w-lg mx-auto transition-all duration-500 hover:shadow-[0_0_30px_rgba(188,19,254,0.3)]">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
        ⚡ Generador Neural
      </h2>
      
      {/* INPUT */}
      <div className="mb-6 group">
        <label className="block text-cyan-300 text-sm mb-2 font-mono tracking-widest">
          PROMPT DE COMANDO
        </label>
        <div className="relative">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Cyberpunk samurai cat..."
            className="w-full bg-black/50 border border-purple-500/30 rounded-lg py-3 px-4 text-white focus:border-cyan-400 transition-all"
          />
        </div>
      </div>

      {/* BOTÓN 1: GENERAR */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt}
        className={`w-full py-3 rounded-lg font-bold tracking-widest mb-6 transition-all ${
          isGenerating ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]"
        }`}
      >
        {isGenerating ? "PROCESANDO..." : "1. MATERIALIZAR IMAGEN"}
      </button>

      {/* PREVIEW */}
      {previewUrl && (
        <div className="mb-6 relative rounded-xl overflow-hidden border-2 border-cyan-500/30">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className={`w-full object-cover ${isGenerating ? "opacity-50 blur-sm" : "opacity-100"}`} 
            />
             {/* Indicador de estado */}
             <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-center text-xs font-mono">
                {generatedFile ? <span className="text-green-400">● LISTO PARA BLOCKCHAIN</span> : <span className="text-yellow-400">● CARGANDO BINARIOS...</span>}
            </div>
        </div>
      )}

      {/* BOTÓN 2: MINT (Solo aparece si todo está listo) */}
      {generatedFile && (
        <div className="animate-fade-in-up">
            <TransactionButton
              transaction={() => {
                if (!account) throw new Error("⚠️ Conecta tu Wallet");
                
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
                alert("🚀 ¡NFT Creado! Actualiza la galería para verlo.");
                setPrompt("");
                setGeneratedFile(null);
                setPreviewUrl("");
              }}
              onError={(error) => {
                  console.error("Error Minting:", error);
                  // Si falla aquí, es 100% permisos o falta de saldo
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
              2. INSCRIBIR EN BLOCKCHAIN
            </TransactionButton>
        </div>
      )}
    </div>
  );
}