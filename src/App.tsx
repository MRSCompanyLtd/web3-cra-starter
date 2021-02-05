import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from "web3";
import Web3Modal from "web3modal";
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";
// @ts-ignore
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import Portis from "@portis/web3";
import AppContext from "./AppContext";
import Connect from "./Connect";

interface IAppState {
  fetching: boolean;
  address: string;
  web3: any;
  provider: any;
  connected: boolean;
  chainId: number;
  networkId: number;
  showModal: boolean;
  pendingRequest: boolean;
  result: any | null;
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  showModal: false,
  pendingRequest: false,
  result: null
};

function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

const App = () => {
  const [state, setState] = useState(INITIAL_STATE);

  const providerOptions =  {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURAID
      }
    },
    fortmatic: {
      package: Fortmatic,
      options: {
        key: process.env.REACT_APP_FORTMATIC
      }
    },
    torus: {
      package: Torus
    },
    authereum: {
      package: Authereum
    },
    portis: {
      package: Portis,
      options: {
        id: process.env.REACT_APP_PORTIS
      }
    }
  }

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect();
    }
  }, [])

  const web3Modal: Web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions: providerOptions,
    theme: "dark"
  })

  const onConnect = async () => {
    const provider = await web3Modal.connect().catch(err => console.log(err));
    if (!provider) {
      return
    }

    await subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await setState({
      ...state,
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId,
      fetching: false
    });
  }

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }

    provider.on("close", () => resetApp());

    provider.on("accountsChanged", async (accounts: string[]) => {
      setState({...state, fetching: true})
      if (accounts.length === 0) {
        return resetApp();
      }
      await setState({...state, address: accounts[0] });
      onConnect();
    });

    provider.on("chainChanged", async (chainId: number) => {
      setState({...state, fetching: true});
      await setState({...state, chainId });
      onConnect();
    });

    provider.on("networkChanged", async (networkId: number) => {
      setState({...state, fetching: true});
      await setState({...state, networkId });
      onConnect();
    });

    provider.on("disconnect", async () => {
      resetApp();
    })
  }

  const resetApp = async () => {
    const { web3 } = state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }

    await web3Modal.clearCachedProvider();
    setState({...INITIAL_STATE})
  }

  const globalSettings = {
    state,
    onConnect,
    resetApp
  }

  return (
    <AppContext.Provider value={globalSettings}>
      <Connect />
    </AppContext.Provider>
  )

}

export default App;
