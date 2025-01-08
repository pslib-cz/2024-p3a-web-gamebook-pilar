import './App.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import Game from './app/Game'
import Index from './app/Index'
import Minigame from './app/Minigame'
import { useEffect, useRef } from 'react'

function App() {
  const canvasRef = useRef(0);

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

  useEffect

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      {/* <canvas>
        
      </canvas> */}
    </>
  )
}

export default App;