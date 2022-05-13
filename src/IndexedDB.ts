//have
//to
//add
//comments

class IndexedDB {
    private name : string;
    private db : IDBDatabase | undefined;

    constructor(name : string) {
        if (!window.indexedDB) throw Error("indexedDB not supported on this platform");
        this.name = name;
        this.open();
    }

    private open() {
        const openRequest = indexedDB.open(this.name);
        openRequest.onsuccess = () => {
            this.db = openRequest.result;
        };
    }

    public close() {
        this.db?.close();
    }

    public async createObjectStore<T>(storeName : string, keyPath : string | string[], createIndexParams : CreateIndexParam[]) {
        if (!this.db) throw Error("DB doesn't exist");
        const store = this.db.createObjectStore(storeName, {keyPath});
        // createIndexParams.forEach((createIndexParam) => {
        //     store.createIndex(createIndexParam.name, createIndexParam.keyPath, createIndexParam.options)
        // });
    }

    public async createIndex(storeName : string, indexName : string, options:IDBIndexParameters={}) {
        if (!this.db) throw Error("DB doesn't exist");
        const transaction = this.db.transaction(storeName);
        if (!(storeName in transaction.objectStoreNames)) {
            throw Error("Object Store with the name doesn't exist");
        }
        const store = transaction.objectStore(storeName);
        if (indexName in store.indexNames) {
            throw Error("Already have an index of the field")
        }
        store.createIndex(indexName, indexName, options);
    }

    public async getItem(storeName : string, key : any) {
        // if (!this.db) throw Error("DB doesn't exist");
        // const transaction = this.db.transaction(storeName, "readonly");
        // const store = transaction.objectStore(storeName);
        const store = this.getStoreToRead(storeName);
        return store.get(key);
    }

    public async getAllItems(storeName : string, options : GetAllItemsOptions = {}) {
        const promise = new Promise((resolve) => {
            const store = this.getStoreToRead(storeName);
            const getRequest = store.getAll(options.query, options.count);
            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            }
        })
        return await promise
    }

    private getStoreToRead(storeName : string) {
        return this.getStore(storeName)
        // if (!this.db) throw Error("DB doesn't exist");
        // const transaction = this.db.transaction(storeName, "readonly");
        // const store = transaction.objectStore(storeName);
    };

    public async putItem(storeName : string, item : object) {
        const store = this.getStoreToWrite(storeName);

        if (!this.itemContainsStoreKeyPath(store, item)) throw Error('key is missing')
        await store.put(item);
    }

    public async putItems(storeName : string, items : object[]) {
        const store = this.getStoreToRead(storeName);
        const promises = items.map(async(item) => {
            if (!this.itemContainsStoreKeyPath(store, item)) throw Error('key is missing')
            await store.put(item);
        })
        await Promise.all(promises);
    }

    private itemContainsStoreKeyPath(store : IDBObjectStore, item : object) {
        if (typeof store.keyPath === "string") return item.hasOwnProperty(store.keyPath);
        return store.keyPath.every(key => item.hasOwnProperty(key))
    }

    public async updateItem(storeName : string, item : object) {
        //have to check if item was existing
        //get keyPath and store.get({key : item[key] ...})
       const store = this.getStoreToWrite(storeName);
    }

    private getStoreToWrite(storeName : string) {
        return this.getStore(storeName, "readwrite")
    }

    private getStore(storeName : string, mode : IDBTransactionMode = "readonly") {
        if (!this.db) throw Error("DB doesn't exist");
        const transaction = this.db.transaction(storeName, mode);
        return transaction.objectStore(storeName)
    }
}

// classObjectStoreMana

interface CreateIndexParam  {
    name: string;
    keyPath: string | Iterable<string>;
    options?: IDBIndexParameters;
}

interface GetAllItemsOptions {
    query?: IDBValidKey | IDBKeyRange;
    count?: number;
}

export default IndexedDB;