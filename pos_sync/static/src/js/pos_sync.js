/*jslint plusplus: true */
/*jslint node: true, stupid: true */

/*
 * Function used for load syncro features on PoS
 */
function pos_syncro (instance, module){
    "use strict";
    
    /* ---------------- OpenERP Widgets -------------------------*/
   
    /*
     * Extending module.OrderButtonWidget
     * 
     * This allow to send to backend the current order when 
     * user switch to a new order
     * TODO: Does we must update new order before user start
     *       changing it's content¿?
     */
    module.OrderButtonWidget.include({
        selectOrder: function(event) {
            var currentOrder = this.pos.get('selectedOrder');
            // Only push order if is set
            if (currentOrder !== null) {
                this.pos.push_order(currentOrder.exportAsJSON());
            }
            this._super(event);
        }
    });
    
    /*
     * Extending module.PosWidget
     * 
     * This allow to register the callback function for sync button
     */
    module.PosWidget.include({
        start: function() {
            this._super();
            self.$('.sync-button').click(function(){
                self.pos.get_new_orders();
            });
        }
    });
    
     /* ---------------- Backbone Objects -------------------------*/
    
    /*
     * Extending OrderModel
     */
    // Override module.Order with PosSyncOrder
    module.PosSyncOrder = module.Order;
    module.Order = module.PosSyncOrder.extend({
        initialize: function(attributes){
            this._super(attributes);
            this.set({sync_key: 0});
        },
        
        exportAsJSON: function() {
            var dict = this._super();
            dict.sync_key = this.get('sync_key');
            return dict;
        }
    });
    
    
    /*
     * Extending PoSModel on our custom model
     */
    module.PosSyncModel = module.PosModel;
    module.PosModel = module.PosSyncModel.extend ({       
        // Update order with backend data
        update_order: function(order) {
            var self = this,
                j, len, product, oline;
            //Get current lines from remote database                         
            self.fetch('pos.order.line', ['product_id', 'qty', 'discount'], [['order_id', '=', order.get('order_id')]])
                .then(function(lines) {
                    for (j = 0, len = lines.length; j < len; j++) {
                        var line = lines[j],
                            orderLines = order.get('orderLines');
                        product = self.db.get_product_by_id(line.product_id[0]);
                        // Search order for current product
                        oline = orderLines.filter(function(current_line){
                            return current_line.product.id === product.id;
                        })[0];
                        // Update/add product on order
                        if (typeof oline !== 'undefined') {
                            oline.set_quantity(line.qty);
                        }
                        else { 
                            order.addProduct(new module.Product(product), {quantity:line.qty});
                        }                    
                        if (line.discount > 0) {order.getSelectedLine().set_discount(line.discount);}
                    }
                    return self.fetch('pos.order', ['sync_key'], [['id', '=', order.get('order_id')]]);
                })
                .then(function(data) {
                    //Update sync_key on model
                    order.set({sync_key: data[0].sync_key});
                });
        },

        _flush: function(index){

            var self = this,
                orders = this.db.get_orders(),
                order  = orders[index];
                
            self.set('nbr_pending_operations',orders.length);
            if(!order){
                return;
            }
            //try to push an order to the server
            // shadow : true is to prevent a spinner to appear in case of timeout
            (new instance.web.Model('pos.order')).call('update_pos',[order],undefined,{ shadow:true })
                .fail(function(unused, event){
                    //don't show error popup if it fails 
                    event.preventDefault();
                    console.error('Failed to send order:',order);
                    self._flush(index+1);
                })
                .done(function(order_data){
                    // Get current order name
                    var name = [order][0].data.name,
                        orderscollection = self.get('orders'),
                        model = orderscollection.findWhere({'name': name});
                    
                    // Add order_id & sync_key to backbone model
                    // Only relevant if order still exist
                    if(typeof model !== 'undefined') {
                        if (order_data === 'DELETE_ORDER') {
                            model.destroy();
                        }
                        else if (order_data === 'BAD_SYNC_KEY') {
                            self.update_order(model);
                            console.log('Order details got from backend, no changes done');
                        }
                        else {
                            model.set({order_id: order_data[1],
                                      sync_key: order_data[0]
                                      });
                        }
                    }

                    //remove from db if success
                    self.db.remove_order(order.id);
                    self._flush(index);
                });
        },
        
        load_orders: function(orders){
            var self = this,
                i, len, orderscollection;
            this._super(orders);
            // Get orderscollection from backbone model and
            // iterate to get the sync_key for each one
            orderscollection = self.get('orders');
            orderscollection.each(function(order) {
                self.fetch('pos.order', ['sync_key'], [['id', '=', order.get('order_id')]])
                    .then(function(data) {
                        order.set({sync_key: data[0].sync_key});
                    });
            });
        },
        
        get_new_orders: function(){
            var self = this,
                // Get all active orders on this PoS
                orders = self.get('orders'),
                i, len;
            self.fetch('pos.order', ['name','session_id', 'id', 'lines','date_order', 'pos_reference', 'partner_id', 'creationDate'], [['state', '=', 'draft']])
                .then(function(new_orders){
                    if(!new_orders instanceof Array){new_orders = [new_orders];}
                    for(i = 0, len = new_orders.length; i < len; i++){
                        var order = new_orders[i],
                            // Try to find the order on current orders
                            model = orders.findWhere({'order_id': order.id});
                        // Update or create the new order
                        if(typeof model !== 'undefined') {
                            self.update_order(order);
                        }
                        else {
                            self.create_order(order);
                        }
                    }
                });
        }
    });
}