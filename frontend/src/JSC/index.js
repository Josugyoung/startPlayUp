import React, { useContext } from "react";
import { Store, UserContext } from "./store"
import { Route, Switch, useHistory } from 'react-router-dom';
import LoginPageContainer from "./Container/LoginPageContainer";
import GlobalContainer from "./Container/GlobalContainer";
import ChatComponent from "./Component/ChatComponent";
import RockPaperScissors from "./Component/GameComponent/RockPaperScissors";
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import MineSearch from "JSC/Container/MineSearch";
import Yut from 'JSC/Container/Yut';

const GamePage = styled.div`
    display:flex;
    flex-direction:row;
`;

const TemporaryMain = () => {
    const history = useHistory();
    return (<div>
        <button onClick={() => history.push("/RockPaperScissors")}>RockPaperScissors</button>
        <button onClick={() => history.push("/MineSearch")}>MineSearch</button>
        <button onClick={() => history.push("/Yut")}>Yut</button>
    </div>)
}

function app() {
    const { isAuthenticated } = useContext(UserContext);
    return (
        <BrowserRouter>
            {/* <Route path="/" component={GlobalContainer} /> */}
            <Route exact path="/" component={LoginPageContainer} />
            {isAuthenticated && <Route exact path="/main" component={TemporaryMain} />}
            {isAuthenticated && <Route exact path="/RockPaperScissors" render={() => <GamePage>
                <RockPaperScissors />
                <ChatComponent />
            </GamePage>} />}
            {isAuthenticated && <Route exact path="/MineSearch" render={() => <GamePage>
                <MineSearch />
            </GamePage>} />}
            {isAuthenticated && <Route exact path="/Yut" render={() => <GamePage>
                <Yut />
                <ChatComponent />
            </GamePage>} />}
        </BrowserRouter>
    );
}

export default app;
