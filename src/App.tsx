import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";

import Board from "./Board/Board";

// import "@blueprintjs/core/lib/css/blueprint.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Board />
        <div className="linkGroup">
          <div className="linkBtn">
            <Link href="https://github.com/Dan-X/game_of_life" isExternal>
              Github
            </Link>
          </div>

          <div className="linkBtn">
            <Link href="https://xinshi.me" isExternal>
              My site
            </Link>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
