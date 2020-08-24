import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { GiMoneyStack } from 'react-icons/gi';
import { FaSignOutAlt } from 'react-icons/fa';

import { formatAddress } from '../../utils/formatting';
import Logo from '../../assets/images/logo.svg';
import './styles.scss';

function Header({logUserIn, address, logout, walletBalance}) {
  return(
    <Navbar className='main-nav' expand="lg">
      <Navbar.Brand alt='Harmony Raffle'>
        <Link to='/'>
          <Image src={Logo} fluid />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto ml-auto">
          <Nav.Link className='menu-items'>History</Nav.Link>
          <Nav.Link className='menu-items'>FAQ</Nav.Link>
          <Nav.Link className='menu-items'>Contact</Nav.Link>
        </Nav>
        {!address ?
          <Button onClick={logUserIn} style={{width: '100px'}} className='btn-theme'>Login</Button>
          :
          <NavDropdown title={formatAddress(address)} id="">
            <NavDropdown.Item>
              <GiMoneyStack />
              <span className='dropdown-text'>
                {walletBalance.toString().slice(0, walletBalance.indexOf('.')+3)} ONE
              </span>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>
              <FaSignOutAlt />
              <span className='dropdown-text'>
                Logout
              </span>
            </NavDropdown.Item>
          </NavDropdown>
        }
      </Navbar.Collapse>
    </Navbar>
  );
}


const mapStateToProps = (store) => ({
  address: store.lotteryReducer.walletAddress,
  walletBalance: store.lotteryReducer.walletBalance,
});

export default connect(mapStateToProps)(Header);