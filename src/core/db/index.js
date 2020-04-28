import ObjectHash from 'object-hash';

class ObjectStore {
	name = "";
	_os = null;
	_indexes = [];
	_db = null;
	_eventBus = [];
	
	constructor(name, indexes, db) {
		this.name = name;
		this._indexes = indexes;
		this._db = db;
	}
	// DB often isn't initialized when ObSt is created
	_setDb (db) {
		this._db = db;
	};
	get (qry, options, callback) {
		const indexName = Object.keys(qry)[0];
		const objStore = this._db.transaction(this.name, "readonly").objectStore(this.name);
		if (!objStore.indexNames.contains(indexName)) {
			throw new Error(`unknown field ${indexName}`);
		}
		
		const getRequest = objStore.index(indexName).getAll(qry[indexName], options.count || 5000);
		
		const result = [];
		getRequest.onsuccess = e => {
			const cursor = e.target.result;
			
			if (cursor) {
				callback(cursor);
				//result.push(cursor.value);
				//cursor.continue();
			}
			else
				callback(result);
		};
		
		getRequest.onerror = console.log;
	};
	put(input) {
		if (!input._id) input._id = ObjectHash(input, {algorithm: 'sha1'});
		if (!input.importedOn) input.importedOn = new Date();
		
		this._db.transaction(this.name, "readwrite").objectStore(this.name).put(input);
		
		this._executeBus('put', input);
	};
	update (_id, operation) {
		const obStore = this._db.transaction(this.name, "readwrite").objectStore(this.name);
		const getRequest = obStore.get(_id);
		
		getRequest.onsuccess = () => {
			const newRecord = {...getRequest.result, ...operation.$set};
			obStore.put(newRecord);
			this._executeBus('update', newRecord);
		}
	};
	_executeBus(type, data) {
		this._eventBus.forEach(listener => {
			if (listener.type !== type) return;
			listener.fn(data);
		})
	};
	registerListener(listener) {
		this._eventBus.push(listener);
	};
	deregisterListener({name}) {
		this._eventBus = this._eventBus.filter(l => l.name === name);
	}
}

export default class Database {
	name = "";
	_db = null;
	_objectStoreSchema = [];
	
	constructor(schema) {
		this.name = schema.name;
		this._objectStoreSchema = schema.objectStoreSchema;
		
		this._objectStoreSchema.forEach(ob => {
			this[ob.name] = new ObjectStore(ob.name, ob.indexes, null);
		});
		
		const dbRequest = indexedDB.open(this.name);
		dbRequest.onerror = console.log;
		dbRequest.onsuccess = () => {
			this._db = dbRequest.result;
			
			this._objectStoreSchema.forEach(ob => {
				this[ob.name]._setDb(this._db);
			});
		};
		dbRequest.onupgradeneeded = () => {
			this._db = dbRequest.result;
			this._objectStoreSchema.forEach(ob => {
				let objStore = this._db.createObjectStore(ob.name, {keyPath: "_id"});
				
				ob.indexes.forEach(index => {
					objStore.createIndex(index.name, index.path, {unique: !!index.isUnique});
				});
			})
		};
	};
	
	reset() {
		if (!window.confirm("Are you sure you want to delete all data?")) return;
		this._objectStoreSchema.forEach(ob => this._db.deleteObjectStore(ob.name));
	}
	
	close() {
		this._db.close();
	}
}