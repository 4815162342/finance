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
					get: input => {
						
					},
					put: input => {
						return this.db.transaction(ob, "readwrite").objectStore(ob).put(input);
					}
				}
			});
		};
		dbRequest.onupgradeneeded = () => {
			this.db = dbRequest.result;
			this.objectStoreNames.forEach(ob => {
				this.db.createObjectStore(ob, {keyPath: "_id", autoIncrement: true});
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