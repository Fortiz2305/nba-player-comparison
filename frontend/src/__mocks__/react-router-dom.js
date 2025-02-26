const React = require('react');

const Link = ({ children, to }) => React.createElement('a', { href: to }, children);
const BrowserRouter = ({ children }) => React.createElement('div', null, children);
const Routes = ({ children }) => React.createElement('div', null, children);
const Route = ({ element, path }) => React.createElement('div', { 'data-path': path }, element);
const useNavigate = () => jest.fn();

module.exports = {
  Link,
  BrowserRouter,
  Routes,
  Route,
  useNavigate
};
