import { Toaster } from "sonner";
import AppRouter from "./router";
import { GlobalDialog } from "./components/ui/GlobalDialog";


function App() {
  return (
    <>
      <AppRouter />
      <Toaster />
      <GlobalDialog/>
    </>
  );
}

export default App;
