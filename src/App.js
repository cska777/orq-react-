import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Inscription from './utilisateur/inscription';
import Navbar from './include/navbar';
import Home from './home';
import TrouverFilm from './trouverFilm';
import TrouverSerie from './trouverSerie';
import ParticlesBg from "./ParticlesBg";
import Profil from './utilisateur/profil';
import Watchlist from './utilisateur/watchlist';
import { ResetPassword } from './utilisateur/resetPwd';


function App() {
  return (
    <Router>
      {<ParticlesBg />}
      <Main />
    </Router>
  )
}

function Main() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/trouverFilm" element={<TrouverFilm />} />
        <Route path="/trouverSerie" element={<TrouverSerie />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profil" element={<Profil />} />
        {/* <Route path="/reset_pwd" element={<ResetPassword />} /> */}
      </Routes>
    </>
  );
}




export default App;
