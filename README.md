# Web3 Starter Pack

This package is a framework to create a simple web3 app that interfaces with the most popular web3 wallets.

This template uses the following tools:
* [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html)
* [Web3Modal](https://github.com/Web3Modal/web3modal)
* Typescript and React.Context

## Get started

1. Sign up for providers that require API keys (see Web3Modal documentation). Providers are saved in App.tsx. Remove the ones you don't want. MetaMask is supported by default.
2. Create .env file at root of the project and save the API keys into environment variables accordingly.
3. Run `yarn` to install dependencies.
4. Run `yarn start` to run the app in development.

## Access to state

In components requiring access to state, import useContext from React and AppContext from /src/AppContext.js. You can adjust these as needed. See src/Connect.tsx for an example. 

The app will automatically run the connect function silently if there is a cached provider (through useEffect in App.tsx). If there is no cached provider, the user will need to click a button to bring up the modal. Connect.tsx shows this process.