import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';


const style={
  marginLeft : "20px"
}

const Explore = ({ secretData}) => (
  <Card className="container">
  <CardTitle
    title="Discover books"
  />
    <div id="exploreBooks"></div>
  </Card>
);

Explore.propTypes = {
  secretData: PropTypes.string.isRequired,
};

export default Explore;
