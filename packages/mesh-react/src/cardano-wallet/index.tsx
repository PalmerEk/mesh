import { useEffect, useState } from "react";

import Button from "../common/button";
import { useWallet, useWalletList } from "../hooks";
import { MenuItem } from "./menu-item";
import { WalletBalance } from "./wallet-balance";

interface ButtonProps {
  label?: string;
  onConnected?: Function;
  isDark?: boolean;
  metamask?: {
    network: string;
  };
  extensions?: number[];
}

export const CardanoWallet = ({
  label = "Connect Wallet",
  onConnected = undefined,
  isDark = false,
  metamask = {
    network: "preprod",
  },
  extensions = [],
}: ButtonProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hideMenuList, setHideMenuList] = useState(true);

  const { connect, connecting, connected, disconnect, name } = useWallet();
  const wallets = useWalletList({ metamask });

  useEffect(() => {
    if (connected && onConnected) {
      onConnected();
    }
  }, [connected]);

  useEffect(() => {
    setIsDarkMode(isDark);
  }, [isDark]);

  return (
    <div
      onMouseEnter={() => setHideMenuList(false)}
      onMouseLeave={() => setHideMenuList(true)}
      style={{ width: "min-content", zIndex: 50 }}
    >
      <Button
        isDarkMode={isDarkMode}
        hideMenuList={hideMenuList}
        setHideMenuList={setHideMenuList}
      >
        <WalletBalance
          connected={connected}
          connecting={connecting}
          label={label}
          wallet={wallets.find((wallet) => wallet.id === name)}
        />
      </Button>
      <div
        className={`ui-mr-menu-list ui-absolute ui-w-60 ui-rounded-b-md ui-border ui-text-center ui-shadow-sm ui-backdrop-blur ${hideMenuList && "ui-hidden"} ${isDarkMode ? `ui-bg-neutral-950	ui-text-neutral-50` : `ui-bg-neutral-50	ui-text-neutral-950`}`}
        style={{ zIndex: 50 }}
      >
        {!connected && wallets.length > 0 ? (
          <>
            {wallets.map((wallet, index) => (
              <MenuItem
                key={index}
                icon={wallet.icon}
                label={wallet.name}
                action={() => {
                  connect(wallet.id, extensions);
                  setHideMenuList(!hideMenuList);
                }}
                active={name === wallet.id}
              />
            ))}
            {/* <MenuItem
              icon={
                isDarkMode
                  ? `https://meshjs.dev/logo-mesh/white/logo-mesh-white-128x128.png`
                  : `https://meshjs.dev/logo-mesh/black/logo-mesh-black-128x128.png`
              }
              label={'Local'}
              action={() => {
                connectLocalWallet();
                setHideMenuList(!hideMenuList);
              }}
              active={false}
            /> */}
          </>
        ) : wallets.length === 0 ? (
          <span>No Wallet Found</span>
        ) : (
          <>
            <MenuItem
              active={false}
              label="disconnect"
              action={disconnect}
              icon={undefined}
            />
          </>
        )}
      </div>
    </div>
  );
};
