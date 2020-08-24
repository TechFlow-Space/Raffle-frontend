import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { GiMoneyStack } from 'react-icons/gi';
import { FaSignOutAlt } from 'react-icons/fa';
import { VscCircleFilled } from 'react-icons/vsc';

import { hmy } from '../../utils/harmony';
import { formatAddress } from '../../utils/formatting';
import Logo from '../../assets/images/logo.svg';
import './styles.scss';

function Header({logUserIn, address, logout, walletBalance, network}) {
  walletBalance = new hmy.utils.Unit(walletBalance).asWei().toOne();
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
        <Nav.Item>
          <span className='current-network'>
            <VscCircleFilled color='#43e650' />
            {network}
          </span>
        </Nav.Item>
        {!address ?
          <Button onClick={logUserIn} style={{width: '100px', marginLeft:'1rem'}} className='btn-theme'>Login</Button>
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
  network: store.lotteryReducer.network,
});

export default connect(mapStateToProps)(Header);