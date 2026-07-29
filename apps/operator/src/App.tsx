import { Toaster } from "sonner";
import AppRouter from "@/app/router";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster richColors />
    </>
  );
}

export default App;
