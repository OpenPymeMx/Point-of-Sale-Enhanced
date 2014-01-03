/* The db module was intended to be used to store all the data needed to run the Point of Sale.
 */

function pos_restaurant_db (instance,module){
    // Setting Use strict
    "use strict";
    
    // Extending db module with tables related functions 
    module.PosLS = module.PosLS.extend({
        /**
         * Return a list for all tables
         */
        get_table_list: function(){
            var list = [],
                stored_tables = this.load('tables',{});
            for (var i in stored_tables) {
                list.push(stored_tables[i]);
            }
            return list;
        },
        /**
         * Return a table by id
         */
        get_table_by_id: function(id){
            return this.load('tables',{})[id];
        },
        /**
         * Add tables to local datastore
         */
        add_tables: function(tables){
            var stored_tables = this.load('tables',{}); 

            if(!tables instanceof Array){
                tables = [tables];
            }
            for(var i = 0, len = tables.length; i < len; i++){
                var t = tables[i];
                stored_tables[t.id] = t;
            }
            this.save('tables',stored_tables);
        },
    });

};