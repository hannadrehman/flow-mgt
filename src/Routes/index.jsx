import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import HomePage from './HomePage/HomePage.jsx'
import ListPage from './ListPage/ListPage.jsx'
import DetailsPage from './DetailsPage/DetailsPage.jsx'
import CasePage from './CasePage/CasePage.jsx'
import CreateStructure from './CreateStructure/CreateStructure.jsx'
import ClearifyingQuestions from './ClearifyingQuestions/ClearifyingQuestions.jsx'
import MarketSizingList from './MarketSizingList/MarketSizingList.component';
import MarketSizing from './MarketSizing/MarketSizing.component';


export default function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>
                <Route exact path="/list/cases">
                    <ListPage />
                </Route>
                <Route exact path="/market-sizing/list">
                    <MarketSizingList />
                </Route>
                <Route exact path="/market-sizing/:id">
                    <MarketSizing />
                </Route>
                <Route exact path="/details/:id">
                    <DetailsPage />
                </Route>
                <Route exact path="/case/:id/:qID?">
                    <CasePage />
                </Route>
                <Route exact path="/create-structure/:id">
                    <CreateStructure />
                </Route>
                <Route exact path="/clearifying-questions/:id">
                    <ClearifyingQuestions />
                </Route>
              
            </Switch>
        </HashRouter>
    )
}
