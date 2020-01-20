import ObjectHash from 'object-hash';

export default class Database {
	name = "FinanceManager";
	db = null;
	objectStoreNames = [
		'Transactions',
	];
	
	constructor() {
		const dbRequest = indexedDB.open(this.name);
		dbRequest.onerror = console.log;
		dbRequest.onsuccess = () => {
			this.db = dbRequest.result;
			
			this.objectStoreNames.forEach(ob => {
				this[ob] = {
					get: (input, callback) => {
						if (input instanceof Array)
							input = IDBKeyRange.bound(input[0], input[1])
						const getRequest = this.db.transaction(ob, "readwrite").objectStore(ob).get(input);
						
						getRequest.onsuccess = () => callback(getRequest.result);
					},
					put: input => {
						input._id = ObjectHash(input, {algorithm: 'sha1'});
						return this.db.transaction(ob, "readwrite").objectStore(ob).put(input);
					}
				}
			});
		};
		dbRequest.onupgradeneeded = () => {
			this.db = dbRequest.result;
			this.objectStoreNames.forEach(ob => {
				this.db.createObjectStore(ob, {keyPath: "_id"});
			})
		};
	};
	
	reset() {
		if (!window.confirm("Are you sure you want to delete all data?")) return;
		this.objectStoreNames.forEach(ob => this.db.deleteObjectStore(ob));
	}
	
	close() {
		this.db.close();
	}
}