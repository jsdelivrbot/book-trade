import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const ParametersForm = ({
  edit,
  editMode,
  addressInput,
  phoneInput,
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <Card className="container">
    <form action="/" method="" onSubmit={onSubmit}>
      <h2 className="card-heading">Add Your Informations</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          disabled={editMode}
          floatingLabelText="Address"
          name="address"
          errorText={errors.address}
          onChange={onChange}
          value={addressInput}
        />
      </div>

      <div className="field-line">
        <TextField
          disabled={editMode}
          floatingLabelText="Phone"
          name="phone"
          errorText={errors.phone}
          onChange={onChange}
          value={phoneInput}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Save" primary />
      </div>
      <div className="button-line">
        <RaisedButton onClick={edit} label="Edit" primary />
      </div>
    </form>
  </Card>
);

ParametersForm.propTypes = {
  edit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default ParametersForm;
