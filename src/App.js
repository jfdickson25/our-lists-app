import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route, 
  Navigate,
  Routes
} from 'react-router-dom';

const Home = lazy(() => import('./Pages/Home'));
const CreateJoin = lazy(() => import('./Pages/CreateJoin'));
const Lists = lazy(() => import('./Pages/Lists'));
const List = lazy(() => import('./Pages/List'));
const Loading = lazy(() => import('./Shared/Loading'));

const createImg = 'https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/create-svg.svg?v=1703821536319';
const joinImg = 'https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/join-svg.svg?v=1703822146882';

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading className='page-loading' size={100} />}>
        <Routes>
          <Route path="/our-lists-app/createList" element={<CreateJoin storyImg={createImg} pageType='string' />} exact />
          <Route path="/our-lists-app/joinList" element={<CreateJoin storyImg={joinImg} pageType='number' />} exact />
          <Route path="/our-lists-app/myLists" element={<Lists />} exact />
          <Route path="/our-lists-app/list/:id" element={<List />} exact />
          <Route path="/our-lists-app" element={<Home />} exact />
          <Route path="*" element={<Navigate to="/our-lists-app" />} />
        </Routes>
      </Suspense>
    </Router>

  );
}

export default App;
