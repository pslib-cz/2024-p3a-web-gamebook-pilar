import './App.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import Game from './app/Game'
import Index from './app/Index'

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
  ])

  return (
    <>
      <h1>router</h1>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App;