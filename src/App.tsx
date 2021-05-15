import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ProvideAuth } from './auth/use-auth';
import { ProvideTodos } from './todos/use-todos';
import PrivateRoute from './Components/PrivateRoute';
import MenuAppBar from './Components/MenuAppBar';
import Dashboard from './Components/Dashboard';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import EditTodoDialog from './Components/EditTodoDialog';

function Home() {
    return <h3>Home</h3>;
}

function App() {
    return (
        <ProvideAuth>
            <ProvideTodos>
                <Router>
                    <MenuAppBar />

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/signin" component={SignIn} />
                        <Route path="/signup" component={SignUp} />
                        <PrivateRoute path="/dashboard">
                            <Dashboard />
                        </PrivateRoute>
                    </Switch>

                    <EditTodoDialog />
                </Router>
            </ProvideTodos>
        </ProvideAuth>
    );
}

export default App;
