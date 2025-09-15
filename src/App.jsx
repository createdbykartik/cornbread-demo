
import { useState } from 'react';
import './App.css';
import bowlImg from './assets/bowl.svg';
import potImg from './assets/pot.svg';
import jarImg from './assets/jar.svg';
// cornbread loaf visual removed; no import needed
// Ingredient icons imported so production build resolves hashed asset paths
import cornmealIcon from './assets/ingredients/cornmeal.svg';
import flourIcon from './assets/ingredients/flour.svg';
import eggsIcon from './assets/ingredients/eggs.svg';
import milkIcon from './assets/ingredients/milk.svg';
import butterIcon from './assets/ingredients/butter.svg';
import sugarIcon from './assets/ingredients/sugar.svg';
import bakingPowderIcon from './assets/ingredients/baking_powder.svg';
// Palak Paneer icons
import spinachIcon from './assets/ingredients/palak/spinach.svg';
import paneerIcon from './assets/ingredients/palak/paneer.svg';
import tomatoIcon from './assets/ingredients/palak/tomato.svg';
import onionIcon from './assets/ingredients/palak/onion.svg';
import garlicIcon from './assets/ingredients/palak/garlic.svg';
import gingerIcon from './assets/ingredients/palak/ginger.svg';
import spicesIcon from './assets/ingredients/palak/spices.svg';
import creamIcon from './assets/ingredients/palak/cream.svg';
// Removed bread strip footer image in favor of a sticky note

const CORNBREAD_INGREDIENTS = [
  { name: 'Cornmeal', color: '#FFD700', icon: cornmealIcon },
  { name: 'Flour', color: '#FFF8DC', icon: flourIcon },
  { name: 'Eggs', color: '#FFEB3B', icon: eggsIcon },
  { name: 'Milk', color: '#B3E5FC', icon: milkIcon },
  { name: 'Butter', color: '#FFE4B5', icon: butterIcon },
  { name: 'Sugar', color: '#FFF', icon: sugarIcon },
  { name: 'Baking Powder', color: '#F5F5F5', icon: bakingPowderIcon },
];

const PALAK_PANEER_INGREDIENTS = [
  { name: 'Spinach', color: '#d2f0dc', icon: spinachIcon },
  { name: 'Paneer', color: '#fff9ec', icon: paneerIcon },
  { name: 'Tomato', color: '#ffe0e0', icon: tomatoIcon },
  { name: 'Onion', color: '#ffe6f5', icon: onionIcon },
  { name: 'Garlic', color: '#f7f5ee', icon: garlicIcon },
  { name: 'Ginger', color: '#f5e2c7', icon: gingerIcon },
  { name: 'Spices', color: '#f0e0d8', icon: spicesIcon },
  { name: 'Cream', color: '#fff7ef', icon: creamIcon },
];

function App() {
  // Static auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [recipe, setRecipe] = useState('Cornbread');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const STATIC_USER = 'iman';
  const STATIC_PASS = 'baltimore';

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
  const [baked, setBaked] = useState(false);
  const [baking, setBaking] = useState(false); // oven animation state
  const [showIngredientsPrompt, setShowIngredientsPrompt] = useState(false);

  const INGREDIENTS = recipe === 'Palak Paneer' ? PALAK_PANEER_INGREDIENTS : CORNBREAD_INGREDIENTS;

  const handleAdd = (ingredient) => {
    if (!selected.includes(ingredient.name)) {
      setFalling([...falling, ingredient]);
      setTimeout(() => {
        setSelected((prev) => [...prev, ingredient.name]);
        setFalling((prev) => prev.filter(i => i.name !== ingredient.name));
      }, 900);
    }
  };

  const handleBake = () => {
    if (baked || baking) return;
    if (selected.length < INGREDIENTS.length) {
      setShowIngredientsPrompt(true);
      return;
    }
    setBaking(true);
    // Simulate cook process
    setTimeout(() => {
      setBaked(true);
      setTimeout(() => setBaking(false), 1600); // hide oven after reveal
    }, 1400);
  };

  const handleReset = () => {
    setSelected([]);
    setFalling([]);
    setBaked(false);
    setBaking(false);
  };

  // When recipe changes, reset state and heading
  const handleRecipeChange = (next) => {
    setRecipe(next);
    setSelected([]);
    setFalling([]);
    setBaked(false);
    setBaking(false);
  }

  if (!authenticated) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <h1 className="login-title">Cornbread Lab</h1>
          <p className="login-sub">Sign in to start cooking</p>
          <form onSubmit={handleLoginSubmit} className="login-form" autoComplete="off">
            <label className="login-field">
              <span>Username</span>
              <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="Username" required />
            </label>
            <label className="login-field">
              <span>Password</span>
              <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" required />
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
    <div className="topbar">
        <label className="recipe-label" htmlFor="recipe-select">Recipe</label>
        <select
          id="recipe-select"
          className="recipe-select"
      value={recipe}
      onChange={(e) => handleRecipeChange(e.target.value)}
          aria-label="Select recipe"
        >
          <option value="Cornbread">Cornbread</option>
          <option value="Palak Paneer">Palak Paneer</option>
        </select>
      </div>
    <div className="auth-bar"><button className="logout-btn" onClick={() => { setAuthenticated(false); setLoginUser(''); setLoginPass(''); }}>Logout</button></div>
    <h1>Ktk's kitchen for Iman</h1>
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
              <img src={jarImg} alt="Jar" className="jar-img" style={{ zIndex: 1 }} />
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
        <button className="secondary-btn" onClick={handleBake} disabled={selected.length < INGREDIENTS.length || baked}> {baked ? 'Cooked ✅' : baking ? 'Cooking…' : 'Cook'} </button>
        <button className="secondary-btn" onClick={handleReset} disabled={baking}>Reset</button>
      </div>
  {baked && !baking && <div className="mix-animation baked">Dish cooked! (Imagine the aroma)</div>}
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
  <div className={`bowl-overlay ${baked ? 'done' : ''}`}></div>
        {recipe === 'Palak Paneer' ? (
          <img src={potImg} alt="Cooking Pot" className="bowl-img" />
        ) : (
          <img src={bowlImg} alt="Bowl" className="bowl-img" />
        )}
        {baking && (
          <div className="stovetop" aria-hidden>
            <div className="burner"></div>
            <div className="flame"></div>
          </div>
        )}
        {baking && (
          <div className="smoke" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
  {/* Bread reveal removed per request */}
      </div>
      {baked && !baking && (
        <div className="sticky-note" role="note" aria-label="Note">
          {recipe === 'Palak Paneer' ? (
            <>
              <p className="note-paragraph">Dear jaana, here's the palak paneer you wanted to have. I know it's not the same, but I really want to cook it for you.</p>
              <p className="note-paragraph ps">I love you ❤️</p>
            </>
          ) : (
            <>
              <p className="note-paragraph">Dear Iman, Here's the cornbread which I can make and send you. I know, this won't satisfy your cravings for it - just my way of making you smile :) Hope you get your cornbread soon!</p>
              <p className="note-paragraph ps">PS - I'm glad you won't exchange me for a lifetime supply of cornbread :)</p>
              <p className="note-paragraph ps">I Love You! ❤️</p>
            </>
          )}
        </div>
      )}

      {showIngredientsPrompt && (
        <div className="ingredients-prompt-overlay" onClick={() => setShowIngredientsPrompt(false)}>
          <div className="ingredients-prompt" onClick={(e) => e.stopPropagation()}>
            <div className="prompt-icon">🥣</div>
            <h3>Umm, not enough ingredients!</h3>
            <p>Let's add all of them for the perfect recipe?</p>
            <div className="missing-ingredients">
              <p>Still need:</p>
              <div className="missing-list">
                {INGREDIENTS.filter(ing => !selected.includes(ing.name)).map(ingredient => (
                  <span key={ingredient.name} className="missing-item">
                    <img src={ingredient.icon} alt={ingredient.name} className="missing-icon" />
                    {ingredient.name}
                  </span>
                ))}
              </div>
            </div>
            <button className="prompt-btn" onClick={() => setShowIngredientsPrompt(false)}>
              Got it! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
