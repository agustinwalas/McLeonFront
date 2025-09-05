import { Toaster } from "sonner";
import AppRouter from "./router";
import { GlobalDialog } from "./components/ui/GlobalDialog";
import { useEffect } from "react";
import {
  setupGlobalNumberInputHandler,
  removeGlobalNumberInputHandler,
} from "@/utils/removeLeadingZeros";

function App() {
  useEffect(() => {
    setupGlobalNumberInputHandler();

    return () => {
      removeGlobalNumberInputHandler();
    };
  }, []);

  return (
    <>
      <AppRouter />
      <Toaster />
      <GlobalDialog />
    </>
  );
}

export default App;
