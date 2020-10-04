import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import HomePage from './HomePage/HomePage.jsx'
import ListPage from './ListPage/ListPage.jsx'
import DetailsPage from './DetailsPage/DetailsPage.jsx'
import CasePage from './CasePage/CasePage.jsx'

export default function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>
                <Route exact path="/list">
                    <ListPage />
                </Route>
                <Route exact path="/details/:id">
                    <DetailsPage />
                </Route>
                <Route exact path="/case/:id">
                    <CasePage />
                </Route>
            </Switch>
        </HashRouter>
    )
}
