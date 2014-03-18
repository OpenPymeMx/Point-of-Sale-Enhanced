/*jshint plusplus: true */
/**
 * This file adds the models needed to load the table info in backbone
 */
/* The db module was intended to be used to store all the data needed to run the Point of Sale.
 */

function pos_restaurant_models (instance, module){
    // Setting Use strict
    "use strict";
    
    /*
     * Store a version of PosModel.initialize to call from the
     * modified version we create
     */
    module.PosRestaurantModel = module.PosModel;
    module.PosModel = module.PosRestaurantModel.extend({
        // Extend the create_order function for add table information
        create_order: function(order){
            var self = this,
                model = null;
            this._super(order);
            model = self.get('selectedOrder');
            self.fetch('pos.order', ['table_id'], [['id', '=', model.get('order_id')]])
                .then(function(table_data) {
                    var table = self.db.get_table_by_id(table_data[0].table_id[0]);
                    model.setTable(table);
                    //Set current order screen to products
                    model.set_screen_data('cashier_screen','products');
                });
        },
        
        // TODO: Find a way to extend this function properly 
        load_server_data: function(){
            var self = this,

            loaded = self.fetch('res.users',['name','company_id'],[['id','=',this.session.uid]]) 
                .then(function(users){
                    self.set('user',users[0]);

                    return self.fetch('res.company',
                    [
                        'currency_id',
                        'email',
                        'website',
                        'company_registry',
                        'vat',
                        'name',
                        'phone',
                        'partner_id',
                    ],
                    [['id','=',users[0].company_id[0]]]);
                }).then(function(companies){
                    self.set('company',companies[0]);

                    return self.fetch('res.partner',['contact_address'],[['id','=',companies[0].partner_id[0]]]);
                }).then(function(company_partners){
                    self.get('company').contact_address = company_partners[0].contact_address;

                    return self.fetch('res.currency',['symbol','position','rounding','accuracy'],[['id','=',self.get('company').currency_id[0]]]);
                }).then(function(currencies){
                    self.set('currency',currencies[0]);

                    return self.fetch('product.uom', null, null);
                }).then(function(units){
                    self.set('units',units);
                    var units_by_id = {},
                        i, len;
                    for(i = 0, len = units.length; i < len; i++){
                        units_by_id[units[i].id] = units[i];
                    }
                    self.set('units_by_id',units_by_id);
                    
                    return self.fetch('product.packaging', null, null);
                }).then(function(packagings){
                    self.set('product.packaging',packagings);
                    
                    return self.fetch('res.users', ['name','ean13'], [['ean13', '!=', false]]);
                }).then(function(users){
                    self.set('user_list',users);

                    return self.fetch('res.partner', ['name','ean13'], [['ean13', '!=', false]]);
                }).then(function(partners){
                    self.set('partner_list',partners);

                    return self.fetch('res.partner', ['name','vat','email','phone','contact_address'], [['customer', '=', true]]);
                }).then(function(customers){
                    self.db.add_customers(customers);
                    
                    return self.fetch('account.tax', ['amount', 'price_include', 'type']);
                }).then(function(taxes){
                    self.set('taxes', taxes);

                    return self.fetch(
                        'pos.session', 
                        ['id', 'journal_ids','name','user_id','config_id','start_at','stop_at'],
                        [['state', '=', 'opened'], ['user_id', '=', self.session.uid]]
                    );
                }).then(function(sessions){
                    self.set('pos_session', sessions[0]);

                    return self.fetch(
                        'pos.config',
                        ['name','journal_ids','shop_id','journal_id',
                         'iface_self_checkout', 'iface_led', 'iface_cashdrawer',
                         'iface_payment_terminal', 'iface_electronic_scale', 'iface_barscan', 'iface_vkeyboard',
                         'iface_print_via_proxy','iface_cashdrawer','state','sequence_id','session_ids'],
                        [['id','=', self.get('pos_session').config_id[0]]]
                    );
                }).then(function(configs){
                    var pos_config = configs[0];
                    self.set('pos_config', pos_config);
                    self.iface_electronic_scale    =  !!pos_config.iface_electronic_scale;  
                    self.iface_print_via_proxy     =  !!pos_config.iface_print_via_proxy;
                    self.iface_vkeyboard           =  !!pos_config.iface_vkeyboard; 
                    self.iface_self_checkout       =  !!pos_config.iface_self_checkout;
                    self.iface_cashdrawer          =  !!pos_config.iface_cashdrawer;

                    return self.fetch('sale.shop',[],[['id','=',pos_config.shop_id[0]]]);
                }).then(function(shops){
                    self.set('shop',shops[0]);

                    return self.fetch('product.packaging',['ean','product_id']);
                }).then(function(packagings){
                    self.db.add_packagings(packagings);

                    return self.fetch('pos.category', ['id','name','parent_id','child_id','image']);
                }).then(function(categories){
                    self.db.add_categories(categories);

                    return self.fetch(
                        'product.product', 
                        ['name', 'code', 'list_price','price','pos_categ_id', 'taxes_id', 'ean13', 
                         'to_weight', 'uom_id', 'uos_id', 'uos_coeff', 'mes_type', 'description_sale', 'description'],
                        [['sale_ok','=',true],['available_in_pos','=',true]],
                        {pricelist: self.get('shop').pricelist_id[0]} // context for price
                    );
                }).then(function(products){
                    self.db.add_products(products);
                    
                    return self.fetch('pos.tables', ['name', 'capacity'], [['company_id','=',self.get('company').id]]);
                }).then(function(tables){
                    self.db.add_tables(tables);
                    
                    return self.fetch('pos.order', ['name','session_id', 'id', 'lines','date_order', 'pos_reference', 'partner_id', 'creationDate'], [['state', '=', 'draft']]);
                }).then(function(orders){
                    self.load_orders(orders);

                    return self.fetch(
                        'account.bank.statement',
                        ['account_id','currency','journal_id','state','name','user_id','pos_session_id'],
                        [['state','=','open'],['pos_session_id', '=', self.get('pos_session').id]]
                    );
                }).then(function(bank_statements){
                    var journals = [];
                    _.each(bank_statements,function(statement) {
                        journals.push(statement.journal_id[0]);
                    });
                    self.set('bank_statements', bank_statements);
                    return self.fetch('account.journal', undefined, [['id','in', journals]]);
                }).then(function(journals){
                    self.set('journals',journals);

                    // associate the bank statements with their journals. 
                    var bank_statements = self.get('bank_statements'),
                        i, ilen, j, jlen;
                    for(i = 0, ilen = bank_statements.length; i < ilen; i++){
                        for(j = 0, jlen = journals.length; j < jlen; j++){
                            if(bank_statements[i].journal_id[0] === journals[j].id){
                                bank_statements[i].journal = journals[j];
                                bank_statements[i].self_checkout_payment_method = journals[j].self_checkout_payment_method;
                            }
                        }
                    }
                    self.set({'cashRegisters' : new module.CashRegisterCollection(self.get('bank_statements'))});
                });
            return loaded;
        }

    });

    // Extends module.Order to include tables related functions
    module.PosRestaurantOrder = module.Order;
    module.Order = module.PosRestaurantOrder.extend({
        // exports as JSON for receipt printing
        export_for_printing: function(){
            var dict = this._super(),
                table = this.get('table');
            if (typeof table !== 'undefined') {dict.table = table.name;}
            return dict;
        },
        
        exportAsJSON: function() {
            var dict = this._super(),
                table = this.get('table');
            if (typeof table !== 'undefined') {dict.table_id = table.id;}
            return dict;
        },
        
        setTable: function(table){
            this.set({'table': table});
        },
        
        get_table: function(){
            return this.get('table');
        },
        
        get_table_name: function(){
            var table = this.get('table');
            return table ? table.name : "";
        }
    });
    
}