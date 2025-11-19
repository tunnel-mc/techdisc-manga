import React, { useState } from "react";
import Papa from "papaparse";

export default function App() {
  const [rows, setRows] = useState([]);

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      Papa.parse(e.target.result, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (res) => {
          // ensure consistent keys (lowercase, trim)
          const data = res.data.map((r) => {
            const out = {};
            Object.keys(r).forEach((k) => {
              out[k.trim()] = r[k];
            });
            return out;
          });
          setRows(data);
        },
      });
    };
    reader.readAsText(file);
  }

  function loadSample() {
    const sample = `date,time,disc_name,speed_mph,spin_rpm,apex_height_m,nose_angle_deg,launch_angle_deg,hyzer_angle_deg,distance_m
2025-02-10,14:32:11,Innova Destroyer,58.3,532,4.2,-2.1,12.4,-5.3,119.4
2025-02-10,14:35:48,Discraft Buzzz,48.7,401,3.1,-1.4,9.6,-2.0,87.2
2025-02-11,10:12:00,Innova Mako3,50.2,450,3.5,-1.8,10.2,-3.0,95.6
2025-02-12,18:40:22,Legacy Rival,60.1,610,4.8,-2.5,13.0,-6.0,123.8`;
    const blob = new Blob([sample], { type: "text/csv" });
    handleFile(blob);
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Manga TechDisc Viewer</h1>
        <p className="subtitle">Drop a TechDisc CSV or load the sample — manga-style panels for each throw.</p>
      </header>

      <section className="controls">
        <input type="file" accept=".csv" onChange={(e) => handleFile(e.target.files && e.target.files[0])} />
        <div className="buttons">
          <button onClick={loadSample} className="btn">Load sample</button>
          <button onClick={() => { setRows([]); }} className="btn alt">Clear</button>
        </div>
      </section>

      <main className="cards">
        {rows.length === 0 && (
          <div className="empty">
            <div className="speech-bubble">No throws loaded — lade eine CSV hoch oder nutze „Load sample“!</div>
          </div>
        )}

        {rows.map((r, i) => (
          <article key={i} className="manga-card">
            <div className="manga-sparkle" />
            <div className="panel-header">
              <h4>Throw {i + 1}</h4>
              <div className="manga-bubble">{r.disc_name ?? "—"}</div>
            </div>

            <div className="manga-values">
              <div className="manga-value">
                <div className="label">Speed (mph)</div>
                <div className="num">{r.speed_mph ?? "—"}</div>
                <div className="manga-ka">ZOOM</div>
              </div>

              <div className="manga-value">
                <div className="label">Spin (RPM)</div>
                <div className="num">{r.spin_rpm ?? "—"}</div>
              </div>

              <div className="manga-value">
                <div className="label">Apex (m)</div>
                <div className="num">{r.apex_height_m ?? "—"}</div>
              </div>

              <div className="manga-value">
                <div className="label">Distance (m)</div>
                <div className="num manga-big">{r.distance_m ?? "—"}</div>
              </div>

              <div className="manga-value">
                <div className="label">Launch (°)</div>
                <div className="num">{r.launch_angle_deg ?? "—"}</div>
              </div>

              <div className="manga-value">
                <div className="label">Hyzer (°)</div>
                <div className="num">{r.hyzer_angle_deg ?? "—"}</div>
              </div>

            </div>

            <div className="speech-wrap">
              <div className="speech-bubble">Nice shot! ({r.date ?? ''} {r.time ?? ''})</div>
            </div>
          </article>
        ))}
      </main>

      <footer className="footer">Built with manga vibes ✦ drop your TechDisc CSV to visualize throws.</footer>
    </div>
  );
}
