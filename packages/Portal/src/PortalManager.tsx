import * as React from "react";
import { createContext } from "@chakra-ui/utils";

export interface PortalsContextType {
  host: HTMLElement;
  zIndex?: number;
  modals: {
    value: any[];
    add: (modal: any) => void;
    remove: (modal: any) => void;
  };
}

const [PortalsProvider, usePortalsContext] = createContext<PortalsContextType>(
  true,
);

export { usePortalsContext };

interface LayerManagerProps {
  children?: React.ReactNode;
  zIndex?: number;
}

// This component should be used once in the root
export function PortalManager({ children, zIndex }: LayerManagerProps) {
  // The element that wraps the stacked layers
  const hostRef = React.useRef<HTMLDivElement>(null);

  // force an update so the Provider works correctly
  const [, forceUpdate] = React.useState();
  React.useEffect(() => {
    forceUpdate({});
  }, []);

  // Just a hack to help me manage multiple modals
  const [modals, setModals] = React.useState<any[]>([]);
  const add = React.useCallback(
    modal => setModals((modals: any) => [...modals, modal]),
    [],
  );
  const remove = React.useCallback(
    modal => setModals(modals => modals.filter(_modal => _modal !== modal)),
    [],
  );

  // let's detect if use has mutiple instances of this component
  const parent = usePortalsContext();

  // Broadcast the host element via context
  // If user passed a stacking context (aka z-index), send that as well
  const context = {
    host: parent?.host || hostRef.current,
    zIndex,
    modals: { value: modals, add, remove },
  };

  return (
    <PortalsProvider value={context}>
      {children}
      <div className="__chakra--portal-manager" ref={hostRef} />
    </PortalsProvider>
  );
}

export default PortalManager;