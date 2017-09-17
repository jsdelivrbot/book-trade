import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/action/input';
import { Link } from 'react-router';


const HomePage = () => (
  <div id="image">
    <div id="title" >
    We are all on the same page!<br/>Find, Trade, Exchange books<br/>Start here:
    <br/>
    <Link to="/login">
      <FloatingActionButton>
        <ContentAdd />
      </FloatingActionButton>
    </Link>
    </div>
  </div>
);

export default HomePage;
