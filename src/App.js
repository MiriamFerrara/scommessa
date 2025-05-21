import React, { useState } from 'react';
import './App.css';
import logo from './assets/logo-pigrecoemme.png';

function App() {
  const cavalliIniziali = [
    { nome: 'SCACCOMATTO', colore: 'red' },
    { nome: 'FURIA', colore: 'green' },
    { nome: 'TEMPESTA', colore: 'yellow' },
    { nome: 'SPIRIT', colore: 'cyan' },
    { nome: 'FULMINE', colore: 'orange' },
    { nome: 'SAETTA', colore: 'blue' },
    { nome: 'DRAGO', colore: 'purple' },
    { nome: 'LUNA', colore: 'pink' },
    { nome: 'RED RUM', colore: 'white' }
  ];

  const [nome, setNome] = useState('MARIO');
  const [saldo, setSaldo] = useState(1000);
  const [giocata, setGiocata] = useState('');
  const [cavalloSelezionato, setCavalloSelezionato] = useState('');
  const [garaInCorso, setGaraInCorso] = useState(false);
  const [classifica, setClassifica] = useState([]);
  const [mostraClassifica, setMostraClassifica] = useState(false);
  const [mostraPaginaScommessa, setMostraPaginaScommessa] = useState(true);
  const [risultatoRivelato, setRisultatoRivelato] = useState(false);

  const handleScommetti = () => {
    const puntata = parseInt(giocata);
    if (!puntata || puntata > saldo || puntata <= 0) return alert('Importo non valido');
    if (!cavalloSelezionato) return alert('Seleziona un cavallo');

    setSaldo(saldo - puntata);
    setGaraInCorso(true);
    setMostraPaginaScommessa(false);

    let classificaCasuale = [...cavalliIniziali].sort(() => Math.random() - 0.5);

    if (cavalloSelezionato === 'SCACCOMATTO') {
      const altri = classificaCasuale.filter(c => c.nome !== 'SCACCOMATTO');
      const posizione = Math.floor(Math.random() * (altri.length - 1)) + 1;
      classificaCasuale = [
        ...altri.slice(0, posizione),
        { nome: 'SCACCOMATTO', colore: 'red' },
        ...altri.slice(posizione)
      ];
    }

    setTimeout(() => {
      setClassifica(classificaCasuale);
      setGaraInCorso(false);
      setMostraClassifica(true);
    }, 4000);
  };

  const handleAllIn = () => {
    setGiocata(saldo.toString());
  };

  const handleReset = () => {
    setSaldo(1000);
    setGiocata('');
    setCavalloSelezionato('');
    setClassifica([]);
    setMostraClassifica(false);
    setMostraPaginaScommessa(true);
  };

  const renderCavalli = () => {
    const altriCavalli = cavalliIniziali.filter(c => c.nome !== 'SCACCOMATTO');

    return (
      <>
        <div className="cavalli">
          <div className="cavallo-card scaccomatto-card"
            onClick={() => setCavalloSelezionato('SCACCOMATTO')}
            style={{
              border: cavalloSelezionato === 'SCACCOMATTO' ? '3px solid orange' : 'none'
            }}>
            <div className="emoji">🐴</div>
            <div className="barra" style={{ backgroundColor: 'red' }}></div>
            <div className="nome-cavallo">SCACCOMATTO</div>
          </div>
        </div>

        <div className="cavalli">
          {altriCavalli.map((cavallo, index) => (
            <div key={index}
              className="cavallo-card"
              onClick={() => setCavalloSelezionato(cavallo.nome)}
              style={{
                border: cavalloSelezionato === cavallo.nome ? '3px solid orange' : 'none'
              }}>
              <div className="emoji">🐴</div>
              <div className="barra" style={{ backgroundColor: cavallo.colore }}></div>
              <div className="nome-cavallo">{cavallo.nome}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="contenitore">
      <img src={logo} alt="logo" className="logo" />
      <h1>🏇 Scommesse Cavalli 🏇</h1>

      {mostraPaginaScommessa && (
        <>
        <p className="benvenuto">
          Benvenuto <span className="highlight"><strong>{nome}</strong></span><br />
          Il tuo saldo attuale è: <span className="saldo"><strong>{saldo}€</strong></span><br />
          <span className="sottotesto">
            Inizia a scommettere...<br />
            Scegli il tuo <span className="vincente">cavallo vincente</span>
          </span>
        </p>

          {renderCavalli()}
<div className="giocata">
  <div className="giocata-input-wrapper">
  <h2 className="giocata-titolo"> Quanto vuoi puntare:   </h2>

    <input
      type="number"
      className="input-importo"
      placeholder="Inserisci Quota"
      value={giocata}
      onChange={(e) => setGiocata(e.target.value)}
    />
  </div>

            <div className="bottoni-colonna">
              <button className="btn-verde" onClick={handleAllIn}>All-in</button>
              <button className="btn-arancio" onClick={handleScommetti}>Scommetti</button>
              <button className="btn-reset" onClick={handleReset}>Reset</button>
              <button className="altro-btn" onClick={() => {
                const nuovoNome = prompt("Modifica il tuo nome:", nome);
                if (nuovoNome !== null) setNome(nuovoNome.toUpperCase());

                const nuovoImporto = prompt("Modifica il tuo saldo iniziale:", saldo);
                if (nuovoImporto !== null) {
                  const importoNumero = parseInt(nuovoImporto);
                  if (!isNaN(importoNumero) && importoNumero > 0) {
                    setSaldo(importoNumero);
                    setGiocata('');
                  } else {
                    alert("Inserisci un importo numerico valido");
                  }
                }
              }}>
                Altro
              </button>
            </div>
          </div>
        </>
      )}

      {garaInCorso && (
        <div className="pista">
          {cavalliIniziali.map((c, i) => (
            <div key={i} className="corsia">
              <div
                className={`cavallo-animato ${c.nome === 'SCACCOMATTO' ? 'scacco-evidenziato' : ''}`}
                style={{ backgroundColor: c.colore }}
              >
                🐎 {c.nome}
              </div>
            </div>
          ))}
        </div>
      )}

      {mostraClassifica && (
        <div className="classifica">
          <h2>Classifica Finale</h2>
          <ol>
            {classifica.map((cavallo, index) => (
              <li key={index} style={{ color: cavallo.colore }}>
                {index + 1}. {cavallo.nome} {index === 0 && '🏆'}
              </li>
            ))}
          </ol>

          {cavalloSelezionato === 'SCACCOMATTO' && (
            <div className="messaggio-perdita">
              Hai perso tutto puntando su SCACCOMATTO 💸
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <button className="btn-arancio" onClick={handleReset}>Scommetti di nuovo</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
