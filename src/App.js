import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Home,EditorPage} from './pages';
import {Toaster} from 'react-hot-toast';
function App() {
  return (
    <>
    <div>
      <Toaster
      position="top-right"
      toastOptions={{
        success:{
          theme:{
            primary:'#0000FF',
          },
        }
      }}
      ></Toaster>
    </div>
    <Router>
      <Routes>
        <Route path = "/" element = {<Home />}> </Route>
        <Route path = "/editor/:roomId" element = {<EditorPage />}></Route>
      </Routes>
    </Router>

    </>
  );
}

export default App;
