/* エントリーポイント */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Component
import Header from "./components/Header";

// Page
import Top from "./pages/Top";
import TraningMenu from "./pages/TrainingMenu";
import Summary from "./pages/Summary";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";

const element: HTMLElement = document.getElementById("root") as HTMLElement;
const root: ReactDOM.Root = ReactDOM.createRoot(element);

// ルーティング
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/training-menu" element={<TraningMenu />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
