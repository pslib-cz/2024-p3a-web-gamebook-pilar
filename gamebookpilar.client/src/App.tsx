import './App.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import Game from './app/Game'
import Index from './app/Index'
import Minigame from './app/Minigame'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/game",
      element: <Game />,
      children: [
        {
          path: "/game/:receivedGameKey",
          element: <Game />,
        },
      ]
    },
    {
      path: "/minigame",
      element: <Minigame />
    }
  ])

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App;