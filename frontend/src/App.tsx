import { Web3Provider } from "./Web3Provider";
import { Page } from "./page";

function App() {
  return (
    <Web3Provider>
      <Page />
    </Web3Provider>
  );
}

export default App;
