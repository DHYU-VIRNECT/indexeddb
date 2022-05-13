//have
//to
//add
//comments

export class IndexedDBManager {
    private objectStores : Record<string, ObjectStore<any>> = {}; // { $storeName : $ObjectStoreInstance }

    constructor(private db : IDBDatabase) {
    }

    public close() {
        this.db?.close();
    }

    public async createObjectStore<T>(storeName : string, keyPath : string | string[]) {
        const objectStore = new ObjectStoreManager(storeName, keyPath, this.db);
        this.objectStoreManagers[storeName] = objectStore;
        return objectStore;
        // createIndexParams.forEach((createIndexParam) => {
        //     store.createIndex(createIndexParam.name, createIndexParam.keyPath, createIndexParam.options)
        // });
    }

    public getObjectStore(storeName : string) {
        const objectStore = this.objectStores[storeName];
        return objectStore
    }

    // public async createIndex(storeName : string, indexName : string, options:IDBIndexParameters={}) {
    //     if (!this.db) throw Error("DB doesn't exist");
    //     const objectStore = this.objectStores[storeName];
    //     if (!objectStore) throw Error("store with the name doesn't exist");
    //     objectStore.createIndex(indexName, options);
    //     // const transaction = this.db.transaction(storeName);
    //     // if (!(storeName in transaction.objectStoreNames)) {
    //     //     throw Error("Object Store with the name doesn't exist");
    //     // }
    //     // const store = transaction.objectStore(storeName);
    //     // if (indexName in store.indexNames) {
    //     //     throw Error("Already have an index of the field")
    //     // }
    //     // store.createIndex(indexName, indexName, options);
    // }
    //
    // public async getItem(storeName : string, key : any) {
    //     // if (!this.db) throw Error("DB doesn't exist");
    //     // const transaction = this.db.transaction(storeName, "readonly");
    //     // const store = transaction.objectStore(storeName);
    //     const store = this.getStoreToRead(storeName);
    //     return store.get(key);
    // }
    //
    // public async getAllItems(storeName : string, options : GetAllItemsOptions = {}) {
    //     const promise = new Promise((resolve) => {
    //         const store = this.getStoreToRead(storeName);
    //         const getRequest = store.getAll(options.query, options.count);
    //         getRequest.onsuccess = () => {
    //             resolve(getRequest.result);
    //         }
    //     })
    //     return await promise
    // }
    //
    // private getStoreToRead(storeName : string) {
    //     return this.getStore(storeName)
    //     // if (!this.db) throw Error("DB doesn't exist");
    //     // const transaction = this.db.transaction(storeName, "readonly");
    //     // const store = transaction.objectStore(storeName);
    // };
    //
    // public async putItem(storeName : string, item : object) {
    //     const store = this.getStoreToWrite(storeName);
    //
    //     if (!this.itemContainsStoreKeyPath(store, item)) throw Error('key is missing')
    //     await store.put(item);
    // }
    //
    // public async putItems(storeName : string, items : object[]) {
    //     const store = this.getStoreToRead(storeName);
    //     const promises = items.map(async(item) => {
    //         if (!this.itemContainsStoreKeyPath(store, item)) throw Error('key is missing')
    //         await store.put(item);
    //     })
    //     await Promise.all(promises);
    // }
    //
    // private itemContainsStoreKeyPath(store : IDBObjectStore, item : object) {
    //     if (typeof store.keyPath === "string") return item.hasOwnProperty(store.keyPath);
    //     return store.keyPath.every(key => item.hasOwnProperty(key))
    // }
    //
    // public async updateItem(storeName : string, item : object) {
    //     //have to check if item was existing
    //     //get keyPath and store.get({key : item[key] ...})
    //    const store = this.getStoreToWrite(storeName);
    // }
    //
    // private getStoreToWrite(storeName : string) {
    //     return this.getStore(storeName, "readwrite")
    // }
    //
    // private getStore(storeName : string, mode : IDBTransactionMode = "readonly") {
    //     if (!this.db) throw Error("DB doesn't exist");
    //     const transaction = this.db.transaction(storeName, mode);
    //     return transaction.objectStore(storeName)
    // }
}

export class ObjectStore<T extends Record<string, any>> {
    private keyPath : string | string[];

    constructor(private storeName : string, keyPath : keyof T | (keyof T)[], private db : IDBDatabase) { //create object store
        this.keyPath = keyPath as string | string[];
        try {
            this.db.createObjectStore(storeName, {keyPath : this.keyPath})
        } catch (error) {
            //constraintError인 경우에는 그냥 냅둬도 될듯
        }
    }

    public async createIndex(indexName : keyof T, options : IDBIndexParameters={}) {
        // const transaction = this.getTransaction();
        // const store = transaction.objectStore(this.storeName);
        const store = this.getObjectStore();
        if (indexName in store.indexNames) {
            throw Error("Already have an index of the field")
        }
        store.createIndex(indexName as string, indexName as string, options)
    }

    public async getItem(key : any) {
        const store = this.getObjectStore();
        return store.get(key);
    }

    public async getAllItems(options : GetAllItemsOptions = {}) : Promise<T[]> {
        const promise = new Promise((resolve) => {
            const store = this.getObjectStore();
            const getRequest = store.getAll(options.query, options.count);
            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            }
        })
        const items = await promise;
        return items as T[]
    }

    public async putItem(item : T) {
        const store = this.getObjectStore('readwrite');
        await store.put(item);
    }

    public async putItems(items : T[]) {
        const store = this.getObjectStore('readwrite');
        const promises = items.map(async(item) => {
            await store.put(item);
        })
        await Promise.all(promises);
    }

    public async updateItem(item : T) {
        const store = this.getObjectStore('readwrite');
        const itemKey = this.getKeyFromItem(item);
        const originalItem = await this.getItem(itemKey);
        if (!originalItem) throw Error('cannot find item to edit');
        await store.put(item);
    }

    private getKeyFromItem(item : T) {
        if (typeof this.keyPath === "string") {
            // @ts-ignore
            return item[this.keyPath]
        } else {
            // @ts-ignore
            return this.keyPath.map(key => item[key]);
        }
    }

    public async deleteItem(key : any) {
        const store = this.getObjectStore('readwrite');
        await store.delete(key);
    }

    private getObjectStore(mode : IDBTransactionMode = "readonly") {
        const transaction = this.getTransaction(mode);
        const store = transaction.objectStore(this.storeName);
        return store
    }

    private getTransaction(mode : IDBTransactionMode = "readonly") {
        const transaction = this.db.transaction(this.storeName, mode);
        return transaction
    }
}
//
// interface CreateIndexParam  {
//     name: string;
//     keyPath: string | Iterable<string>;
//     options?: IDBIndexParameters;
// }

interface GetAllItemsOptions {
    query?: IDBValidKey | IDBKeyRange;
    count?: number;
}

export default IndexedDB;