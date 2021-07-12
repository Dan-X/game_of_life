import Board from "./Board/Board";
import { H1, Text } from "@blueprintjs/core";

import "@blueprintjs/core/lib/css/blueprint.css";

import "./App.css";

function App() {
  return (
    <div className="App">
      {/* <div className="header">
        <H1>Conway's Game of Life</H1>
      </div> */}
      <div className="mainContainer">
        <Board />
      </div>
    </div>
  );
}

export default App;
