import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Projects from "./Pages/Projects"; 
import About from "./Pages/About";
import CategoryDetail from "./Pages/CategoryDetail";      
import ArticleDetail from "./Pages/ArticleDetail";
import ProjectDetail from "./Pages/ProjectDetail";  

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </>
  );
}

export default App;