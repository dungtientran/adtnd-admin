import { getSubscriptions } from '@/stores/subscriptions/subscriptions.action';
import { createBrowserHistory } from 'history';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Router } from 'react-router-dom';

export const history = createBrowserHistory();

interface HistoryRouterProps {
  history: typeof history;
}

export const HistoryRouter: React.FC<HistoryRouterProps> = ({ history, children }) => {
  const dispatch = useDispatch();

  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);
  React.useLayoutEffect(() => {
    dispatch(getSubscriptions())
  }, [])
  return React.createElement(Router, Object.assign({ children, navigator: history }, state));
};
