import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.scss';
import Homepage from './pages/Homepage';
import store from './redux/store';

function App() {
  return(
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={Homepage} />
        <Redirect to='/' />
      </Router>
    </Provider>
  );
}

export default App;
