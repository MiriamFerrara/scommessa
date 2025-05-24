import React, { useState, useRef } from 'react';
import './App.css';
import logo from './assets/logo-pigrecoemme.png';
import horse from './assets/horse.png'; // Importa l'immagine del cavallo

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

function App() {
  const [nome, setNome] = useState('MARIO');
  const [saldo, setSaldo] = useState(1000);
  const [giocata, setGiocata] = useState('');
  const [cavalloSelezionato, setCavalloSelezionato] = useState('');
  const [garaInCorso, setGaraInCorso] = useState(false);
  const [classifica, setClassifica] = useState([]);
  const [mostraClassifica, setMostraClassifica] = useState(false);
  const [mostraPaginaScommessa, setMostraPaginaScommessa] = useState(true);
  const [winner, setWinner] = useState('');
  const [mostraRisultati, setMostraRisultati] = useState(false);
  const [durataGara, setDurataGara] = useState(10);

  // Stato posizioni cavalli per animazione corsa (percentuale da 0 a 100)
  const [posizioniCavalli, setPosizioniCavalli] = useState(Array(cavalliIniziali.length).fill(0));

  // Ref per intervallo animazione, così da poterlo pulire
  const intervalloRef = useRef(null);

  // Funzione per iniziare la corsa
  const startGara = (puntata) => {
    setSaldo(saldo - puntata);
    setGaraInCorso(true);
    setMostraPaginaScommessa(false);
    setMostraClassifica(false);
    setMostraRisultati(false);
    setWinner('');
    setPosizioniCavalli(Array(cavalliIniziali.length).fill(0));

    let posizioniTemp = Array(cavalliIniziali.length).fill(0);

    let durataMs = durataGara * 1000;
    let intervalloMs = 50;
    let ticks = Math.floor(durataMs / intervalloMs);
    let currentTick = 0;

    // Velocità casuale per ogni cavallo: min 1, max 5
    // Per SCACCOMATTO se l'utente ha puntato, si dà una penalità se non deve vincere
    const velocita = cavalliIniziali.map(cavallo => {
      if (cavallo.nome === 'SCACCOMATTO' && cavalloSelezionato === 'SCACCOMATTO') {
        return Math.random() * 1 + 0.2; // Penalità bassa velocità
      }
      return Math.random() * 4 + 1;
    });

    const aggiornaPosizioni = () => {
      currentTick++;
      let newPosizioni = posizioniTemp.map((pos, i) => {
        if (pos >= 100) return pos;
        // incrementa posizione con velocità
        const incremento = velocita[i] * (intervalloMs / 1000) * 20; // scala movimento
        return Math.min(pos + incremento, 100);
      });

      posizioniTemp = newPosizioni;
      setPosizioniCavalli(newPosizioni);

      if (currentTick >= ticks || newPosizioni.some(p => p >= 100)) {
        clearInterval(intervalloRef.current);
        // Classifica ordinando gli indici per posizione decrescente
        const indicesOrdinati = newPosizioni
          .map((pos, idx) => ({ pos, idx }))
          .sort((a, b) => b.pos - a.pos)
          .map(obj => obj.idx);

        const classificaFinale = indicesOrdinati.map(i => cavalliIniziali[i]);

        setClassifica(classificaFinale);
        setWinner(classificaFinale[0].nome);
        if (classificaFinale[0].nome === cavalloSelezionato) {
          setSaldo(prev => prev + puntata * 2);
        }
        setGaraInCorso(false);
        setMostraClassifica(true);
      }
    };

    intervalloRef.current = setInterval(aggiornaPosizioni, intervalloMs);
  };

  const handleScommetti = () => {
    const puntata = parseInt(giocata);
    if (!puntata || puntata <= 0 || puntata > saldo) return alert('Importo non valido');
    if (!cavalloSelezionato) return alert('Seleziona un cavallo');

    startGara(puntata);
  };

  const handleAllIn = () => setGiocata(saldo.toString());

  const handleReset = () => {
    if (intervalloRef.current) clearInterval(intervalloRef.current);

    setSaldo(1000);
    setGiocata('');
    setCavalloSelezionato('');
    setClassifica([]);
    setMostraClassifica(false);
    setMostraPaginaScommessa(true);
    setMostraRisultati(false);
    setWinner('');
    setPosizioniCavalli(Array(cavalliIniziali.length).fill(0));
    setGaraInCorso(false);
  };

  const handleAltro = () => {
    const nuovoNome = prompt("Modifica il tuo nome:", nome);
    if (nuovoNome !== null) setNome(nuovoNome.toUpperCase());

    const nuovoSaldo = prompt("Modifica il tuo saldo iniziale:", saldo);
    const numeroSaldo = parseInt(nuovoSaldo);
    if (!isNaN(numeroSaldo) && numeroSaldo > 0) {
      setSaldo(numeroSaldo);
      setGiocata('');
    } else if (nuovoSaldo !== null) {
      alert("Inserisci un importo valido");
    }

    const nuovaDurata = prompt("Imposta la durata della gara in secondi:", durataGara);
    const durataNum = parseInt(nuovaDurata);
    if (!isNaN(durataNum) && durataNum >= 2) {
      setDurataGara(durataNum);
    } else if (nuovaDurata !== null) {
      alert("Inserisci una durata valida (almeno 2 secondi)");
    }
  };

  const renderCavalli = () => {
    const altri = cavalliIniziali.filter(c => c.nome !== 'SCACCOMATTO');
    return (
      <>
        <div className="cavalli">
          <div
            className="cavallo-card scaccomatto-card"
            onClick={() => setCavalloSelezionato('SCACCOMATTO')}
            style={{ border: cavalloSelezionato === 'SCACCOMATTO' ? '3px solid orange' : 'none' }}
          >
            <img src={horse} alt="Cavallo" className="emoji" style={{ width: '30px', height: '30px' }} />
            <div className="barra" style={{ backgroundColor: 'red' }}></div>
            <div className="nome-cavallo">SCACCOMATTO</div>
          </div>
        </div>
        <div className="cavalli">
          {altri.map((cavallo, i) => (
            <div
              key={i}
              className="cavallo-card"
              onClick={() => setCavalloSelezionato(cavallo.nome)}
              style={{ border: cavalloSelezionato === cavallo.nome ? '3px solid orange' : 'none' }}
            >
              <img src={horse} alt="Cavallo" className="emoji" style={{ width: '30px', height: '30px' }} />
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
              <h2 className="giocata-titolo">Quanto vuoi puntare:</h2>
              <input
                type="number"
                className="input-importo"
                placeholder="Inserisci Quota"
                value={giocata}
                onChange={(e) => setGiocata(e.target.value)}
                disabled={garaInCorso}
                min="1"
                max={saldo}
              />
            </div>

            <div className="bottoni-colonna">
              <button className="btn-verde" onClick={handleAllIn} disabled={garaInCorso}>All-in</button>
              <button className="btn-arancio" onClick={handleScommetti} disabled={garaInCorso}>Scommetti</button>
              <button className="btn-reset" onClick={handleReset} disabled={garaInCorso}>Reset</button>
              <button className="altro-btn" onClick={handleAltro} disabled={garaInCorso}>Altro</button>
            </div>
          </div>
        </>
      )}

      {(garaInCorso || mostraClassifica) && (
        <div className="pista">
          {cavalliIniziali.map((cavallo, i) => (
            <div key={i} className="barra-corsa">
              <div className="nome-cavallo-corsa">{cavallo.nome}</div>
              <div className="contenitore-barra">
                <div
                  className="barra-avanzamento"
                  style={{
                    width: garaInCorso ? `${posizioniCavalli[i]}%` :
                    mostraClassifica ?
                      `${((classifica.findIndex(c => c.nome === cavallo.nome)) * -10 + 100)}%`
                      : '0%',
                    backgroundColor: cavallo.colore,
                    transition: 'width 0.1s ease-out',
                  }}
                ></div>
              </div>
            </div>
          ))}
          {!garaInCorso && mostraClassifica && !mostraRisultati && (
            <div className="risultati-sotto-gara">
              <button className="btn-verde" onClick={() => setMostraRisultati(true)}>
                Visualizza Risultati
              </button>
            </div>
          )}
        </div>
      )}

      {mostraClassifica && mostraRisultati && (
        <>
          <p className="message">
            Il vincitore è <strong>{winner}</strong> 🐎
            {winner === cavalloSelezionato && (
              <span style={{ color: 'green', marginLeft: '10px' }}>
                Hai vinto {parseInt(giocata) * 2}€! 🎉
              </span>
            )}
          </p>

          <div className="classifica">
            <h2>Classifica Finale</h2>
            <ol>
              {classifica.map((c, i) => (
                <li key={i} style={{ color: c.colore }}>
                  {i + 1}. {c.nome} {i === 0 && '🏆'}
                </li>
              ))}
            </ol>

            {cavalloSelezionato === 'SCACCOMATTO' && winner !== 'SCACCOMATTO' && (
              <div className="messaggio-perdita">
                Hai perso tutto puntando su SCACCOMATTO 💸
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <button className="btn-arancio" onClick={handleReset}>
                Scommetti di nuovo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;