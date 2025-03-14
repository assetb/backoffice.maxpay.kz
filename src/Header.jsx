// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      <Link to="/p2p_transactions">P2P Transactions</Link>
      <Link to="/tranzex">Tranzex</Link>
    </div>
  );
};

export default Header;
