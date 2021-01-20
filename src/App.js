import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser]=useState(
    {
     
      isSignedIn : false,
      name:'',
      email:'',
      photo:''


    }
  )

  const provider = new firebase.auth.GoogleAuthProvider();
    const signInHandle= ()=> {
      firebase.auth()
  .signInWithPopup(provider)
  .then(res =>{
    const { displayName,photoURL,email}=res.user;
    const signInUser ={
      isSignedIn : true,
      name : displayName,
      photo : photoURL,
      email : email
    }
    console.log(photoURL,displayName,email);
    setUser(signInUser);

    console.log(res);
      })

 .catch(err =>{
   console.log(err);
   console.log(err.message )
 })
    }

 const signOutHandle=()=>{
  firebase.auth().signOut()
  .then(res=>{
    const signOutUser={
      isSignedIn : false,
      name:'',
      email:'',
      photo:''
    }
    setUser(signOutUser)
  })
  .catch(err=>{
    console.log(err);
   console.log(err.message )
  }
    
    )
 }

  return (
    <div className="App">
      {
             user.isSignedIn ?  <button onClick={signOutHandle}>Sign out</button>:
             <button onClick={signInHandle}>Sign In</button>

      }
      
       {
            user.isSignedIn && <div>
                <p> Welcome, {user.name}</p>
                <p>your email : {user.email}</p>
                <img src={user.photo} alt=""/>

            </div>
                                  
       }
       <h1>Our Authentication</h1>
       <form action="">
        <input type="text" placeholder="Enter your email address" required/>
        <br/>
        <input type="password" placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="Submit"/>


       </form>
       
    </div>
  );
}

export default App;
