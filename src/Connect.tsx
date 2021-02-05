import React, { useContext } from "react";
import AppContext from "./AppContext";

const Connect = () => {
    const myContext = useContext(AppContext);

    return (
        <div style={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <button onClick={myContext.onConnect} style={{height: '36px'}}>{myContext.state.connected ? "Connected": "Connect"}</button>
        {myContext.state.connected && <button onClick={myContext.resetApp} style={{height: '36px'}}>Disconnect</button>}
        {myContext.state.connected && <span>{myContext.state.chainId}</span>}
      </div>
    )
}

export default Connect;