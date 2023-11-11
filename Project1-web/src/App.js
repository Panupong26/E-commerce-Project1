import './App.css';
import Home from './page/Home.js';
import Register from './page/Register';
import Login from './page/Login';
import Shop from './page/Shop';
import Product from './page/Product';
import Profile from './page/Profile';
import SellerAddProduct from './page/SellerAddProduct';
import AdminIndex from './page/AdminIndex';
import AdminOrderPage from './page/AdminOrderPage';
import AdminBillPage from './page/AdminBillPage';
import AdminProductPage from './page/AdminProductPage';
import Verification from './page/Varification';
import CheckEmail from './page/CheckEmail';
import Reset from './page/Reset';
import AdminForgotten from './page/AdminForgotten';
import Forgotten from './page/Forgotten';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { authContext } from './context/AuthContextProvider';
import { useContext } from 'react';
import NavBar from './component/NavBar';
import Loading from './page/Loading';
import ErrorPage from './page/ErrorPage';
import { loadingContext } from './context/LoadingContextProvider';



function App() {
  const { status } = useContext(authContext);
  const { isLoading } = useContext(loadingContext);



  if(status === 'guest') {
    return (
      <BrowserRouter>
        {isLoading && <Loading/>}
        <NavBar/>
        <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/verification' element={<Verification />}/>
          <Route path='/seller/register' element={<Register/>}/>
          <Route path='/admin/register' element={<Register/>}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/seller' element={<Login/>}/>
          <Route path='/admin' element={<Login />}/>
          <Route path='/admin/forgotten' element={<AdminForgotten/>}/>
          <Route path='/forgotten' element={<Forgotten/>}/>
          <Route path='/seller/forgotten' element={<Forgotten/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/checkemail' element={<CheckEmail/>}/>
          <Route path='/shop/:shopName' element={<Shop />} />
          <Route path='/home' element={<Home />} />
          <Route path='/product/:id' element={<Product />}/>
          <Route path='/error/:code' element={<ErrorPage />}/>
          <Route path='/error/:code/:msg' element={<ErrorPage />}/>
          <Route path='*' element = {<Navigate to={'/home'}/>}/>
        </Routes>
      </BrowserRouter>
    );
  } else if(status === 'user') {
    return (
      <BrowserRouter>
        {isLoading && <Loading/>}
        <NavBar/>
        <Routes>
          <Route path='/shop/:shopName' element={<Shop />}/>
          <Route path='/home' element={<Home />} />
          <Route path='/checkemail' element={<CheckEmail/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/product/:id' element={<Product />} />
          <Route path='/profile/:page' element={<Profile/>} />
          <Route path='/login' element = {<Navigate to={'/home'}/>}/>
          <Route path='/error/:code' element={<ErrorPage />}/>
          <Route path='/error/:code/:msg' element={<ErrorPage />}/>
          <Route path='*' element = {<Navigate to={'/home'}/>}/>
        </Routes>
      </BrowserRouter>
    );
  } else if(status === 'seller') {
    return (
      <BrowserRouter>
        {isLoading && <Loading/>}
        <NavBar/>
        <Routes>
          <Route path='/mystore' element={<Shop/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/checkemail' element={<CheckEmail/>}/>
          <Route path='/product/:id/' element={<Product/>}/>
          <Route path='/product/:id/:option' element={<Product/>}/>
          <Route path='/profile/:page' element={<Profile/>}/>
          <Route path='/addproduct' element={<SellerAddProduct/>}/>
          <Route path='/error/:code' element={<ErrorPage />}/>
          <Route path='/error/:code/:msg' element={<ErrorPage />}/>
          <Route path='*' element = {<Navigate to={'/mystore'}/>}/>
        </Routes>
      </BrowserRouter>
    );
  } else if(status === 'admin') {
    return (
      <BrowserRouter>
        {isLoading && <Loading/>}
        <NavBar/>
        <Routes>
          <Route path='/index' element={<AdminIndex/>}/>
          <Route path='/orders' element={<AdminOrderPage/>}/>
          <Route path='/bills' element={<AdminBillPage/>}/>
          <Route path='/checkemail' element={<CheckEmail/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/manageproduct' element={<AdminProductPage/>}/>
          <Route path='/shop/:shopName' element={<Shop />}/>
          <Route path='/product/:id/' element={<Product />}/>
          <Route path='/error/:code' element={<ErrorPage />}/>
          <Route path='/error/:code/:msg' element={<ErrorPage />}/>
          <Route path='*' element = {<Navigate to={'/index'}/>}/>
        </Routes>
      </BrowserRouter>
    );
  }
};

export default App;
