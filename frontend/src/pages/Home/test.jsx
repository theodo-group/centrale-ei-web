import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { MovieDetail, MovieList } from '../../components/Movie'; // Assurez-vous d'importer vos composants correctement

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={MovieList} />
          <Route path="/movie/:id" component={MovieDetail} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
