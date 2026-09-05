import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import { MyContext } from "./MyContext.jsx";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function App(){
  const [token,setToken]=useState(()=>localStorage.getItem("nexa_token"));
  const [user,setUser]=useState(null),[prompt,setPrompt]=useState(""),[reply,setReply]=useState(null),[currThreadId,setCurrThreadId]=useState(uuidv4());
  const [prevChats,setPrevChats]=useState([]),[newChat,setNewChat]=useState(true),[allThreads,setAllThreads]=useState([]),[isLoading,setIsLoading]=useState(false),[darkMode,setDarkMode]=useState(()=>localStorage.getItem("theme")!=="light"),[sidebarOpen,setSidebarOpen]=useState(true),[authChecking,setAuthChecking]=useState(Boolean(token));
  useEffect(()=>{document.body.classList.toggle("dark-mode",darkMode);document.body.classList.toggle("light-mode",!darkMode);localStorage.setItem("theme",darkMode?"dark":"light")},[darkMode]);
  useEffect(()=>{if(!token){setAuthChecking(false);return;} fetch(`${API_URL}/auth/me`,{headers:{Authorization:`Bearer ${token}`}}).then(async r=>{if(!r.ok)throw new Error();return r.json()}).then(d=>setUser(d.user)).catch(()=>{localStorage.removeItem("nexa_token");setToken(null)}).finally(()=>setAuthChecking(false))},[token]);
  const auth={token,user,setAuth:(t,u)=>{localStorage.setItem("nexa_token",t);setToken(t);setUser(u)},logout:()=>{localStorage.removeItem("nexa_token");setToken(null);setUser(null)}};
  const values=useMemo(()=>({prompt,setPrompt,reply,setReply,currThreadId,setCurrThreadId,newChat,setNewChat,prevChats,setPrevChats,allThreads,setAllThreads,isLoading,setIsLoading,darkMode,setDarkMode,sidebarOpen,setSidebarOpen,token,user,logout:auth.logout}),[prompt,reply,currThreadId,newChat,prevChats,allThreads,isLoading,darkMode,sidebarOpen,token,user]);
  if(authChecking)return <div className="bootScreen"><span className="brandMark">N</span><p>Loading Nexa…</p></div>;
  if(!token||!user)return <Auth onAuthenticated={auth.setAuth}/>;
  return <MyContext.Provider value={values}><div className="app"><Sidebar/><ChatWindow/></div></MyContext.Provider>;
}
export default App;
