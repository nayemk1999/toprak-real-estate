import React, { useContext } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import jwt_decode from "jwt-decode";
import { firebaseConfig } from "../../firebaseConfig/firebaseConfig";
import toast from 'react-hot-toast';
import swal from 'sweetalert';

export const initializeLoginFramework = () => {
    !firebase.apps.length && firebase.initializeApp(firebaseConfig);
}

export const handleGoogleSignIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then(res => handleResponse(res))
}

const handleResponse = (res) => {
    fetchProfile(res.user)
    const { displayName, photoURL, email } = res.user;
    const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL || "https://i.ibb.co/7CzR0Dg/users.jpg"
    }
    return signedInUser;
}

export const signInWithEmailAndPassword = (email, password) => {
    return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => handleResponse(res))
}

export const setJWTToken = () => {
    return firebase
        .auth().currentUser
        .getIdToken(true)
        .then(idToken => {
            localStorage.setItem('token', idToken)
        })
}
export const setUserInfo = (props) => {
    return localStorage.setItem('user', JSON.stringify(props))
}


export const getDecodedUser = () => {
    // const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userData = JSON.parse(user)
    if (!userData) {
        return {};
    }
    
    // console.log(userData);
    const { name, picture, email, photo } = userData;
    const decodedUser = {
        isSignedIn: true,
        name: name,
        email: email,
        photo: picture || photo || "https://i.ibb.co/7CzR0Dg/users.jpg"
    }
    return decodedUser;
}


export const handleSignOut = () => {
    initializeLoginFramework()
    return firebase
        .auth()
        .signOut()
        .then(() => {
            localStorage.removeItem('token'); 
            localStorage.removeItem('user'); 
            const signedOutUser = {
                
            }
            return signedOutUser;
        })
        .catch(error => console.log(error.message))
}

export const fetchProfile = (props) => {
    const { displayName, photoURL, email } = props;
    const profileData = {
        name: displayName || props.name,
        email: email || props.email,
        password: props.password,
        photo: photoURL || props.photo
    }

    const loading = toast.loading('Adding...Please wait!');
    const url = 'https://toprak-real.herokuapp.com/profile-data'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(profileData)
    })
        .then(res => {
            if (res) {
                toast.dismiss(loading);
                // reset();
                return swal(`Successfully ${displayName || props.email ? 'Login' : 'Sign Up!'}`, ` Welcome`);
            }
            swal("Failed!", "Something went wrong! Please try again.", "error", { dangerMode: true });
        })
}