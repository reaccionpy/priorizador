import React from "react";

export default function CustomHeader() {
  return (
    <div className="header" style={{ maxHeight: '20vh'}}>
      <div className="header-title">Priorizador de Ayuda</div>
      <div className="header-right" style={{ maxHeight: '20vh'}}>
        <img className="header-logo" src="reaccion2.png" alt="Reaccion" style={{ height: 50 }} />
        <img className="header-logo" src="codium-logo-white.svg" alt="Codium" style={{ height: 38 }} />
      </div>
    </div>
  );
}
