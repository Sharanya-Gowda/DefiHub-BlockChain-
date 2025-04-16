import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/walletContext";

export default function WalletConnectButton() {
  const { isConnected, address, openModal } = useWallet();

  return (
    <Button
      className="bg-primary hover:bg-blue-600 text-white transition-colors duration-200 flex items-center"
      onClick={openModal}
    >
      <i className="ri-wallet-3-line mr-2"></i>
      <span>{isConnected ? address : "Connect Wallet"}</span>
    </Button>
  );
}
