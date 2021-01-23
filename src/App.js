import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser]=useState(false);
  const [user,setUser]=useState(
    {
     
      isSignedIn : false,
      name:'',
      email:'',
      photo:'',
      error:'',
      success:false

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
 const handleChange=(e)=>{
      let isFormValid = true;
      if(e.target.name==='email'){
          isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
         
      }
      if(e.target.name==='password'){
          const isPasswordValid = e.target.value.length>6;
          const passwordHasNumber =  /\d{1}/.test(e.target.value)
          isFormValid= isPasswordValid  && passwordHasNumber ;
      }
      if (isFormValid){
        //[...cart,newItem]
        const newUserInfo ={...user}
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
      }

 }
 const handleSubmit=(e)=>{
   if(newUser && user.email && user.password){

    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(userCredential => {
    // Signed in 
    var user = userCredential.user;
    // ...
    const newUserInfo ={...user}
    newUserInfo.error='';
    newUserInfo.success = true;
    setUser(newUserInfo)

  })
  .catch(error => {
    const newUserInfo={...user}
    newUserInfo.error= error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
    // ..
  });

   }
   if(!newUser && user.email && user.password ){
        
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
    const newUserInfo ={...user}
    newUserInfo.error='';
    newUserInfo.success = true;
    setUser(newUserInfo)

  })
  .catch((error) => {
    const newUserInfo={...user}
    newUserInfo.error= error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });



   }
   e.preventDefault();
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
      
       <input type="checkbox"onChange={()=>setNewUser(!newUser)} name ="newUser"/>
        <label htmlFor="newUser" >New User sign up</label>
       <form onSubmit={handleSubmit}>
         
        
        {newUser && <input type="text" name="name" onBlur={handleChange} placeholder="Your name" />} 
         <br/>
        <input type="text" name="email" onBlur={handleChange} placeholder="Enter your email address" required/>
        <br/>
        <input type="password" name="password" onBlur={handleChange} placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value="Submit"/>


       </form>
       <p style={{color: 'red'}}>{user.error}</p>
      {
           user.success &&
      <p style={{color: 'green'}}>User {newUser ? 'Created' : 'logged In'} Successfully</p>} 
    </div>
  );
}

export default App;
