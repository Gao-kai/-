import './App.css';
import {Route,Link,BrowserRouter} from "react-router-dom";

function App() {
  return (
    <BrowserRouter basename='/react'>
      <Link to="/">React首页</Link>
      <Link to="/about">React关于</Link>

      <Route path="/" exact render={()=><h1>首页页面</h1>}></Route>
      <Route path="/about" render={()=><h1>关于页面</h1>}></Route>
      
    </BrowserRouter>
  );
}

export default App;
