import ChatField from './chatField/ChatField'
import React from "react";
import styled, {createGlobalStyle} from "styled-components";
import reset from "styled-reset";
import thunderstorm from "../image/thunderstorm.jpg";

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
const Chat = styled.div`

`;
const Main = styled.div`
  width:100%;
  height:100%;
  display: flex;
  justify-content: flex-end;
`;

function App() {
    return (
        <>
            <GlobalStyles image={thunderstorm}/>
            <Main>
                <ChatField/>
            </Main>
        </>
    );
}

export default App;
