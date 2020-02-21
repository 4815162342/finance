import ObjectHash from 'object-hash';

export default class Database {
	name = "FinanceManager";
	_db = null;
	objectStoreSchema = [{
		name: 'Transactions',
		indexes: [
			{name: 'transactionDate', path: 'date'},
			{name: 'amount', path: 'amount'},
			{name: 'recipient', path: 'recipient'},
			{name: 'sender', path: 'sender'},
		],
	}];
	
	constructor() {
		const dbRequest = indexedDB.open(this.name);
		dbRequest.onerror = console.log;
		dbRequest.onsuccess = () => {
			this._db = dbRequest.result;
			
			this.objectStoreSchema.forEach(ob => {
				this[ob.name] = {
					get: (qry, options, callback) => {
						const indexName = Object.keys(qry)[0];
						const objStore = this._db.transaction(ob.name, "readonly").objectStore(ob.name);
						if (!objStore.indexNames.contains(indexName)) return;
						
						const getRequest = objStore.index(indexName).getAll(qry[indexName], options.count || 5);
						
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
						}
					},
					put: input => {
						input._id = ObjectHash(input, {algorithm: 'sha1'});
						input.importedOn = new Date();
						
						return this._db.transaction(ob.name, "readwrite").objectStore(ob.name).put(input);
					},
					update: input => {
						return this._db.transaction(ob.name, "readwrite").objectStore(ob.name).put(input);
					},
				}
			});
		};
		dbRequest.onupgradeneeded = () => {
			this._db = dbRequest.result;
			this.objectStoreSchema.forEach(ob => {
				let objStore = this._db.createObjectStore(ob.name, {keyPath: "_id"});
				
				ob.indexes.forEach(index => {
					objStore.createIndex(index.name, index.path, {unique: !!index.isUnique});
				});
			})
		};
	};
	
	reset() {
		if (!window.confirm("Are you sure you want to delete all data?")) return;
		this.objectStoreSchema.forEach(ob => this._db.deleteObjectStore(ob.name));
	}
	
	close() {
		this._db.close();
	}
}