import React, { PropTypes } from 'react';
import ParametersForm from '../components/ParametersForm.jsx';


class ParametersPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      editmod : true,
      user: {
        address: '',
        phone: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.edit = this.edit.bind(this);
  }

  componentDidMount(){
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/infos');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${localStorage.getItem('token')}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        //console.log(xhr.response);
        this.setState({user: xhr.response});

      }else{
      }
    });
    xhr.send();
  }
  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const address = encodeURIComponent(this.state.user.address);
    const phone = encodeURIComponent(this.state.user.phone);
    const formData = `address=${address}&phone=${phone}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/infos');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${localStorage.getItem('token')}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // set a message
        //localStorage.setItem('successMessage', xhr.response.message);
        alert(xhr.response.message);

      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });

  }
  edit(){
    this.setState({editmod : !this.state.editmod});
    return this.state.editmod;
  }
  /**
   * Render the component.
   */
  render() {
    return (
      <ParametersForm
        edit = {this.edit}
        editMode = {this.state.editmod}
        addressInput={this.state.user.address}
        phoneInput={this.state.user.phone}
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

ParametersPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default ParametersPage;
