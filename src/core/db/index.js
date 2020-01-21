import ObjectHash from 'object-hash';

export default class Database {
	name = "FinanceManager";
	_db = null;
	objectStoreNames = [
		'Transactions',
	];
	
	constructor() {
		const dbRequest = indexedDB.open(this.name);
		dbRequest.onerror = console.log;
		dbRequest.onsuccess = () => {
			this._db = dbRequest.result;
			
			this.objectStoreNames.forEach(ob => {
				this[ob] = {
					get: (input, callback) => {
						if (input instanceof Array)
							input = IDBKeyRange.bound(input[0], input[1])
						const getRequest = this._db.transaction(ob, "readwrite").objectStore(ob).get(input);
						
						getRequest.onsuccess = () => callback(getRequest.result);
					},
					put: input => {
						input._id = ObjectHash(input, {algorithm: 'sha1'});
						return this._db.transaction(ob, "readwrite").objectStore(ob).put(input);
					}
				}
			});
		};
		dbRequest.onupgradeneeded = () => {
			this._db = dbRequest.result;
			this.objectStoreNames.forEach(ob => {
				this._db.createObjectStore(ob, {keyPath: "_id"});
			})
		};
	};
	
	reset() {
		if (!window.confirm("Are you sure you want to delete all data?")) return;
		this.objectStoreNames.forEach(ob => this._db.deleteObjectStore(ob));
	}
	
	close() {
		this._db.close();
	}
}