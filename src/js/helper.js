// contain some function that are resuable in the project
//centralization fo reusable functions

import {TIMEOUT_SEC} from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

//refactored getJson and sendJson functions 
// uploadData is when you are trying to add a recipe, else request data from the API
  export const AJAX = async function(url, uploadData = undefined){
    try{
      const fetchPro = uploadData ? fetch(url,{ 
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(uploadData)}) : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json(); 

    if(!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;

    }catch(err){
        throw err;
    }
};


// getJson and sendJson
/*
export const getJson = async function(url){
    try{
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json(); 

    if(!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;

    }catch(err){
        throw err;
    }
};

export const sendJson = async function(url, uploadData){
  try{
    //POST request to an API requires another parameter for the fetch method
  const res = await Promise.race(
    [fetch(url,{ 
      method: 'POST',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify(uploadData)
  })
  , timeout(TIMEOUT_SEC)]);
  const data = await res.json(); 

  if(!res.ok) throw new Error(`${data.message} (${res.status})`);

  return data;

  }catch(err){
      throw err;
  }
};*/