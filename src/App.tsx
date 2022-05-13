import React, {useCallback, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import IndexedDB from "./IndexedDB";

interface Movie {
  id : number;
  title : string;
  year : number;
}

function App() {
  const [db, setDb] = useState<IndexedDB>();

  useEffect(() => {
    const idb = new IndexedDB('Test DataBase');
    setDb(idb);
  }, [])

  const seeMovies = async() => {
    const sampleMovies : Movie[] = [
        {
          id : 300,
          title : "new movie",
          year : 2019
        },
        {
          id : 305,
          title : "bye",
          year : 2003
        }
      ];
    const a = await db?.getAllItems('movies')
    console.log(a, "LALLA");
  }
  // const [db, setDb] = useState<IDBDatabase>();
  // const [movies, setMovies] = useState<Movie[]>();
  // const [inTransaction, setInTransation] = useState<boolean>(false);
  //
  // useEffect(() => {
  //   openDB();
  //   return () => closeDB();
  // }, [])
  //
  // useEffect(() => {
  //   if (db) getMoviesFromDB();
  // }, [db])
  //
  //
  // const openDB = () => {
  //   if (!window.indexedDB) {
  //     alert("해당 플랫폼에서는 DB를 사용할 수 없습니다.");
  //     return ;
  //   }
  //   const open = indexedDB.open("Test DataBase", 1);
  //   open.onerror = () => alert("DB version compatibility error");
  //   open.onsuccess = () => {
  //     console.log(open.result);
  //     setDb(open.result)
  //   };
  //   open.onupgradeneeded = (event) => {
  //     const db = open.result;
  //     if (event.oldVersion < 1) {
  //       createMovieObjectStore(db);
  //     }
  //   };
  // }
  //
  // const createMovieObjectStore = (db : IDBDatabase) => {
  //   const store = db.createObjectStore('movies', {keyPath : "id"});
  //   store.createIndex('id', 'id', {unique : true});
  //   store.createIndex('title', 'title');
  //   store.createIndex('year', 'year');
  // };
  //
  // const closeDB = () => {
  //   db?.close();
  // }
  //
  // const getMoviesFromDB = () => {
  //   if (!db) return;
  //   // const moviesFromDB = db.transaction('movies').objectStore('movies').getAll();
  //   const store = db.transaction('movies').objectStore('movies');
  //   if ('getAll' in store) {
  //     store.getAll().onsuccess
  //   }
  //   console.log(moviesFromDB, "까보자까보자");
  //   // setMovies(moviesFromDB);
  // }
  //
  // const writeMovies = async(newMovies : Movie[]) => {
  //   if (!db) return;
  //   const transaction = db.transaction('movies', 'readwrite');
  //   console.log(transaction);
  //   transaction.oncomplete = () => {
  //     console.log('we made it');
  //   };
  //   transaction.onerror = (e) => console.log('error', e);
  //
  //   const store = await transaction.objectStore('movies');
  //   newMovies.forEach(movie => {
  //     const request = store.add(movie)
  //   })
  // }
  //
  // const onClick = () => {
  //   const sampleMovies : Movie[] = [
  //     {
  //       id : 300,
  //       title : "new movie",
  //       year : 2019
  //     },
  //     {
  //       id : 305,
  //       title : "bye",
  //       year : 2003
  //     }
  //   ]
  //   writeMovies(sampleMovies);
  // }
  //
  // const clearMovies = () => {
  //   if (!db) return
  //   const transaction = db.transaction('movies');
  //   const store = transaction.objectStore('movies');
  //   console.log("before clear", db)
  //   const clearRequest = store.clear();
  //   clearRequest.onsuccess = () => {console.log("cleared")};
  //   console.log("after clear", db)
  // }
  //


  return (
    <div className="App">
      {/*<button type={"button"} onClick={onClick}>영화추가</button>*/}
      {/*<button type={"button"} onClick={clearMovies}>DB 초기화</button>*/}
      <button type={'button'} onClick={seeMovies}>보기</button>
      <div>
        {/*{db?.transaction('movies')?.objectStore('movies')?.getAll()?.onsuccess(e => {e.target.result.map(movie => {*/}
        {/*  <p>{movie.id}</p>*/}
        {/*})})}*/}
      </div>
    </div>
  );
}

export default App;
