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
          <Board />
      </div>  
    </ChakraProvider>
    
  );
}

export default App;
