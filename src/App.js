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

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
    const signInHandle= ()=> {
      firebase.auth()
  .signInWithPopup(googleProvider)
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
 const fbSignInHandle=()=>{

  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    //** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
   var accessToken = credential.accessToken;
            

    // The signed-in user info.
    var user = result.user;
    console.log('fb user after sign In', user);

   

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });


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
  .then(res => {
    // Signed in 
    //var users = userCredential.user;
    // ...
    const newUserInfo ={...user}
    newUserInfo.error='';
    newUserInfo.success = true;
    setUser(newUserInfo);
    updateUserName(user.name);
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
  .then(res => {
    // Signed in
    //var users = userCredential.user;
    // ...
    const newUserInfo ={...user}
    newUserInfo.error='';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log('sign In user info',res.user);

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

 const updateUserName=name=>{
  var user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: name,
    
  }).then(function() {
    console.log('Updated..')
  }).catch(function(error) {
    console.log(error)
  });
 }
  return (
    <div className="App">
      {
             user.isSignedIn ?  <button onClick={signOutHandle}>Sign out</button>:
             <button onClick={signInHandle}>Google Sign In</button>

      }
      <button onClick={fbSignInHandle} >Facebook sign In</button>
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
        <input type="submit" value={newUser ? 'sign up' : 'sign In'}/>


       </form>
       <p style={{color: 'red'}}>{user.error}</p>
      {
           user.success &&
      <p style={{color: 'green'}}>User {newUser ? 'Created' : 'logged In'} Successfully</p>} 
    </div>
  );
}

export default App;
