"use client";

import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";
import { MediaRenderer } from "thirdweb/react";
import { client } from "../utils/client";

const CONTRACT_ADDRESS = "0x5e417b92B94d72FF1893E53026884f788f7AE052"; 

const contract = getContract({
  client,
  chain: sepolia,
  address: CONTRACT_ADDRESS,
});

export default function NFTGallery() {
  const { data: nfts, isLoading, refetch } = useReadContract(getNFTs, {
    contract,
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-6 border-b border-gray-700 pb-2">
            <h3 className="text-xl text-cyan-400 font-mono">/// BASE DE DATOS DE ACTIVOS</h3>
            <button 
                onClick={() => refetch()} 
                className="text-xs text-purple-400 hover:text-white border border-purple-500 px-3 py-1 rounded hover:bg-purple-600 transition-colors"
            >
                ↻ ACTUALIZAR RED
            </button>
        </div>

      {isLoading ? (
        <div className="text-center py-20 animate-pulse text-cyan-600">ESCANEANDO BLOCKCHAIN...</div>
      ) : !nfts || nfts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">NO SE ENCONTRARON ARTEFACTOS.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div 
              key={nft.id} 
              className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
            >
              <div className="aspect-square w-full relative overflow-hidden">
                  <MediaRenderer 
                    client={client}
                    src={nft.metadata.image} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    style={{width: '100%', height: '100%'}}
                  />
                  {/* Overlay al pasar el mouse */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <span className="text-xs text-cyan-300 font-mono">SECURE ASSET</span>
                  </div>
              </div>
              
              <div className="p-4 bg-black/40">
                <h4 className="text-white font-bold truncate text-sm mb-1">{nft.metadata.name}</h4>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-400 font-mono">ID: #{nft.id.toString()}</span>
                    <span className="text-[10px] bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">ERC-721</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}