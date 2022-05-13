import {useEffect, useState} from "react";
import {IndexedDBManager} from "./IndexedDB";

export const useIndexedDb = (dbName : string) => {
    const [db, setDb] = useState<IndexedDBManager>();

    useEffect(() => {
        openDb();
        return () => db?.close();
    })

    const openDb = () => {
        if (!window.indexedDB) {
            throw Error("indexedDB is not supported on this browser");
        }
        const openRequest = indexedDB.open(dbName);
        openRequest.onsuccess = () => {
            setDb(openRequest.result);
        }
    }
}