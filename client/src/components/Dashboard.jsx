import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const style={
  marginLeft : "20px"
}

const Dashboard = ({ secretData,AddBook,input,onChange }) => (
  <Card className="container">
  <Card className="container">
  <CardTitle
    title="Your trade requests"
  />
  <div id="tradeBooks"></div>
  </Card>

  <Card className="container">
    <CardTitle
      title="Add a book"
    />
    <TextField
      onChange={onChange}
      hintText="Ex: Harry Potter..."
      value={input}
    /><FloatingActionButton mini={true} style={style} onClick={AddBook}>
      <ContentAdd />
    </FloatingActionButton><br />
    <div id="loader"></div>
    <div id="searchResult"></div>
    {secretData && <CardText style={{ fontSize: '16px', color: 'green' }}>{secretData}</CardText>}
  </Card>
  <CardTitle
    title="Your books"
  />
  <div id="userBooks"></div>
</Card>
);

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired,
  AddBook: PropTypes.func.isRequired,
  onChange : PropTypes.func.isRequired
};

export default Dashboard;
