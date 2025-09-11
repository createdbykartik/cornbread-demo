
import { useState } from 'react';
import './App.css';
import bowlImg from './assets/bowl.svg';
import jarImg from './assets/jar.svg';
import cornbreadImg from './assets/cornbread.svg';
// Ingredient icons imported so production build resolves hashed asset paths
import cornmealIcon from './assets/ingredients/cornmeal.svg';
import flourIcon from './assets/ingredients/flour.svg';
import eggsIcon from './assets/ingredients/eggs.svg';
import milkIcon from './assets/ingredients/milk.svg';
import butterIcon from './assets/ingredients/butter.svg';
import sugarIcon from './assets/ingredients/sugar.svg';
import bakingPowderIcon from './assets/ingredients/baking_powder.svg';
// Removed bread strip footer image in favor of a sticky note

const INGREDIENTS = [
  { name: 'Cornmeal', color: '#FFD700', icon: cornmealIcon },
  { name: 'Flour', color: '#FFF8DC', icon: flourIcon },
  { name: 'Eggs', color: '#FFEB3B', icon: eggsIcon },
  { name: 'Milk', color: '#B3E5FC', icon: milkIcon },
  { name: 'Butter', color: '#FFE4B5', icon: butterIcon },
  { name: 'Sugar', color: '#FFF', icon: sugarIcon },
  { name: 'Baking Powder', color: '#F5F5F5', icon: bakingPowderIcon },
];

function App() {
  // Static auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const STATIC_USER = 'iman';
  const STATIC_PASS = 'cornbread';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginUser.trim().toLowerCase() === STATIC_USER && loginPass === STATIC_PASS) {
      setAuthenticated(true);
      setLoginError('');
      setLoginPass('');
    } else {
      setLoginError('Invalid credentials');
    }
  };
  const [selected, setSelected] = useState([]);
  const [falling, setFalling] = useState([]);
  const [mixed, setMixed] = useState(false);
  const [mixingProgress, setMixingProgress] = useState(0);
  const [batterReady, setBatterReady] = useState(false);
  const [baked, setBaked] = useState(false);
  const [baking, setBaking] = useState(false); // oven animation state

  const handleAdd = (ingredient) => {
    if (!selected.includes(ingredient.name)) {
      setFalling([...falling, ingredient]);
      setTimeout(() => {
        setSelected((prev) => [...prev, ingredient.name]);
        setFalling((prev) => prev.filter(i => i.name !== ingredient.name));
      }, 900);
    }
  };

  const handleMix = () => {
    if (selected.length === 0 || mixed || batterReady) return;
    setMixed(true);
    setMixingProgress(0);
    const step = 8 + Math.random()*4;
    const interval = setInterval(() => {
      setMixingProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          setMixed(false);
          setBatterReady(true);
          return 100;
        }
        return next;
      });
    }, 120);
  };

  const handleBake = () => {
    if (!batterReady || baked || baking) return;
    setBaking(true);
    // Simulate oven process: door closed -> bake -> reveal
    setTimeout(() => {
      setBaked(true);
      setTimeout(() => setBaking(false), 1600); // hide oven after reveal
    }, 1400);
  };

  const handleReset = () => {
    setSelected([]);
    setFalling([]);
  setMixed(false);
  setMixingProgress(0);
  setBatterReady(false);
  setBaked(false);
  setBaking(false);
  };

  if (!authenticated) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <h1 className="login-title">Cornbread Lab</h1>
          <p className="login-sub">Sign in to start mixing</p>
          <form onSubmit={handleLoginSubmit} className="login-form" autoComplete="off">
            <label className="login-field">
              <span>Username</span>
              <input type="text" value={loginUser} onChange={(e)=>setLoginUser(e.target.value)} placeholder="Username" required />
            </label>
            <label className="login-field">
              <span>Password</span>
              <input type="password" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)} placeholder="••••••••" required />
            </label>
            {loginError && <div className="login-error" role="alert">{loginError}</div>}
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="cornbread-container">
      <div className="auth-bar"><button className="logout-btn" onClick={()=>{ setAuthenticated(false); setLoginUser(''); setLoginPass(''); }}>Logout</button></div>
      <h1>Iman, Your Cornbread!</h1>
      <div className="kitchen-shelf">
        <div className="shelf-bar"></div>
        <div className="jar-list">
          {INGREDIENTS.map((ingredient) => (
            <div className="jar-container" key={ingredient.name}>
              <button
                className={`ingredient-btn jar-btn${selected.includes(ingredient.name) ? ' selected' : ''}`}
                style={{ background: 'transparent', boxShadow: 'none', position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', width: '32px', height: '32px', padding: 0, zIndex: 2 }}
                onClick={() => handleAdd(ingredient)}
                disabled={selected.includes(ingredient.name)}
                aria-label={`Add ${ingredient.name}`}
              >
                <span className="ingredient-icon-wrapper">
                  <img
                    src={ingredient.icon}
                    alt={ingredient.name}
                    className="ingredient-icon"
                  />
                </span>
              </button>
              <img src={jarImg} alt="Jar" className="jar-img" style={{zIndex: 1}} />
              <span className="ingredient-label jar-label">{ingredient.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="selected-ingredients">
        <h2>Selected Ingredients:</h2>
        {selected.length === 0 ? (
          <p>No ingredients yet.</p>
        ) : (
          <div className="selected-list">
            {selected.map((name) => {
              const ingredient = INGREDIENTS.find(i => i.name === name);
              return (
                <div className="selected-card" key={name} style={{ background: ingredient.color }}>
                  <img
                    src={ingredient.icon}
                    alt={ingredient.name}
                    className="selected-icon"
                  />
                  <span className="selected-label">{ingredient.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="actions-row">
        <button className={`mix-btn${mixed ? ' mixing' : ''}`} onClick={handleMix} disabled={selected.length === 0 || mixed || batterReady}>
          {batterReady ? 'Mixed' : mixed ? 'Mixing...' : 'Mix Ingredients'}
        </button>
  <button className="secondary-btn" onClick={handleBake} disabled={!batterReady || baked}> {baked ? 'Baked ✅' : baking ? 'Baking…' : 'Bake'} </button>
        <button className="secondary-btn" onClick={handleReset} disabled={mixed}>Reset</button>
      </div>
      {mixed && (
        <div className="mix-progress">
          <div className="mix-bar"><span style={{width: `${mixingProgress}%`}} /></div>
          <div className="mix-note">Whisking... {Math.round(mixingProgress)}%</div>
        </div>
      )}
      {batterReady && !baked && <div className="mix-animation ready">🥣 Batter ready – bake it!</div>}
      {baked && !baking && <div className="mix-animation baked">🍞 Cornbread baked! (Imagine the aroma)</div>}
      <div className="bowl-wrapper">
        {/* Falling ingredients now scoped to bowl */}
        <div className="falling-ingredients">
          {falling.map((ingredient, idx) => (
            <img
              key={ingredient.name}
              src={ingredient.icon}
              alt={ingredient.name}
              className="falling-icon"
              style={{ '--i': idx, '--n': falling.length }}
            />
          ))}
        </div>
        <div className={`bowl-overlay ${mixed ? 'swirl' : ''} ${batterReady ? 'batter' : ''} ${baked ? 'done' : ''}`}></div>
        <img src={bowlImg} alt="Bowl" className="bowl-img" />
        {baking && (
          <div className="oven">
            <div className="oven-face">
              <div className="oven-window" />
              <div className={`oven-door ${baking ? 'open' : ''}`}></div>
            </div>
          </div>
        )}
        {baked && (
          <div className={`bread-top ${baking ? 'in-oven' : 'reveal'}`}>
            <img src={cornbreadImg} alt="Cornbread" className="cornbread-img" />
            {!baking && <div className="steam">
              <span />
              <span />
              <span />
            </div>}
          </div>
        )}
      </div>
      {baked && !baking && (
        <div className="sticky-note" role="note" aria-label="Note to Iman">
          <p className="note-paragraph">Dear Iman, Here's the cornbread which I can make and send you. I know, this won't satisfy your cravings for it - just my way of making you smile :) Hope you get your cornbread soon!</p>
          <p className="note-paragraph ps">PS - I'm glad you won't exchange me for a lifetime supply of cornbread :)</p>
          <p className="note-paragraph ps">I Love You! ❤️</p>
        </div>
      )}
    </div>
  );
}

export default App;
