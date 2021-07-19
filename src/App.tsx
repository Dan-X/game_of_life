import React from "react";
import { ChakraProvider } from "@chakra-ui/react"


import Board from "./Board/Board";

// import "@blueprintjs/core/lib/css/blueprint.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        {/* <div className="header">
          <H1>Conway's Game of Life</H1>
        </div> */}
        <div className="mainContainer">
          <Board />
        </div>
      </div>  
    </ChakraProvider>
    
  );
}

export default App;
