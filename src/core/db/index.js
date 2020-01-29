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
						const getRequest = this._db.transaction(ob, "readwrite").objectStore(ob).openCursor(input);
						
						const result = [];
						getRequest.onsuccess = e => {
							const cursor = e.target.result;
							
							if (cursor) {
								result.push(cursor.value);
								cursor.continue();
							}
							else
								callback(result);
						}
					},
					put: input => {
						input._id = ObjectHash(input, {algorithm: 'sha1'});
						input.importedOn = new Date();
						
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