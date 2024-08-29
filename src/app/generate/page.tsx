"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { formatImage } from "@/utils/image-src-format.util";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import {
  PiArrowsClockwiseBold,
  PiXBold,
  PiFloppyDiskBold,
  PiListBold,
} from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import {
  BaseModal,
  BaseModalContent,
  BaseModalHeader,
  BaseModalTitle,
  BaseModalFooter,
  BaseModalTrigger,
  BaseModalDescription,
} from "@/components/modals/base-modal";

type OutfitPiece = {
  id: string;
  type: string;
  image: string | null;
};

type SavedOutfit = {
  id: string;
  name: string;
  pieces: OutfitPiece[];
};

const pieceOrder = [
  "HEADWEAR",
  "GLASSES",
  "JEWELRY",
  "HOODIE",
  "SHIRT",
  "WATCH",
  "PANTS",
  "SHOES",
];

export default function GenerateOutfitPage() {
  const { data: session } = useSession();
  const [outfit, setOutfit] = useState<OutfitPiece[]>([]);
  const [hasNoPieces, setHasNoPieces] = useState(false);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [outfitName, setOutfitName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOutfits = localStorage.getItem("savedOutfits");
      if (storedOutfits) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setSavedOutfits(JSON.parse(storedOutfits));
      }
    }
  }, []);

  const generateOutfitMutation = api.user.generateOutfit.useMutation({
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setOutfit(data);
        setHasNoPieces(false);
      } else {
        setHasNoPieces(true);
      }
    },
  });

  const regeneratePieceMutation = api.user.regeneratePiece.useMutation({
    onSuccess: (newPiece) => {
      if (newPiece) {
        setOutfit(outfit.map((p) => (p.type === newPiece.type ? newPiece : p)));
      }
    },
  });

  const deletePiece = (pieceType: string) => {
    setOutfit(outfit.filter((p) => p.type !== pieceType));
  };

  const saveOutfit = () => {
    if (outfitName.trim() === "") return;
    const newOutfit: SavedOutfit = {
      id: Date.now().toString(),
      name: outfitName,
      pieces: outfit,
    };
    const updatedOutfits = [...savedOutfits, newOutfit];
    setSavedOutfits(updatedOutfits);
    if (typeof window !== "undefined") {
      localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits));
    }
    setOutfitName("");
  };

  const deleteOutfit = (id: string) => {
    setSavedOutfits((prevOutfits) => {
      const updatedOutfits = prevOutfits.filter((outfit) => outfit.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("savedOutfits", JSON.stringify(updatedOutfits));
      }
      return updatedOutfits;
    });
  };

  if (!session) {
    return <div>Please log in to generate an outfit.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-1 font-clash">
        Generate Your Outfit [BETA]
      </h1>
      <p className="text-sm text-gray-500  mb-4">
        This feature is in testing, outfits are stored on your device. They are
        not shared across devices and might lose them in the future.
      </p>
      <div className="flex mb-4 flex-wrap text-nowrap gap-3">
        <Button
          className="max-w-fit"
          onClick={() => generateOutfitMutation.mutate()}
          disabled={generateOutfitMutation.isPending}
        >
          {generateOutfitMutation.isPending
            ? "Generating..."
            : "Generate Outfit"}
        </Button>
        <BaseModal>
          <BaseModalTrigger>
            {outfit.length > 0 && (
              <Button
                className="max-w-fit"
                iconLeft={<PiFloppyDiskBold className="w-4 h-4 mr-2" />}
              >
                Save Outfit
              </Button>
            )}
          </BaseModalTrigger>
          <BaseModalContent>
            <BaseModalHeader>
              <BaseModalTitle>Save Outfit</BaseModalTitle>
            </BaseModalHeader>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {outfit.map((piece) => (
                <div key={piece.id} className="relative w-16 h-16">
                  <Image
                    src={formatImage(piece.image, session.user.id)}
                    alt={piece.type}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              ))}
            </div>
            <input
              placeholder="Enter outfit name"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="flex items-center gap-4 p-3 py-4 flex-1 rounded-r-lg self-stretch"
            />
            <BaseModalFooter>
              <Button onClick={saveOutfit}>Save</Button>
            </BaseModalFooter>
            <p className="text-sm text-gray-500">
              This feature is in testing, outfits are stored on your device.
              They are not shared across devices and might lose them in the
              future.
            </p>
          </BaseModalContent>
        </BaseModal>
        <BaseModal>
          <BaseModalTrigger>
            {savedOutfits.length > 0 && (
              <Button
                className="max-w-fit"
                iconLeft={<PiListBold className="w-4 h-4 mr-2" />}
              >
                View Saved Outfits
              </Button>
            )}
          </BaseModalTrigger>
          <BaseModalContent>
            <BaseModalHeader>
              <BaseModalTitle>Saved Outfits</BaseModalTitle>
            </BaseModalHeader>
            <BaseModalDescription>
              This feature is in testing, outfits are stored on your device.
              They are not shared across devices and might lose them in the
              future.
            </BaseModalDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {savedOutfits.map((savedOutfit) => (
                  <motion.div
                    key={savedOutfit.id}
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    layout
                    className="border p-4 rounded-lg"
                  >
                    <h3 className="font-bold mb-2">{savedOutfit.name}</h3>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {savedOutfit.pieces.map((piece) => (
                        <div key={piece.id} className="relative w-12 h-12">
                          <Image
                            src={formatImage(piece.image, session.user.id)}
                            alt={piece.type}
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => deleteOutfit(savedOutfit.id)}
                      className="w-full max-w-fit"
                      iconLeft={<PiXBold className="w-4 h-4 mr-2" />}
                      shape="square"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              <BaseModalFooter>
                {savedOutfits.length === 0 && (
                  <p className="text-sm w-full text-gray-500">
                    No saved outfits
                  </p>
                )}
              </BaseModalFooter>
            </div>
          </BaseModalContent>
        </BaseModal>
      </div>
      {hasNoPieces && (
        <p className="mt-4 text-red-500">
          You need to post some pieces before you can generate an outfit.
        </p>
      )}
      <AnimatePresence>
        {outfit.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {pieceOrder.map((pieceType) => {
              const piece = outfit.find((p) => p.type === pieceType);
              if (!piece) return null;
              return (
                <motion.div
                  key={piece.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  layout
                  className="relative w-full h-48 md:h-64 cursor-pointer group"
                >
                  <Image
                    src={formatImage(piece.image, session.user.id)}
                    alt={piece.type}
                    layout="fill"
                    objectFit="contain"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Button
                        variant="ghost"
                        className="max-w-fit text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          regeneratePieceMutation.mutate({
                            type: piece.type as
                              | "HOODIE"
                              | "SHIRT"
                              | "PANTS"
                              | "SHOES"
                              | "WATCH"
                              | "GLASSES"
                              | "HEADWEAR"
                              | "JEWELRY",
                          });
                        }}
                        iconLeft={
                          <PiArrowsClockwiseBold className="w-4 h-4 mr-2" />
                        }
                        shape="square"
                      />
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePiece(piece.type);
                        }}
                        className="max-w-fit text-white"
                        iconLeft={<PiXBold className="w-4 h-4 mr-2" />}
                        shape="square"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
