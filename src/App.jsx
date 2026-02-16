import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import BoardsIndex from './components/BoardsIndex/BoardsIndex';
import BoardNew from './components/BoardNew/BoardNew';
import BoardShow from './components/BoardShow/BoardShow';
import BoardEdit from './components/BoardEdit/BoardEdit';




import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <main className="container">

        <Routes>
          <Route path='/' element={user ? <BoardsIndex /> : <Landing />} />
          <Route path='/sign-up' element={<SignUpForm />} />
          <Route path='/sign-in' element={<SignInForm />} />
          <Route path='/boards' element={user ? <BoardsIndex /> : <Landing />} />
          <Route path='/boards/new' element={user ? <BoardNew /> : <Landing />} />
          <Route path='/boards/:boardId' element={user ? <BoardShow /> : <Landing />} />
          <Route path='/boards/:boardId/edit' element={user ? <BoardEdit /> : <Landing />} />


        </Routes>
        </main>
      </>
      );
};

      export default App;
