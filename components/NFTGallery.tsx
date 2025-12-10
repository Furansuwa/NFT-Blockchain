"use client";

import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";
import { MediaRenderer } from "thirdweb/react";
import { client } from "../utils/client";

const CONTRACT_ADDRESS = "0x5655DC2A44A6Ad652cea6a250e454a6Ce023660c"; 

const contract = getContract({
  client,
  chain: sepolia,
  address: CONTRACT_ADDRESS,
});

export default function NFTGallery() {
  // Hook que lee todos los NFTs del contrato automáticamente
  const { data: nfts, isLoading } = useReadContract(getNFTs, {
    contract,
  });

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Cargando galería... ⏳</div>;
  }

  if (!nfts || nfts.length === 0) {
    return <div style={{ textAlign: "center", padding: "20px" }}>No hay NFTs creados aún. ¡Usa el generador arriba! 👆</div>;
  }

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
      gap: "20px",
      marginTop: "20px"
    }}>
      {nfts.map((nft) => (
        <div 
          key={nft.id} 
          style={{ 
            border: "1px solid #333", 
            borderRadius: "10px", 
            padding: "10px",
            backgroundColor: "#111", // Fondo oscuro para resaltar la imagen
            color: "white"
          }}
        >
          {/* MediaRenderer detecta si es IPFS o URL normal (como Pollinations) y la muestra */}
          <MediaRenderer 
            client={client}
            src={nft.metadata.image} 
            style={{ 
              width: "100%", 
              aspectRatio: "1/1", // Mantiene la imagen cuadrada
              objectFit: "cover", 
              borderRadius: "8px",
              marginBottom: "10px"
            }}
          />
          
<div style={{ 
            fontSize: "0.9rem", 
            fontWeight: "bold",
            // Estas 3 líneas hacen el efecto "truncate" (cortar texto con ...)
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {nft.metadata.name}
          </div>
          
          <div style={{ fontSize: "0.8rem", color: "#888" }}>
            ID: #{nft.id.toString()}
          </div>
        </div>
      ))}
    </div>
  );
}