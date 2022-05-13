import React, {FormEvent, useCallback, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import IndexedDB, {ObjectStore} from "./IndexedDB";

interface Movie {
  id : number;
  title : string;
  year : number;
}

interface Student {
    num : number;
    name : string;
}

function App() {
    const [db, setDb] = useState<IndexedDB>();
    const [studentStore, setStudentStore] = useState<ObjectStore<Student>>();
    const [students, setStudents] = useState<Student[]>([]);
    const [numValue, setNumValue] = useState<number>();
    const [nameValue, setNameValue] = useState<string>();

  useEffect(() => {
      openDb();
      return () => db?.close();
  }, [])

    const openDb = async() => {
      const openedDb = new IndexedDB('My DB');
      setDb(openedDb);
    }

    useEffect(() => {
        if (db) getStudentStore();
    }, [db])

    const getStudentStore = async() => {
        // @ts-ignore
        let store = db.getObjectStore('student');
        if (!store) {
            // @ts-ignore
            store = await db.createObjectStore<Student>('student', 'num');
        }
        setStudentStore(store);
    }

    useEffect(() => {
        if (studentStore) {
            getStudents();
        }
    }, [studentStore])

    const getStudents = async() => {
      // @ts-ignore
        const studentsData = await studentStore.getAllItems();
        setStudents(studentsData);
    }

    const addStudent = (student : Student) => {
      if (!studentStore) throw Error();
      studentStore.putItem(student);
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

    const onSubmit = (event : FormEvent) => {
      event.preventDefault();
      const student : Student = {
          num : numValue as number,
          name : nameValue as string
      }
      addStudent(student);
    }

  return (
    <div className="App">
        <form onSubmit={onSubmit}>
            <input type='number' value={numValue} onChange={() => setNumValue(numValue)} required/>
            <input type={'text'} value={nameValue} onChange={() => setNameValue(nameValue)} required />
            <button type={'submit'}>저장</button>
        </form>
      {/*<button type={"button"} onClick={onClick}>영화추가</button>*/}
      {/*<button type={"button"} onClick={clearMovies}>DB 초기화</button>*/}
        <ul>
            {students.map((student) => (
                <li key={student.num}>
                    <span>번호 : {student.num}</span>
                    <span>이름 : {student.name}</span>
                </li>
            ))}
        </ul>

      <div>
        {/*{db?.transaction('movies')?.objectStore('movies')?.getAll()?.onsuccess(e => {e.target.result.map(movie => {*/}
        {/*  <p>{movie.id}</p>*/}
        {/*})})}*/}
      </div>
    </div>
  );
}

export default App;
