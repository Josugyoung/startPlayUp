import ChatComponent from '../Component/ChatComponent'
import React, {useContext} from "react";
import styled, {createGlobalStyle} from "styled-components";
import reset from "styled-reset";
import thunderstorm from "../image/thunderstorm.jpg";
import LoginPageContainer from "./LoginPageContainer";
import {UserContext} from "../store";

const GlobalStyles = createGlobalStyle`
     ${reset};
     *:focus { outline:none; }
     body{
         //font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
         //font-size: 14px;
         //background-color: rgb(178, 199, 217); // 카카오톡 배경
         background-image:url(${thunderstorm})
     }
     img{
      width:20px;
      height:20px;
     }
     html{
      //overflow:hidden;
     }
 `;

const Main = styled.div`
  width:100%;
  height:100%;
  display: flex;
  justify-content: space-between;
`;

const Chat = styled(ChatComponent)`
  display:flex;
  justify-items: flex-end;
`;


function ChatContainer() {
    const {user, isAuthenticated, dispatch} = useContext(UserContext);
    return (
        <>
            <GlobalStyles image={thunderstorm}/>
            <Main>
                {!isAuthenticated && <LoginPageContainer/>}
                {isAuthenticated && <Chat/>}
            </Main>
        </>
    )
        ;
}

export default ChatContainer;
