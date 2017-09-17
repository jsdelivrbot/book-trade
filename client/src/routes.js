import Base from './components/Base.jsx';
import HomePage from './components/HomePage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import ParametersPage from './containers/ParametersPage.jsx';
import ExplorePage from './containers/ExplorePage.jsx';
import Auth from './modules/Auth';


const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/',
      getComponent: (location, callback) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', '/api/dashboard');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${localStorage.getItem('token')}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            callback(null, DashboardPage);
          }else{
            localStorage.clear();
            callback(null, HomePage);
          }
        });
        xhr.send();
      }
    },

    {
      path: '/login',
      component: LoginPage
    },
    {
      path: '/explore',
      getComponent: (location, callback) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', '/api/dashboard');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${localStorage.getItem('token')}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            callback(null, ExplorePage);
          }else{
            localStorage.clear();
            callback(null, HomePage);
          }
        });
        xhr.send();
      }
    },
    {
      path: '/signup',
      component: SignUpPage
    },

    {
      path: '/parameters',
      getComponent: (location, callback) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', '/api/dashboard');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${localStorage.getItem('token')}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            callback(null, ParametersPage);
          }else{
            localStorage.clear();
            callback(null, HomePage);
          }
        });
        xhr.send();
      }
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }

  ]
};

export default routes;
